import Joi from 'joi';
import { TPostInput } from './types';

export const createPostValidationSchema = Joi.object<TPostInput>({
	description: Joi.string().required(),
	img: Joi.string().uri(),
});

export const updatePostValidationSchema = Joi.object<TPostInput>({
	description: Joi.string(),
	img: Joi.string().uri(),
});
