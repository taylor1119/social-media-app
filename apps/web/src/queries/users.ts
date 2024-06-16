import {
	TLoginInput,
	TMockAccount,
	TSignUpInput,
	TUpdateUserInput,
} from 'shared/'
import { TCurrentUser, TUiUser } from '../common/types'
import { axiosInstance } from '../services/axios'

export const signUpQuery = async (
	signUpInput: TSignUpInput
): Promise<unknown> => {
	const { data } = await axiosInstance.post('/users/signup', signUpInput, {
		withCredentials: true,
	})
	return data
}

export const loginQuery = async (user: TLoginInput): Promise<TCurrentUser> => {
	const { data } = await axiosInstance.post('/users/login', user, {
		withCredentials: true,
	})
	return data
}

export const logoutQuery = async () =>
	await axiosInstance.delete('/users/logout', {
		withCredentials: true,
	})

export const getUserByIdsQuery = async (userId?: string): Promise<TUiUser> => {
	if (!userId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.get(`/users/${userId}`, {
		withCredentials: true,
	})
	return data
}

export const getUsersByIdsQuery = async (
	userIds?: string[]
): Promise<TUiUser[]> => {
	if (!userIds) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.post('/users/list', userIds, {
		withCredentials: true,
	})
	return data
}

export const getFriendsIdsQuery = async (): Promise<string[]> => {
	const { data } = await axiosInstance.get('/users/friends/ids', {
		withCredentials: true,
	})
	return data
}

export const getOnlineUsersIdsQuery = async (): Promise<string[]> => {
	const { data } = await axiosInstance.get('/users/online', {
		withCredentials: true,
	})
	return data
}

export const searchUsersByUserNameQuery = async (
	userName?: string
): Promise<TUiUser[]> => {
	if (!userName) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.get(`/users/search/${userName}`, {
		withCredentials: true,
	})
	return data
}

export const updateUserQuery = async (
	updateUserInput?: TUpdateUserInput
): Promise<unknown> => {
	if (!updateUserInput) Promise.reject(new Error('Invalid input'))
	const { data } = await axiosInstance.put(
		'/users/update/',
		updateUserInput,
		{
			withCredentials: true,
		}
	)
	return data
}

export const getAccountsQuery = async (): Promise<TMockAccount[]> => {
	const { data } = await axiosInstance.get('/users/accounts', {
		withCredentials: true,
	})
	return data
}
