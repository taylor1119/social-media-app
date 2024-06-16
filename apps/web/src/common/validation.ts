import { isEmpty } from 'lodash'
import { mixed, object, ref, string } from 'yup'

const transformFunction = (val: unknown) => (val ? val : undefined)

export const signUpValidationSchema = object({
	userName: string().required('Username is a required field'),
	avatar: string().url().transform(transformFunction),
	email: string().email().required('Email is a required field'),
	confirmEmail: string()
		.email()
		.required('Email is a required field')
		.oneOf([ref('email')], 'Emails do es not match'),
	password: string().min(8).required(),
	confirmPassword: string()
		.required('Password is a required field')
		.oneOf([ref('password')], 'Passwords do not match'),
})

export const loginValidationSchema = object({
	email: string().required('Email is a required field'),
	password: string().required(),
})

export const chatMessageSchema = object({
	text: string().required('cant sent empty chat message'),
})

export const searchUserInputSchema = object({
	text: string().min(3).required('cant search an empty string'),
})

export const updateUserProfileValidationSchema = object({
	userName: string().transform(transformFunction),
	avatar: string().url().transform(transformFunction),
	cover: string().url().transform(transformFunction),
	email: string().email().transform(transformFunction),
	confirmEmail: string()
		.email()
		.transform(transformFunction)
		.oneOf([ref('email')], 'Emails do not match'),
	password: string().min(8).transform(transformFunction),
	confirmPassword: string()
		.transform(transformFunction)
		.oneOf([ref('password')], 'Passwords do not match'),
}).test('notEmpty', function (value) {
	return isEmpty(value)
		? this.createError({
				path: this.path,
				message: 'fill at least on filled',
			})
		: true
})

export const updateUserIntroValidationSchema = object({
	bio: string().transform(transformFunction),
	address: string().transform(transformFunction),
	from: string().transform(transformFunction),
	work: string().transform(transformFunction),
	studiesAt: string().transform(transformFunction),
	studiedAt: string().transform(transformFunction),
	relationshipStatus: mixed<
		| 'Single'
		| 'Married'
		| 'Engaged'
		| 'In A Relationship'
		| 'Its Complicated'
	>().transform((val: unknown) => (val || val === '' ? val : undefined)),
}).test('notEmpty', function (value) {
	return isEmpty(value)
		? this.createError({
				path: this.path,
				message: 'fill at least on filled',
			})
		: true
})

export const updatePostValidationSchema = object({
	description: string().required('This field is required'),
	img: string().transform(transformFunction),
})
