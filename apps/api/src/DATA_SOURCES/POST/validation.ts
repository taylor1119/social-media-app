import Joi from 'joi'
import { TPostInput } from 'shared'
import { dbDocIdValidationSchema } from '../../common/validation'

export const createPostValidationSchema = Joi.object<TPostInput>({
	description: Joi.string().required(),
	img: Joi.string().uri(),
})

export const updatePostValidationSchema = Joi.object<TPostInput>({
	description: Joi.string(),
	img: Joi.string().uri(),
})

export const getPostsWithImagesValidationSchema = Joi.object({
	postId: dbDocIdValidationSchema,
	authorId: Joi.when('postId', {
		is: Joi.exist(),
		then: Joi.forbidden(),
		otherwise: dbDocIdValidationSchema.required(),
	}),
	date: Joi.when('postId', {
		is: Joi.exist(),
		then: Joi.forbidden(),
		otherwise: Joi.number().required(),
	}),
})
