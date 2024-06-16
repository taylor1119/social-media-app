import Joi from 'joi'
import { FilterQuery, isValidObjectId } from 'mongoose'
import { IPost } from 'shared'
import { POSTS_PAGE_SIZE } from '../../common/constants'
import { IAsyncRequestHandler } from '../../common/interfaces'
import { catchAsyncReqHandlerErr } from '../../common/middlewares'
import { dbDocIdValidationSchema } from '../../common/validation'
import UserModel from '../USER/model'
import PostModel from './model'

const createPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await UserModel.findById(req.currentUserId)
	if (!currentUser) {
		res.status(404).json({ error: 'no such user' })
		return
	}

	const { userName, avatar, id } = currentUser
	await PostModel.create({
		author: {
			id,
			userName,
			avatar,
		},
		...req.postInput,
	})

	res.status(200).end()
}

const getPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.postId
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const post = await PostModel.findById(postId)
	if (!post) {
		res.status(404).json({ error: 'post not found' })
		return
	}

	res.status(200).json(post)
}

const updatePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postId, error } = dbDocIdValidationSchema.validate(
		req.params.postId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const post = await PostModel.findById(postId)
	if (!post) {
		res.status(404).json({ error: 'post not found' })
		return
	}

	if (post.author.id !== req.currentUserId) {
		res.status(400).json({ error: 'not authorized' })
		return
	}

	post.img = req.postInput?.img
	post.description = req.postInput?.description as string
	await post.save()

	res.status(200).end()
}

const deletePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postId, error } = dbDocIdValidationSchema.validate(
		req.params.postId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const post = await PostModel.findById(postId)
	if (!post) {
		res.status(404).json({ error: 'post not found' })
		return
	}

	const currentUserId = req.currentUserId
	if (post.author.id !== currentUserId) {
		res.status(400).json({ error: 'not authorized' })
		return
	}

	await post.deleteOne()

	res.status(200).end()
}

const likePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postId, error } = dbDocIdValidationSchema.validate(
		req.params.postId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}
	const currentUserId = req.currentUserId as string

	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid user id' })
		return
	}

	const post = await PostModel.findById(postId)
	const currentUser = await UserModel.findById(currentUserId)

	if (!post || !currentUser) {
		res.status(404).send({ error: 'post or current user not found' })
		return
	}

	if (post.likes.includes(currentUserId)) {
		res.status(400).json({ error: 'post already liked' })
		return
	}

	post.likes.push(currentUserId)
	currentUser.likedPosts.push(post.id)

	const postDislikeIdx = post.dislikes.indexOf(currentUserId)
	const userDislikeIdx = currentUser.dislikedPosts.indexOf(currentUserId)

	if (postDislikeIdx !== -1) {
		post.dislikes.splice(postDislikeIdx, 1)
	}

	if (userDislikeIdx !== -1) {
		currentUser.dislikedPosts.splice(postDislikeIdx, 1)
	}

	await currentUser.save()
	await post.save()

	res.status(200).json(post)
}

const dislikePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postId, error } = dbDocIdValidationSchema.validate(
		req.params.postId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}
	const currentUserId = req.currentUserId as string

	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid user id' })
		return
	}

	const post = await PostModel.findById(postId)
	const currentUser = await UserModel.findById(currentUserId)

	if (!post || !currentUser) {
		res.status(404).send({ error: 'post or current user not found' })
		return
	}

	if (post.dislikes.includes(currentUserId)) {
		res.status(400).json({ error: 'post already disliked' })
		return
	}

	post.dislikes.push(currentUserId)
	currentUser.dislikedPosts.push(post.id)

	const postDislikeIdx = post.likes.indexOf(currentUserId)
	const userDislikeIdx = currentUser.likedPosts.indexOf(currentUserId)

	if (postDislikeIdx !== -1) {
		post.likes.splice(postDislikeIdx, 1)
	}

	if (userDislikeIdx !== -1) {
		currentUser.likedPosts.splice(postDislikeIdx, 1)
	}

	await currentUser.save()
	await post.save()

	res.status(200).json(post)
}

const getPaginatedPostsUnsafe =
	(queryType: 'timeline' | 'liked'): IAsyncRequestHandler =>
	async (req, res) => {
		const userId = req.params.userId

		const user = await UserModel.findById(userId)
		if (!user) {
			res.status(404).json({ error: 'no such user' })
			return
		}

		if (!user.friends.length) {
			res.status(200).json([])
			return
		}

		const filter: FilterQuery<IPost> = {}
		switch (queryType) {
			case 'timeline':
				filter['author.id'] = { $in: [...user.friends, user.id] }
				break
			case 'liked':
				filter.likes = user.id
				break
		}

		const page = Joi.attempt(req.query.page, Joi.number())
		const posts = await PostModel.find(filter)
			.sort({ createdAt: -1 })
			.skip(page * POSTS_PAGE_SIZE)
			.limit(POSTS_PAGE_SIZE)

		res.status(200).json(posts)
	}

export const createPost = catchAsyncReqHandlerErr(createPostUnsafe)
export const getPost = catchAsyncReqHandlerErr(getPostUnsafe)
export const updatePost = catchAsyncReqHandlerErr(updatePostUnsafe)
export const deletePost = catchAsyncReqHandlerErr(deletePostUnsafe)
export const likePost = catchAsyncReqHandlerErr(likePostUnsafe)
export const dislikePost = catchAsyncReqHandlerErr(dislikePostUnsafe)
export const getTimelinePosts = catchAsyncReqHandlerErr(
	getPaginatedPostsUnsafe('timeline')
)
export const getLikedPosts = catchAsyncReqHandlerErr(
	getPaginatedPostsUnsafe('liked')
)
