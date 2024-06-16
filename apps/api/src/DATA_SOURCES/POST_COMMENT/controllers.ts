import { IAsyncRequestHandler } from '../../common/interfaces'
import { catchAsyncReqHandlerErr } from '../../common/middlewares'
import { dbDocIdValidationSchema } from '../../common/validation'
import PostModel from '../POST/model'
import UserModel from '../USER/model'
import PostCommentModel from './model'

const createPostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postId, error } = dbDocIdValidationSchema.validate(
		req.params.postId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const currentUser = await UserModel.findById(req.currentUserId)
	if (!currentUser) {
		res.status(404).json({ error: 'no such user' })
		return
	}

	const post = await PostModel.findById(postId)
	if (!post) {
		res.status(404).json({ error: 'no such post' })
		return
	}

	const { id, userName, avatar } = currentUser
	const postComment = await PostCommentModel.create({
		postId,
		author: {
			id,
			userName,
			avatar,
		},
		...req.postCommentInput,
	})

	post.comments.push(postComment.id)
	await post.save()

	res.status(200).json(postComment)
}

const updatePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postCommentId, error } = dbDocIdValidationSchema.validate(
		req.params.postCommentId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const postComment = await PostCommentModel.findById(postCommentId)
	if (!postComment) {
		res.status(404).json({ error: 'post comment not found' })
		return
	}

	if (postComment.author.id !== req.currentUserId) {
		res.status(400).json({ error: 'not authorized' })
		return
	}

	postComment.text = req.postCommentInput?.text as string
	await postComment.save()

	res.status(200).json(postComment)
}

const deletePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postCommentId, error } = dbDocIdValidationSchema.validate(
		req.params.postCommentId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const postComment = await PostCommentModel.findById(postCommentId)
	if (!postComment) {
		res.status(404).json({ error: 'post comment not found' })
		return
	}

	const currentUserId = req.currentUserId
	if (postComment.author.id !== currentUserId) {
		res.status(400).json({ error: 'not authorized' })
		return
	}

	await PostModel.findByIdAndUpdate(postComment.postId, {
		$pull: { comments: postCommentId },
	})

	await postComment.deleteOne()

	res.status(200).end()
}

const likePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postCommentId, error } = dbDocIdValidationSchema.validate(
		req.params.postCommentId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const currentUserId = req.currentUserId as string
	const currentUser = await UserModel.findById(currentUserId)
	const postComment = await PostCommentModel.findById(postCommentId)
	if (!postComment || !currentUser) {
		res.status(404).send({
			error: 'Post Comment or current user not found',
		})
		return
	}

	if (postComment.likes.includes(currentUserId)) {
		res.status(400).json({ error: 'Post Comment already liked' })
		return
	}

	postComment.likes.push(currentUserId)
	await postComment.save()

	res.status(200).json(postComment)
}

const dislikePostCommentUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: postCommentId, error } = dbDocIdValidationSchema.validate(
		req.params.postCommentId
	)
	if (error) {
		res.status(400).json({ error: 'invalid post id' })
		return
	}

	const currentUserId = req.currentUserId as string
	const currentUser = await UserModel.findById(currentUserId)
	const postComment = await PostCommentModel.findById(postCommentId)

	if (!postComment || !currentUser) {
		res.status(404).send({ error: 'PostComment or current user not found' })
		return
	}

	if (postComment.dislikes.includes(currentUserId)) {
		res.status(400).json({ error: 'PostComment already disliked' })
		return
	}

	postComment.dislikes.push(currentUserId)
	await postComment.save()

	res.status(200).json(postComment)
}

const getPostCommentsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postCommentsIds = req.dBDocIds

	if (!postCommentsIds?.length) {
		res.status(200).json([])
		return
	}

	const postComments = await PostCommentModel.find({
		_id: { $in: postCommentsIds },
	}).sort({ createdAt: -1 })

	res.status(200).json(postComments)
}

export const createPostComment = catchAsyncReqHandlerErr(
	createPostCommentUnsafe
)

export const getPostComments = catchAsyncReqHandlerErr(getPostCommentsUnsafe)

export const updatePostComment = catchAsyncReqHandlerErr(
	updatePostCommentUnsafe
)
export const deletePostComment = catchAsyncReqHandlerErr(
	deletePostCommentUnsafe
)
export const likePostComment = catchAsyncReqHandlerErr(likePostCommentUnsafe)
export const dislikePostComment = catchAsyncReqHandlerErr(
	dislikePostCommentUnsafe
)
