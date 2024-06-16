import { IAsyncRequestHandler } from '../../common/interfaces'
import { catchAsyncReqHandlerErr } from '../../common/middlewares'
import { socketConnections } from '../../config/socket'
import messagesModel from './model'

const createMessageUnsafe: IAsyncRequestHandler = async (req, res) => {
	const senderId = req.currentUserId as string
	const targetId = req.messageInput?.targetId as string

	const message = await messagesModel.create({
		senderId,
		...req.messageInput,
	})

	socketConnections.get(targetId)?.send(
		JSON.stringify({
			type: 'chat-message',
			payload: message,
		})
	)

	res.status(200).json(message)
}

const updateMessageUnsafe: IAsyncRequestHandler = async () => {
	throw new Error('Not Implemented')
}

const removeMessageUnsafe: IAsyncRequestHandler = async () => {
	throw new Error('Not Implemented')
}

const getMessagesByConversationMembersUnsafe: IAsyncRequestHandler = async (
	req,
	res
) => {
	const userIds = req.dBDocIds
	const messages = await messagesModel
		.find({
			targetId: { $in: userIds },
			senderId: { $in: userIds },
		})
		.sort({ createdAt: 1 })

	if (!messages) {
		res.status(400).json({ error: 'no messages found' })
		return
	}

	res.status(200).json(messages)
}

const getUnreadMessagesUnsafe: IAsyncRequestHandler = async (req, res) => {
	const messages = await messagesModel
		.find({
			targetId: req.currentUserId,
			status: { $ne: 'viewed' },
		})
		.sort({ createdAt: 1 })

	if (!messages) {
		res.status(400).json({ error: 'no messages found' })
		return
	}

	res.status(200).json(messages)
}

const setMessagesToViewedUnsafe: IAsyncRequestHandler = async (req, res) => {
	const messages = await messagesModel.updateMany(
		{ _id: { $in: req.dBDocIds } },
		{ status: 'viewed' }
	)

	if (!messages) {
		res.status(404).json({ error: 'no messages found' })
		return
	}

	res.status(200).end()
}

const setMessagesToReceivedUnsafe: IAsyncRequestHandler = async (req, res) => {
	const messages = await messagesModel.updateMany(
		{ _id: { $in: req.dBDocIds } },
		{ status: 'received' }
	)

	if (!messages) {
		res.status(404).json({ error: 'no messages found' })
		return
	}

	res.status(200).end()
}

export const createMessage = catchAsyncReqHandlerErr(createMessageUnsafe)
export const getMessagesByConversationMembers = catchAsyncReqHandlerErr(
	getMessagesByConversationMembersUnsafe
)
export const updateMessage = catchAsyncReqHandlerErr(updateMessageUnsafe)
export const removeMessage = catchAsyncReqHandlerErr(removeMessageUnsafe)
export const getUnreadMessages = catchAsyncReqHandlerErr(
	getUnreadMessagesUnsafe
)
export const setMessagesToViewed = catchAsyncReqHandlerErr(
	setMessagesToViewedUnsafe
)
export const setMessagesToReceived = catchAsyncReqHandlerErr(
	setMessagesToReceivedUnsafe
)
