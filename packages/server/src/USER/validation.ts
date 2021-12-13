import Joi from 'joi';
import { TLoginInput, TSignUpInput, TUpdateUser } from './types';

export const signupValidationSchema = Joi.object<TSignUpInput>({
	username: Joi.string(),
	password: Joi.string().min(8),
	profilePicture: Joi.string().uri(),
});

export const loginValidationSchema = Joi.object<TLoginInput>({
	username: Joi.string(),
	password: Joi.string().min(8),
});

export const updateValidationSchema = Joi.object<TUpdateUser>({
	followings: Joi.array().items(Joi.string()),
	followers: Joi.array().items(Joi.string()),
	password: Joi.string().min(8),
	username: Joi.string(),
	profilePicture: Joi.string().uri(),
});
