import csurf from 'csurf';
import { ErrorRequestHandler, RequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { TJwtUser } from 'src/USER/types';
import { IS_PROD, JWT_SECRET } from '../config/secrets';
import { IAsyncRequestHandler, isErrorWithCode } from './interfaces';

export const validateInput =
	(validationSchema: Joi.ObjectSchema): RequestHandler =>
	(req, res, next) => {
		const { error, value } = validationSchema.validate(req.body);
		if (error) {
			res.status(400).json({
				error: 'validation error',
			});
			return;
		}

		res.locals.validatedBody = value;
		next();
	};

export const catchAsyncRequestHandlerError =
	(
		handler: IAsyncRequestHandler,
		errorHandler?: ErrorRequestHandler
	): IAsyncRequestHandler =>
	(req, res, next) =>
		handler(req, res, next).catch((err) =>
			errorHandler ? errorHandler(err, req, res, next) : next(err)
		);

export const csrfLogin = csurf({
	ignoreMethods: ['POST'],
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
});

export const csrfProtection = csurf({
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
});

export const authenticate =
	(options?: { isAdmin?: boolean }): RequestHandler =>
	(req, res, next) => {
		try {
			const currentUser = jwt.verify(
				req.signedCookies.cookieToken,
				JWT_SECRET
			) as unknown as TJwtUser;

			if (options?.isAdmin && !currentUser.isAdmin) {
				res.status(403).json({ error: 'not authorized' });
				return;
			}

			res.locals = { currentUser };
			next();
		} catch (_error) {
			res.clearCookie('token');
			res.status(403).json({ error: 'invalid token' });
		}
	};
export const handlePassedError: ErrorRequestHandler = (err, req, res, next) => {
	if (isErrorWithCode(err)) {
		if (err.code === 'EBADCSRFTOKEN') {
			res.clearCookie('token');
			res.status(403).json({ error: 'form tampered with' });
			return;
		}
	}

	if (err instanceof Error) {
		res.status(500).json({
			error: 'internal server error',
		});
		next(err);
	}
};
