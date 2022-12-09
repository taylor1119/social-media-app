import cookie from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import WebSocket from 'ws';
import { errorRequestHandler } from '../common/middlewares';
import router from './router';
import { CLIENT_ORIGIN, COOKIE_SECRET, IS_PROD } from './secrets';

const app = express();

//cors for dev env
if (!IS_PROD) app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Enabling helmet
app.use(helmet({ contentSecurityPolicy: false }));

// Prevent http param pollution
app.use(hpp());

//parse json body
app.use(express.json());

// Limiting each IP to 100 requests per windowMs
if (IS_PROD) {
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100,
	});

	app.use('/api', limiter);
}

// Dev logging middleware
if (!IS_PROD) {
	app.use(morgan('dev'));
}

//Hash map of userIds as key and socket connection as values
export const socketConnections = new Map<string, WebSocket.WebSocket>();

//Set up cookie parser
export const cookieParser = cookie(COOKIE_SECRET);
app.use(cookieParser);

app.use('/api', router);

// Serve static assets in production
app.use('/static', express.static(path.join(__dirname, '../../static')));

// Serve client build in production
if (IS_PROD) {
	app.use(express.static(path.join(__dirname, '../../../client/build')));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, '../../../client/build', 'index.html'));
	});
}

//set error handler
app.use(errorRequestHandler);

export default app;
