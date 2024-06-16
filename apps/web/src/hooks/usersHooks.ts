import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { TLoginInput, TSignUpInput, TUpdateUserInput } from 'shared'
import { queryClient } from '..'
import {
	TCurrentUser,
	TUiSignUpInput,
	TUiUpdateUserIntroInput,
	TUiUpdateUserProfileInput,
	TUiUser,
} from '../common/types'
import {
	loginValidationSchema,
	signUpValidationSchema,
	updateUserIntroValidationSchema,
	updateUserProfileValidationSchema,
} from '../common/validation'
import queryKeys from '../constants/reactQueryKeys'
import unfriendQuery from '../queries/unfriend'
import {
	getFriendsIdsQuery,
	getOnlineUsersIdsQuery,
	getUserByIdsQuery,
	getUsersByIdsQuery,
	loginQuery,
	logoutQuery,
	searchUsersByUserNameQuery,
	signUpQuery,
	updateUserQuery,
} from '../queries/users'
import { chatBoxesState, currentUserState } from '../recoil/atoms'
import { axiosInstance } from '../services/axios'

export const useUpdateUserProfile = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	const useFormReturn = useForm<TUiUpdateUserProfileInput>({
		resolver: yupResolver(updateUserProfileValidationSchema),
		defaultValues: {
			avatar: currentUser.avatar,
			cover: currentUser.cover,
			userName: currentUser.userName,
			email: currentUser.email,
			confirmEmail: currentUser.email,
		},
	})

	const useMutationReturn = useMutation<
		unknown,
		//TODO move type def elsewhere
		AxiosError<{ userName?: string; email?: string }>,
		TUpdateUserInput
	>(updateUserQuery, {
		onSuccess: (_, input) =>
			setCurrentUser((prev) => (!prev ? null : { ...prev, ...input })),
	})

	const onSubmit = useFormReturn.handleSubmit((input) => {
		delete input.confirmEmail
		delete input.confirmPassword
		useMutationReturn.mutate(input)
	})

	return { useFormReturn, useMutationReturn, onSubmit }
}

export const useUpdateUserIntro = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	const useFormReturn = useForm<TUiUpdateUserIntroInput>({
		resolver: yupResolver(updateUserIntroValidationSchema),
		defaultValues: {
			address: currentUser?.intro?.address,
			bio: currentUser?.intro?.bio,
			from: currentUser?.intro?.from,
			relationshipStatus: currentUser?.intro?.relationshipStatus,
			studiedAt: currentUser?.intro?.studiedAt,
			studiesAt: currentUser?.intro?.studiesAt,
			work: currentUser?.intro?.work,
		},
	})

	const useMutationReturn = useMutation<
		unknown,
		//TODO move type def elsewhere
		AxiosError<{ userName?: string; email?: string }>,
		TUpdateUserInput
	>(updateUserQuery, {
		onSuccess: (_, input) =>
			setCurrentUser((prev) => (!prev ? null : { ...prev, ...input })),
	})

	const onSubmit = useFormReturn.handleSubmit((intro) =>
		useMutationReturn.mutate({ intro })
	)

	return { useFormReturn, useMutationReturn, onSubmit }
}

export const useSignUp = () => {
	const useFormReturn = useForm<TUiSignUpInput>({
		resolver: yupResolver(signUpValidationSchema),
	})
	const useMutationReturn = useMutation<
		unknown,
		//TODO move type def elsewhere
		AxiosError<{ userName?: string; email?: string }>,
		TSignUpInput
	>(signUpQuery)

	useEffect(() => {
		if (useMutationReturn.isSuccess) useFormReturn.reset()
	}, [useFormReturn, useMutationReturn.isSuccess])

	const onSubmit = useFormReturn.handleSubmit(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		({ confirmEmail, confirmPassword, ...input }) =>
			useMutationReturn.mutate(input)
	)

	return { useFormReturn, useMutationReturn, onSubmit }
}

