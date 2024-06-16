import { IFriendRequest } from 'shared'
import { axiosInstance } from '../services/axios'

export const sendFriendRequestQuery = async (
	targetId?: string
): Promise<string> => {
	if (!targetId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.post(
		`/friend-requests/send/${targetId}`,
		null,
		{ withCredentials: true }
	)
	return data
}

export const acceptFriendRequestQuery = async (
	requestId?: string
): Promise<string> => {
	if (!requestId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.put(
		`/friend-requests/accept/${requestId}`,
		null,
		{ withCredentials: true }
	)
	return data
}

export const rejectFriendRequestQuery = async (
	requestId?: string
): Promise<string> => {
	if (!requestId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.put(
		`/friend-requests/reject/${requestId}`,
		null,
		{ withCredentials: true }
	)
	return data
}

export const getSentFriendRequestsQuery = async (): Promise<
	IFriendRequest[]
> => {
	const { data } = await axiosInstance.get('/friend-requests/sent', {
		withCredentials: true,
	})
	return data
}

export const getReceivedFriendRequestsQuery = async (): Promise<
	IFriendRequest[]
> => {
	const { data } = await axiosInstance.get('/friend-requests/received', {
		withCredentials: true,
	})
	return data
}
