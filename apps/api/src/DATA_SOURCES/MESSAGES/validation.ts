import Joi from 'joi'
import { TChatMessageInput } from 'shared'

export const createMessageValidationSchema = Joi.object<TChatMessageInput>({
	targetId: Joi.string().required(),
	senderId: Joi.string().required(),
	text: Joi.string().required(),
})
