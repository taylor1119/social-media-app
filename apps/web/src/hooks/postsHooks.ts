import { cloneDeep, pull } from 'lodash'
import { InfiniteData, useMutation } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { queryClient } from '..'
import { TPaginatedPost } from '../common/types'
import queryKeys from '../constants/reactQueryKeys'
import {
	deletePostQuery,
	dislikePostQuery,
	likePostQuery,
	updatePostQuery,
} from '../queries/posts'
import { currentUserState } from '../recoil/atoms'

import { IPost } from 'shared'

import { addPostQuery } from '../queries/posts'

export const useAddPost = () => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('current user not found')

	const queryKey = queryKeys.posts('timeline', currentUser.id)
	return useMutation(addPostQuery, {
		// When mutate is called:
		onMutate: async (newPostInput) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey)

			// Snapshot the previous value
			const previousConversation =
				queryClient.getQueryData<InfiniteData<IPost[]>>(queryKey)

			// Optimistically update to the new value
			const date = new Date()
			const newPost: IPost = {
				...newPostInput,
				id: 'placeholder-new-post-id-' + Math.random().toString(),
				author: {
					id: currentUser.id,
					userName: currentUser.userName,
					avatar: currentUser.avatar,
				},
				likes: [],
				dislikes: [],
				comments: [],
				createdAt: date,
				updatedAt: date,
			}

			queryClient.setQueryData<InfiniteData<IPost[]>>(
				queryKey,
				(old) => ({
					pages: old?.pages
						? [[newPost]].concat(old.pages)
						: [[newPost]],
					pageParams: old?.pageParams ?? [],
				})
			)

			// Return a context object with the snapshot value
			return { previousConversation }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.previousConversation)
		},

		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(queryKey)
		},
	})
}

export const useLikePost = (postId: string, page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	const { pathname } = useLocation()
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline'
	const params = useParams()
	const postsListOwner = params.userId ?? currentUser.id

	const queryKey = queryKeys.posts(listType, postsListOwner)
	return useMutation(() => likePostQuery(postId), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts'])

			// Snapshot the previous value
			const prevTimelinePosts =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(
					queryKey
				)

			const prevPost = prevTimelinePosts
				? cloneDeep(prevTimelinePosts.pages[page][index])
				: undefined

			// Optimistically update to the new value
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				if (old) {
					const post = old.pages[page][index]
					post.likes.push(currentUser.id)
					pull(post.dislikes, currentUser.id)
				}

				return old
			})

			// Return a context object with the snapshot value
			return { prevPost }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				const prevPost = context?.prevPost
				if (prevPost && old) {
					old.pages[prevPost.page][prevPost.index] = prevPost
				}
				return old
			})
		},
	})
}

export const useDislikePost = (postId: string, page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('you are not logged in')

	const { pathname } = useLocation()
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline'
	const params = useParams()
	const postsListOwner = params.userId ?? currentUser.id
	const queryKey = queryKeys.posts(listType, postsListOwner)

	return useMutation(() => dislikePostQuery(postId), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts'])

			// Snapshot the previous value
			const prevTimelinePosts =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(
					queryKey
				)

			const prevPost = prevTimelinePosts
				? cloneDeep(prevTimelinePosts.pages[page][index])
				: undefined

			// Optimistically update to the new value
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				if (old) {
					const post = old.pages[page][index]
					post.dislikes.push(currentUser.id)
					pull(post.likes, currentUser.id)
					if (listType === 'liked') old.pages[page].splice(index, 1)
				}
				return old
			})

			// Return a context object with the snapshot value
			return { prevPost }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				const prevPost = context?.prevPost
				if (prevPost && old) {
					listType === 'timeline'
						? (old.pages[prevPost.page][prevPost.index] = prevPost)
						: old.pages[prevPost.page].splice(
								prevPost.index,
								0,
								prevPost
							)
				}
				return old
			})
		},

		onSettled: () => {
			if (listType === 'liked') queryClient.invalidateQueries(queryKey)
		},
	})
}

export const useUpdatePost = (page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('current user not found')

	const { pathname } = useLocation()
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline'
	const params = useParams()
	const postsListOwner = params.userId ?? currentUser.id

	const queryKey = queryKeys.posts(listType, postsListOwner)
	return useMutation(updatePostQuery, {
		// When mutate is called:
		onMutate: async ({ postInput }) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts'])

			// Snapshot the previous value
			const prevTimelinePosts =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(
					queryKey
				)

			const prevPost = prevTimelinePosts
				? cloneDeep(prevTimelinePosts.pages[page][index])
				: undefined

			// Optimistically update to the new value
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				if (old) {
					const post = old?.pages[page][index]
					post.description = postInput.description
					post.img = postInput.img
				}
				return old
			})

			// Return a context object with the snapshot value
			return { prevPost }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				const prevPost = context?.prevPost
				if (prevPost && old) {
					old.pages[prevPost.page][prevPost.index] = prevPost
				}
				return old
			})
		},
	})
}

export const useDeletePost = (page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('current user not found')

	const { pathname } = useLocation()
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline'
	const params = useParams()
	const postsListOwner = params.userId ?? currentUser.id

	const queryKey = queryKeys.posts(listType, postsListOwner)
	return useMutation(deletePostQuery, {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts'])

			// Snapshot the previous value
			const prevTimelinePosts =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(
					queryKey
				)

			const prevPost = prevTimelinePosts
				? cloneDeep(prevTimelinePosts.pages[page][index])
				: undefined

			// Optimistically update to the new value
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				if (old) old.pages[page].splice(index, 1)
				return old
			})

			// Return a context object with the snapshot value
			return { prevPost }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<
				InfiniteData<TPaginatedPost[]> | undefined
			>(queryKey, (old) => {
				const prevPost = context?.prevPost
				if (prevPost && old)
					old.pages[prevPost.page].splice(prevPost.index, 0, prevPost)
				return old
			})
		},
	})
}
