import { Router } from 'express'
import { authenticate, validateInput } from '../../common/middlewares'
import {
	createPost,
	deletePost,
	dislikePost,
	getLikedPosts,
	getPost,
	getTimelinePosts,
	likePost,
	updatePost,
} from './controllers'
import {
	createPostValidationSchema,
	updatePostValidationSchema,
} from './validation'

const router = Router()

//get timeline post
router.get('/timeline/:userId', getTimelinePosts)
router.get('/liked/:userId', getLikedPosts)

//create post
router.post(
	'/',
	authenticate,
	validateInput(createPostValidationSchema, 'postInput'),
	createPost
)

//read post
router.get('/:postId', getPost)

//update post
router.put(
	'/:postId',
	authenticate,
	validateInput(updatePostValidationSchema, 'postInput'),
	updatePost
)

//delete post
router.delete('/:postId', authenticate, deletePost)

//like post
router.put('/:postId/like', authenticate, likePost)

//dislike post
router.put('/:postId/dislike', authenticate, dislikePost)

export default router
