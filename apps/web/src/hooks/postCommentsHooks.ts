import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { IPostComment, TPostCommentInput } from 'shared'
import { queryClient } from '..'
import queryKeys from '../constants/reactQueryKeys'
import {
	deletePostCommentQuery,
	updatePostCommentQuery,
} from '../queries/postComments'
import { currentUserState } from '../recoil/atoms'

import { pull } from 'lodash'
import { InfiniteData } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import { IPost } from 'shared'
import { addPostCommentQuery } from '../queries/postComments'

export const useAddPostComment = (postId?: string) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('current user not found')

	const params = useParams()
	const postsListOwner = params.userId ?? currentUser.id

	const { pathname } = useLocation()
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline'

	const queryKey = queryKeys.postComments(postId)

	const mutate = (commentInput: TPostCommentInput) =>
		addPostCommentQuery(commentInput, postId)

	return useMutation(mutate, {
		onMutate: async (commentInput) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey)

			// Snapshot the previous value
			const previousConversation =
				queryClient.getQueryData<IPostComment[]>(queryKey)

			// Optimistically update to the new value
			const date = new Date()
			const newComment: IPostComment = {
				...commentInput,
				id:
					'placeholder-new-post-comment-id-' +
					Math.random().toString(),
				postId: postId ?? '',
				author: {
					id: currentUser.id,
					userName: currentUser.userName,
					avatar: currentUser.avatar,
				},
				likes: [],
				dislikes: [],
				createdAt: date,
				updatedAt: date,
			}

			queryClient.setQueryData<IPostComment[]>(queryKey, (old) =>
				old ? [newComment].concat(old) : [newComment]
			)

			// Return a context object with the snapshot value
			return { previousConversation }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.previousConversation)
		},

		//add the comment id to the post
		onSuccess: ({ id: postCommentId }) => {
			queryClient.setQueryData<IPostComment[] | undefined>(
				queryKey,
				(old) => {
					if (old) old[0].id = postCommentId
					return old
				}
			)

			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.posts(listType, postsListOwner),
				(old) => {
					old?.pages.every((page) =>
						page.every((post) =>
							post.id === postId
								? !post.comments.push(postCommentId)
								: true
						)
					)
					return old
				}
			)
		},
	})
}

export const useUpdatePostComment = (
	postCommentId?: string,
	postId?: string
) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('current user not found')

	const queryKey = queryKeys.postComments(postId)

	const mutate = (commentInput: TPostCommentInput) =>
		updatePostCommentQuery(commentInput, postCommentId)

	return useMutation(mutate, {
		onMutate: async (commentInput) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey)

			// Snapshot the previous value
			const prevPostComments =
				queryClient.getQueryData<IPostComment[]>(queryKey)

			// Optimistically update to the new value
			queryClient.setQueryData<IPostComment[] | undefined>(
				queryKey,
				(old) =>
					old?.map((postComment) =>
						postComment.id === postCommentId
							? {
									...postComment,
									...commentInput,
								}
							: postComment
					)
			)

			// Return a context object with the snapshot value
			return { prevPostComments }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.prevPostComments)
		},
	})
}

export const useDeletePostComment = (
	postCommentId?: string,
	postId?: string
) => {
	const currentUser = useRecoilValue(currentUserState)
	if (!currentUser) throw new Error('current user not found')

	const params = useParams()
	const postsListOwner = params.userId ?? currentUser.id

	const { pathname } = useLocation()
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline'

	const queryKey = queryKeys.postComments(postId)
	return useMutation(() => deletePostCommentQuery(postCommentId), {
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey)

			// Snapshot the previous value
			const prevPostComments =
				queryClient.getQueryData<IPostComment[]>(queryKey)

			// Optimistically update to the new value
			queryClient.setQueryData<IPostComment[] | undefined>(
				queryKey,
				(old) =>
					old?.filter(
						(postComment) => postComment.id !== postCommentId
					)
			)

			// Return a context object with the snapshot value
			return { prevPostComments }
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.prevPostComments)
		},

		onSuccess: () => {
			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.posts(listType, postsListOwner),
				(old) => {
					old?.pages.every((page) =>
						page.every((post) => {
							if (post.id === postId) {
								pull(post.comments, postCommentId)
								return false
							}
							return true
						})
					)
					return old
				}
			)
		},
	})
}
