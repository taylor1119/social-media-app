import { IGetPostsWithImagesInput, IPost, TPostInput } from 'shared'
import { TPaginatedPost, TPaginatedPostsType } from '../common/types'
import { axiosInstance } from '../services/axios'

export const addPostQuery = async (postInput: TPostInput): Promise<unknown> => {
	const { data } = await axiosInstance.post('/posts', postInput, {
		withCredentials: true,
	})
	return data
}

export const updatePostQuery = async ({
	postInput,
	postId,
}: {
	postInput: TPostInput
	postId: string
}): Promise<unknown> => {
	const { data } = await axiosInstance.put(`/posts/${postId}`, postInput, {
		withCredentials: true,
	})
	return data
}

export const deletePostQuery = async (postId: string): Promise<unknown> => {
	const { data } = await axiosInstance.delete(`/posts/${postId}`, {
		withCredentials: true,
	})
	return data
}

export const likePostQuery = async (postId?: string): Promise<unknown> => {
	if (!postId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.put(`/posts/${postId}/like`, null, {
		withCredentials: true,
	})
	return data
}

export const dislikePostQuery = async (postId?: string): Promise<unknown> => {
	if (!postId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.put(`/posts/${postId}/dislike`, null, {
		withCredentials: true,
	})
	return data
}

export const getPaginatedPostsQuery = async (
	type: TPaginatedPostsType,
	userId?: string,
	page = 0
): Promise<TPaginatedPost[]> => {
	if (!userId) Promise.reject(new Error('Invalid id'))
	const { data } = await axiosInstance.get<IPost[]>(
		`/posts/${type}/${userId}?page=${page.toString()}`,
		{ withCredentials: true }
	)
	return data.map((post, index) => ({ ...post, page, index }))
}

export const getPostsWithImagesQuery = async (
	getPostsWithImagesInput: IGetPostsWithImagesInput
): Promise<IPost[]> => {
	if (getPostsWithImagesInput.date === 'first') {
		delete getPostsWithImagesInput.date
		delete getPostsWithImagesInput.authorId
	} else delete getPostsWithImagesInput.postId

	const { data } = await axiosInstance.post(
		'/posts/images/',
		getPostsWithImagesInput,
		{ withCredentials: true }
	)
	return data
}
