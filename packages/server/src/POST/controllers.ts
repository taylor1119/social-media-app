import { isValidObjectId } from 'mongoose';
import { TCurrentUser } from 'src/USER/types';
import { IAsyncRequestHandler } from '../common/interfaces';
import { catchAsyncRequestHandlerError } from '../common/middlewares';
import UserModel from '../USER/model';
import PostModel from './model';
import { TPostInput } from './types';

const createPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser: TCurrentUser = res.locals.currentUser;
	const createPostInput: TPostInput = res.locals.validatedBody;

	const postDoc = await PostModel.create({
		author: currentUser._id,
		...createPostInput,
	});

	res.status(200).json(postDoc);
};

const getPostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	if (!postDoc) {
		res.status(404).json({ error: 'post not found' });
		return;
	}

	res.status(200).json(postDoc);
};

const updatePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' });
		return;
	}

	const post = await PostModel.findByIdAndUpdate(
		postId,
		{
			author: res.locals.currentUser._id,
			...res.locals.validatedBody,
			test: 2566,
		},
		{ new: true }
	);

	if (!post) {
		res.status(404).json({ error: 'post not found' });
		return;
	}

	res.status(200).json(post);
};

const deletePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid post id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	if (!postDoc) {
		res.status(404).json({ error: 'post not found' });
		return;
	}

	const currentUser: TCurrentUser = res.locals.currentUser;
	if (postDoc.author !== currentUser._id && !currentUser.isAdmin) {
		res.status(400).json({ error: 'not authorized' });
		return;
	}

	await postDoc.delete();

	res.status(200).json({ success: 'post deleted' });
};

const likePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	const currentUserId = res.locals.currentUser._id;

	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (!postDoc || !currentUserDoc) {
		res.status(404).send({ error: 'post or current user not found' });
		return;
	}

	if (postDoc.likes.includes(currentUserId)) {
		res.status(400).json({ error: 'post already liked' });
		return;
	}

	postDoc.likes.push(currentUserId);
	currentUserDoc.likedPosts.push(postDoc._id);

	const postDislikeIdx = postDoc.dislikes.indexOf(currentUserId);
	const userDislikeIdx = currentUserDoc.dislikedPosts.indexOf(currentUserId);

	if (postDislikeIdx !== -1) {
		postDoc.dislikes.splice(postDislikeIdx, 1);
	}

	if (userDislikeIdx !== -1) {
		currentUserDoc.dislikedPosts.splice(postDislikeIdx, 1);
	}

	await currentUserDoc.save();
	await postDoc.save();

	res.status(200).json({
		success: 'post liked',
	});
};

const dislikePostUnsafe: IAsyncRequestHandler = async (req, res) => {
	const postId = req.params.id;
	const currentUserId = res.locals.currentUser._id;

	if (!isValidObjectId(postId)) {
		res.status(400).json({ error: 'invalid user id' });
		return;
	}

	const postDoc = await PostModel.findById(postId);
	const currentUserDoc = await UserModel.findById(currentUserId);

	if (!postDoc || !currentUserDoc) {
		res.status(404).send({ error: 'post or current user not found' });
		return;
	}

	if (postDoc.dislikes.includes(currentUserId)) {
		res.status(400).json({ error: 'post already disliked' });
		return;
	}

	postDoc.dislikes.push(currentUserId);
	currentUserDoc.dislikedPosts.push(postDoc._id);

	const postDislikeIdx = postDoc.likes.indexOf(currentUserId);
	const userDislikeIdx = currentUserDoc.likedPosts.indexOf(currentUserId);

	if (postDislikeIdx !== -1) {
		postDoc.likes.splice(postDislikeIdx, 1);
	}

	if (userDislikeIdx !== -1) {
		currentUserDoc.likedPosts.splice(postDislikeIdx, 1);
	}

	await currentUserDoc.save();
	await postDoc.save();

	res.status(200).json({
		success: 'post liked',
	});
};

const getTimelinePostsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserFromCookie: TCurrentUser = res.locals.currentUser;
	const currentUserDoc = await UserModel.findById(currentUserFromCookie._id);
	if (!currentUserDoc) {
		res.status(404).json({ error: 'no such user' });
		return;
	}

	if (!currentUserDoc.followings.length) {
		res.status(200).json([]);
		return;
	}

	const posts = await PostModel.find({
		author: { $in: currentUserDoc.followings },
	});

	res.status(200).json(posts);
};
export const createPost = catchAsyncRequestHandlerError(createPostUnsafe);
export const getPost = catchAsyncRequestHandlerError(getPostUnsafe);
export const updatePost = catchAsyncRequestHandlerError(updatePostUnsafe);
export const deletePost = catchAsyncRequestHandlerError(deletePostUnsafe);
export const likePost = catchAsyncRequestHandlerError(likePostUnsafe);
export const dislikePost = catchAsyncRequestHandlerError(dislikePostUnsafe);
export const getTimelinePosts = catchAsyncRequestHandlerError(
	getTimelinePostsUnsafe
);
