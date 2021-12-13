import { NextFunction, Request, Response } from 'express';

export interface IErrorWithCode extends Error {
	code?: string | number;
}
export const isErrorWithCode = (
	error: IErrorWithCode
): error is IErrorWithCode => error.code !== undefined;

export interface IAsyncRequestHandler {
	(req: Request, res: Response, next: NextFunction): Promise<unknown>;
}
