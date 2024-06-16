import { IChatMessage, TChatMessageInput } from 'shared'
import { axiosInstance } from '../services/axios'

export const sendChatMessagesQuery = async (
	chatMessageInput: TChatMessageInput
): Promise<unknown> => {
	const { data } = await axiosInstance.post('/messages', chatMessageInput, {
		withCredentials: true,
	})
	return data
}

export const getConversationQuery = async (
	conversationMembers: string[]
): Promise<IChatMessage[]> => {
	if (conversationMembers.length <= 0)
		Promise.reject(new Error('Invalid body'))

	const { data } = await axiosInstance.post(
		'/messages/conversation',
		conversationMembers,
		{ withCredentials: true }
	)

	return data
}

export const getUnreadMessagesQuery = async (): Promise<IChatMessage[]> => {
	const { data } = await axiosInstance.get('/messages/unread', {
		withCredentials: true,
	})
	return data
}

export const setMessagesToViewedQuery = async (
	messageIds: string[]
): Promise<IChatMessage[]> => {
	if (messageIds.length <= 0) Promise.reject(new Error('Invalid body'))

	const { data } = await axiosInstance.post('/messages/viewed', messageIds, {
		withCredentials: true,
	})

	return data
}

export const setMessagesToReceivedQuery = async (
	messageIds: string[]
): Promise<IChatMessage[]> => {
	if (messageIds.length <= 0) Promise.reject(new Error('Invalid body'))

	const { data } = await axiosInstance.post(
		'/messages/received',
		messageIds,
		{
			withCredentials: true,
		}
	)

	return data
}