export const useLogin = () => {
	const useFormReturn = useForm<TLoginInput>({
		resolver: yupResolver(loginValidationSchema),
	})
	const useMutationResult = useMutation<
		TCurrentUser,
		AxiosError,
		TLoginInput
	>(loginQuery)

	const onSubmit = useFormReturn.handleSubmit((loginInput) =>
		useMutationResult.mutate(loginInput)
	)

	const setCurrentUser = useSetRecoilState(currentUserState)
	const navigate = useNavigate()
	const from = useLocation().state?.from?.pathname ?? '/'

	const { data, isSuccess } = useMutationResult
	useEffect(() => {
		if (isSuccess) {
			setCurrentUser(data)
			axiosInstance.defaults.headers.common['csrf-token'] = data.csrfToken
			navigate(from, { replace: true })
		}
	}, [data, from, isSuccess, navigate, setCurrentUser])

	return { useFormReturn, useMutationResult, onSubmit }
}

export const useLogout = () => {
	const logout = async () => {
		try {
			await logoutQuery()
		} catch (error) {
			console.error(error)
		}
		localStorage.clear()
		window.location.reload()
	}
	return logout
}

export const useGetOnlineUsersIds = () =>
	useQuery(queryKeys.activeFriends, getOnlineUsersIdsQuery)

export const useUnfriend = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	const [chatBoxes, setChatBoxes] = useRecoilState(chatBoxesState)

	const queryKey = queryKeys.friends(currentUser.id)
	return useMutation(unfriendQuery, {
		onMutate: async (targetId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey)

			// Snapshot the previous value
			const prevFriends = queryClient.getQueryData<TUiUser[]>(queryKey)
			const prevFriendsIds = queryClient.getQueryData<string[]>(
				queryKeys.friendsIds
			)
			const prevCurrentUser = currentUser
			const prevChatBoxes = chatBoxes

			// Optimistically update to the new value
			queryClient.setQueryData<TUiUser[] | undefined>(queryKey, (old) =>
				old?.filter((friend) => friend.id !== targetId)
			)
			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				(old) => old?.filter((friendId) => friendId !== targetId)
			)
			setCurrentUser((prev) =>
				prev
					? {
							...prev,
							friends: prev?.friends.filter(
								(friendId) => friendId !== targetId
							),
						}
					: null
			)

			setChatBoxes((prev) => {
				const { minimized, open } = prev
				minimized.delete(targetId ?? '')
				open.delete(targetId ?? '')
				return { minimized, open }
			})

			// Return a context object with the snapshot value
			return {
				prevFriends,
				prevCurrentUser,
				prevChatBoxes,
				prevFriendsIds,
			}
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKey,
				context?.prevFriends
			)
			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				context?.prevFriendsIds
			)
			setCurrentUser(context?.prevCurrentUser ?? null)
			setChatBoxes(
				context?.prevChatBoxes ?? {
					minimized: new Map(),
					open: new Map(),
				}
			)
		},
	})
}

export const useSearchUsersByUserName = (searchTerm?: string) =>
	useQuery(
		queryKeys.searchUsers(searchTerm),
		() => searchUsersByUserNameQuery(searchTerm),
		{ enabled: Boolean(searchTerm && searchTerm.length > 2) }
	)

export const useGetUsersById = (
	userIds: string[] = [],
	queryKey: string | (string | undefined)[]
) =>
	useQuery(queryKey, () => getUsersByIdsQuery(userIds), {
		enabled: Boolean(userIds.length > 0),
	})

export const useGetUserById = (userId?: string) =>
	useQuery(queryKeys.user(userId), () => getUserByIdsQuery(userId))

export const useGetCurrentUserFriendsIds = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	return useQuery(queryKeys.friendsIds, getFriendsIdsQuery, {
		initialData: currentUser.friends,
		onSuccess(data) {
			setCurrentUser((prev) => (prev ? { ...prev, friends: data } : null))
		},
	})
}

export const useGetCurrentUserFriends = () => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	const { data: friendsIds } = useGetCurrentUserFriendsIds()

	return useQuery(
		queryKeys.friends(currentUser.id),
		() => getUsersByIdsQuery(friendsIds),
		{ enabled: Boolean(friendsIds?.length) }
	)
}
