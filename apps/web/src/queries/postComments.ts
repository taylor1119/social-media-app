import { IPostComment, TPostCommentInput } from 'shared'
import { axiosInstance } from '../services/axios'

export const addPostCommentQuery = async (
	commentInput: TPostCommentInput,
	postId?: string
): Promise<IPostComment> => {
	if (!postId) Promise.reject(new Error('Invalid ids'))
	const { data } = await axiosInstance.post(
		`/posts/comments/${postId}`,
		commentInput,
		{ withCredentials: true }
	)
	return data
}

//TODO replicate
export const updatePostCommentQuery = async (
	postCommentInput: TPostCommentInput,
	postCommentId?: string
): Promise<unknown> => {
	if (!postCommentId) Promise.reject(new Error('Invalid ids'))
	const { data } = await axiosInstance.put(
		`/posts/comments/${postCommentId}`,
		postCommentInput,
		{ withCredentials: true }
	)
	return data
}

export const deletePostCommentQuery = async (
	postCommentId?: string
): Promise<unknown> => {
	if (!postCommentId) Promise.reject(new Error('Invalid ids'))
	const { data } = await axiosInstance.delete(
		`/posts/comments/${postCommentId}`,
		{ withCredentials: true }
	)
	return data
}

export const getPostCommentQuery = async (
	commentIds?: string[]
): Promise<IPostComment[]> => {
	if (!commentIds) Promise.reject(new Error('Invalid ids'))
	const { data } = await axiosInstance.post(
		'/posts/comments/list/',
		commentIds,
		{ withCredentials: true }
	)
	return data
}
