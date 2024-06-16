import Joi from 'joi'
import { isValidObjectId } from 'mongoose'

export const dbDocIdValidationSchema = Joi.string().custom((id, helpers) =>
	isValidObjectId(id) ? id : helpers.message({ custom: 'invalid doc Id' })
)

export const dbDocIdsValidationSchema = Joi.array()
	.min(1)
	.items(dbDocIdValidationSchema)
	.unique()
	.required()
