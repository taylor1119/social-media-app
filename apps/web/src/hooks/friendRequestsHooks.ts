import { useMutation, useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { IFriendRequest } from 'shared'
import { queryClient } from '..'
import { TUiUser } from '../common/types'
import queryKeys from '../constants/reactQueryKeys'
import {
	acceptFriendRequestQuery,
	getReceivedFriendRequestsQuery,
	getSentFriendRequestsQuery,
	rejectFriendRequestQuery,
	sendFriendRequestQuery,
} from '../queries/friendRequests'
import { currentUserState } from '../recoil/atoms'

export const useAcceptFriendRequest = (friendRequester: TUiUser) => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	return useMutation(acceptFriendRequestQuery, {
		// When mutate is called:
		onMutate: async (requestId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['users', 'friends'])
			await queryClient.cancelQueries(['friend-requests'])

			// Snapshot the previous value
			const prevFriendsIds = queryClient.getQueryData<string[]>(
				queryKeys.friendsIds
			)
			const prevFriends = queryClient.getQueryData<TUiUser[]>(
				queryKeys.friends(currentUser.id)
			)
			const prevFriendRequesters = queryClient.getQueryData<TUiUser[]>(
				queryKeys.friendRequesters
			)
			const prevReceivedFriendRequests = queryClient.getQueryData<
				IFriendRequest[]
			>(queryKeys.receivedFriendRequests)
			const prevCurrentUser = currentUser

			// Optimistically update to the new value
			queryClient.setQueryData<string[]>(queryKeys.friendsIds, (old) =>
				old ? old.concat(friendRequester.id) : [friendRequester.id]
			)
			queryClient.setQueryData<TUiUser[]>(
				queryKeys.friends(currentUser.id),
				(old) => (old ? [friendRequester, ...old] : [friendRequester])
			)
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				(old) => old?.filter((request) => request.id !== requestId)
			)
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKeys.friendRequesters,
				(old) => old?.filter((user) => user.id !== friendRequester.id)
			)
			setCurrentUser((prev) =>
				prev
					? {
							...prev,
							friends: prev.friends.concat(friendRequester.id),
						}
					: null
			)

			// Return a context object with the snapshot value
			return {
				prevFriends,
				prevFriendRequesters,
				prevReceivedFriendRequests,
				prevCurrentUser,
				prevFriendsIds,
			}
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				context?.prevFriendsIds
			)
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKeys.friends(currentUser.id),
				context?.prevFriends
			)
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKeys.friendRequesters,
				context?.prevFriendRequesters
			)
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				context?.prevReceivedFriendRequests
			)
			setCurrentUser(context?.prevCurrentUser ?? null)
		},

		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(queryKeys.activeFriends)
		},
	})
}

export const useGetReceivedFriendRequests = () =>
	useQuery(queryKeys.receivedFriendRequests, getReceivedFriendRequestsQuery)

export const useGetSentFriendRequests = () =>
	useQuery(queryKeys.sentFriendRequests, getSentFriendRequestsQuery)

export const useSendFriendRequest = (target?: TUiUser) => {
	//const userSearchTerm = useRecoilValue(userSearchTermState);
	//const queryKey = ['users', 'search', userSearchTerm];
	if (!target) throw new Error('user not found')

	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	return useMutation(() => sendFriendRequestQuery(target?.id), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['friend-requests'])
			await queryClient.cancelQueries(['users'])

			// Snapshot the previous value
			const prevSentFriendsRequests = queryClient.getQueryData<
				IFriendRequest[]
			>(queryKeys.sentFriendRequests)
			const prevFriendRequestReceivers = queryClient.getQueryData<
				TUiUser[]
			>(queryKeys.friendRequestReceivers)

			// Optimistically update to the new value
			const date = new Date()
			const newReq: IFriendRequest = {
				id: Math.random().toString(),
				recipient: target?.id ?? '',
				requester: currentUser.id,
				createdAt: date,
				updatedAt: date,
				status: 'pending',
			}
			queryClient.setQueryData<IFriendRequest[]>(
				queryKeys.sentFriendRequests,
				(old) => (old ? [newReq, ...old] : [newReq])
			)

			queryClient.setQueryData<TUiUser[]>(
				queryKeys.friendRequestReceivers,
				(old) => (old ? [target, ...old] : [target])
			)

			// Return a context object with the snapshot value
			return { prevSentFriendsRequests, prevFriendRequestReceivers }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.sentFriendRequests,
				context?.prevSentFriendsRequests
			)
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKeys.sentFriendRequests,
				context?.prevFriendRequestReceivers
			)
		},
	})
}

export const useRejectFriendRequest = () =>
	useMutation(rejectFriendRequestQuery, {
		// When mutate is called:
		onMutate: async (requestId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['friend-requests'])

			// Snapshot the previous value
			const prevReceivedFriendRequests = queryClient.getQueryData<
				IFriendRequest[]
			>(queryKeys.receivedFriendRequests)

			const prevFriendRequestReceivers = queryClient.getQueryData<
				TUiUser[]
			>(queryKeys.friendRequestReceivers)

			// Optimistically update to the new value
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				(old) =>
					old?.filter((request) => {
						if (request?.id === requestId)
							queryClient.setQueryData<TUiUser[] | undefined>(
								queryKeys.friendRequestReceivers,
								(old) =>
									old?.filter(
										(user) => user.id !== request.requester
									)
							)
						return request.id !== requestId
					})
			)

			// Return a context object with the snapshot value
			return { prevReceivedFriendRequests, prevFriendRequestReceivers }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<IFriendRequest[] | undefined>(
				queryKeys.receivedFriendRequests,
				context?.prevReceivedFriendRequests
			)
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKeys.friendRequestReceivers,
				context?.prevFriendRequestReceivers
			)
		},
	})
