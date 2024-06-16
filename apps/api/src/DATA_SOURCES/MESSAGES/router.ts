import { Router } from 'express'
import { authenticate, validateInput } from '../../common/middlewares'
import { dbDocIdsValidationSchema } from '../../common/validation'
import {
	createMessage,
	getMessagesByConversationMembers,
	getUnreadMessages,
	setMessagesToReceived,
	setMessagesToViewed,
} from './controllers'
import { createMessageValidationSchema } from './validation'

const messagesRouter = Router()

messagesRouter.post(
	'/',
	authenticate,
	validateInput(createMessageValidationSchema, 'messageInput'),
	createMessage
)

messagesRouter.post(
	'/conversation',
	authenticate,
	validateInput(dbDocIdsValidationSchema, 'dBDocIds'),
	getMessagesByConversationMembers
)

messagesRouter.get('/unread', authenticate, getUnreadMessages)

messagesRouter.post(
	'/viewed',
	authenticate,
	validateInput(dbDocIdsValidationSchema, 'dBDocIds'),
	setMessagesToViewed
)

messagesRouter.post(
	'/received',
	authenticate,
	validateInput(dbDocIdsValidationSchema, 'dBDocIds'),
	setMessagesToReceived
)

export default messagesRouter
