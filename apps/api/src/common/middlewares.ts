import csurf from 'csurf'
import { ErrorRequestHandler, RequestHandler } from 'express'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import { IS_PROD, JWT_SECRET } from '../config/secrets'
import { MESSAGE_INPUT } from '../DATA_SOURCES/MESSAGES/strings'
import { POST_INPUT } from '../DATA_SOURCES/POST/strings'
import { POST_COMMENT_INPUT } from '../DATA_SOURCES/POST_COMMENT/strings'
import {
	COOKIE_NAME,
	LOGIN_INPUT,
	SIGNUP_INPUT,
	UPDATE_USER_INPUT,
} from '../DATA_SOURCES/USER/strings'
import {
	IAsyncRequestHandler,
	IDuplicationError,
	isErrorWithCode,
} from './interfaces'
import { DB_DOC_IDS } from './strings'
import { isMongoServerError } from './utils'

type TValidInputKeys =
	| typeof LOGIN_INPUT
	| typeof SIGNUP_INPUT
	| typeof UPDATE_USER_INPUT
	| typeof MESSAGE_INPUT
	| typeof POST_INPUT
	| typeof POST_COMMENT_INPUT
	| typeof DB_DOC_IDS

export const validateInput =
	(
		validationSchema: Joi.AnySchema,
		validInputKey: TValidInputKeys
	): RequestHandler =>
	(req, res, next) => {
		const { error, value } = validationSchema.validate(req.body)
		if (error) {
			res.status(400).json({
				error: 'validation error',
			})
			return
		}

		req[validInputKey] = value
		next()
	}

export const catchAsyncReqHandlerErr =
	(handler: IAsyncRequestHandler): IAsyncRequestHandler =>
	(req, res, next) =>
		handler(req, res, next).catch((err) => next(err))

export const csrfLogin = csurf({
	ignoreMethods: ['POST'],
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
})

export const csrfProtection = csurf({
	cookie: {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	},
})

export const authenticate: RequestHandler = async (req, res, next) => {
	try {
		const currentUserId = jwt
			.verify(req.signedCookies[COOKIE_NAME], JWT_SECRET)
			.toString()
		req.currentUserId = currentUserId
		next()
	} catch (_error) {
		res.clearCookie(COOKIE_NAME)
		res.status(403).json({ error: 'invalid cookie' })
	}
}

export const errorRequestHandler: ErrorRequestHandler = (
	err,
	req,
	res,
	//HACK does not work without it don't know why
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next
) => {
	//catch mongodb duplication error
	if (isMongoServerError(err) && err.code === 11000) {
		const duplicationError: IDuplicationError = {}
		Object.keys(err.keyPattern).forEach((key) => {
			duplicationError[key] = `This ${key} is already used`
		})
		res.status(500).json(duplicationError)
		return
	}

	//catch CSRF error
	else if (isErrorWithCode(err) && err.code === 'EBADCSRFTOKEN') {
		res.clearCookie('token')
		res.status(403).json({ error: 'form tampered with' })
		return
	}

	//catch any other errors
	else {
		res.status(500).json({
			error: 'internal server error',
		})
		return
	}
}
