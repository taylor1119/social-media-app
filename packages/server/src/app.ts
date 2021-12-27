import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { csrfProtection, handlePassedError } from './common/middlewares';
import { COOKIE_SECRET } from './config/secrets';
import postRouter from './POST/router';
import userRouter from './USER/router';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(morgan('common'));

app.get('/api', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/users', userRouter);
app.use(csrfProtection);
app.use('/api/posts', postRouter);

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.use(handlePassedError);

export default app;
