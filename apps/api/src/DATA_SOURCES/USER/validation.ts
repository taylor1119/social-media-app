import Joi from 'joi'
import { TLoginInput, TSignUpInput, TUpdateUserInput } from 'shared'

export const signupValidationSchema = Joi.object<TSignUpInput>({
	userName: Joi.string(),
	email: Joi.string().trim().email(),
	password: Joi.string().min(8),
	avatar: Joi.string().uri().optional(),
})

export const loginValidationSchema = Joi.object<TLoginInput>({
	email: Joi.string().trim().email(),
	password: Joi.string().min(8),
})

export const updateUserValidationSchema = Joi.object<TUpdateUserInput>({
	userName: Joi.string().min(3).trim(),
	email: Joi.string().trim().email(),
	avatar: Joi.string().uri(),
	password: Joi.string().min(8),
	cover: Joi.string().uri(),
	intro: Joi.object({
		bio: Joi.string().min(3).trim(),
		address: Joi.string().min(3).trim(),
		from: Joi.string().min(3).trim(),
		work: Joi.string().min(3).trim(),
		studiesAt: Joi.string().min(3).trim(),
		studiedAt: Joi.string().min(3).trim(),
		relationshipStatus: Joi.string().valid(
			'Single',
			'Married',
			'Engaged',
			'In A Relationship',
			'Its Complicated'
		),
	}),
})
