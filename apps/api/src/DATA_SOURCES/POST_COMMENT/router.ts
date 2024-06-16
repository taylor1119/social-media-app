import { Router } from 'express'
import { authenticate, validateInput } from '../../common/middlewares'
import {
	createPostComment,
	deletePostComment,
	dislikePostComment,
	getPostComments,
	likePostComment,
	updatePostComment,
} from './controllers'
import {
	createPostCommentValidationSchema,
	getPostCommentsValidationSchema,
	updatePostCommentValidationSchema,
} from './validation'

const router = Router()

//get post comments
router.post(
	'/list',
	validateInput(getPostCommentsValidationSchema, 'dBDocIds'),
	getPostComments
)

//create post comment
router.post(
	'/:postId',
	authenticate,
	validateInput(createPostCommentValidationSchema, 'postCommentInput'),
	createPostComment
)

//update post
router.put(
	'/:postCommentId',
	authenticate,
	validateInput(updatePostCommentValidationSchema, 'postCommentInput'),
	updatePostComment
)

//delete post
router.delete('/:postCommentId', authenticate, deletePostComment)

//like post
router.put('/:postCommentId/like', authenticate, likePostComment)

//dislike post
router.put('/:postCommentId/dislike', authenticate, dislikePostComment)

export default router
