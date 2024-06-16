import bcrypt from 'bcryptjs'
import { RequestHandler } from 'express'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'
import { TLoginInput } from 'shared'
import FriendRequestsModel from '../../DATA_SOURCES/FRIEND_REQUESTS/model'
import { IAsyncRequestHandler } from '../../common/interfaces'
import { catchAsyncReqHandlerErr } from '../../common/middlewares'
import { dbDocIdValidationSchema } from '../../common/validation'
import { IS_PROD, JWT_SECRET } from '../../config/secrets'
import { socketConnections } from '../../config/socket'
import UserModel from './model'
import { COOKIE_NAME } from './strings'

const signupUnsafe: IAsyncRequestHandler = async (req, res) => {
	await UserModel.create(req.signupInput)
	res.status(200).json({
		success: 'user created successfully',
	})
}

const loginUnsafe: IAsyncRequestHandler = async (req, res) => {
	const loginInput = req.loginInput as TLoginInput
	const userDoc = await UserModel.findOne({ email: loginInput.email })
	if (!userDoc) {
		res.status(400).json({ error: 'wrong password or email' })
		return
	}

	const { password, ...payload } = userDoc.toObject()
	const isPasswordCorrect = bcrypt.compareSync(loginInput.password, password)
	if (!isPasswordCorrect) {
		res.status(400).json({ error: 'wrong password or username' })
		return
	}

	const jwtToken = jwt.sign(payload.id, JWT_SECRET)
	res.cookie(COOKIE_NAME, jwtToken, {
		httpOnly: true,
		signed: true,
		secure: IS_PROD,
		sameSite: 'strict',
	})

	const csrfToken = req.csrfToken()
	res.status(200).json({
		...payload,
		csrfToken,
	})
}

export const logout: RequestHandler = (req, res) => {
	res.clearCookie(COOKIE_NAME)
	res.status(200).json({ success: 'logout successful' })
}

const updateUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserId = req.currentUserId as string

	const updateUser = await UserModel.findByIdAndUpdate(
		currentUserId,
		req.updateUserInput
	)

	if (!updateUser) {
		res.status(400).json({ error: 'no such user' })
		return
	}

	res.status(200).end()
}

const deleteUserUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserId = req.currentUserId as string
	const deletedUserId = req.params.id

	if (!isValidObjectId(deletedUserId)) {
		res.status(400).json({ error: 'invalid user id' })
		return
	}

	if (deletedUserId !== currentUserId) {
		res.status(400).json({
			error: 'can not delete an account that is not yours',
		})
		return
	}

	const deletedUser = await UserModel.findById(deletedUserId)

	if (!deletedUser) {
		res.status(400).json({
			error: 'no user with such id',
		})
		return
	}

	await deletedUser.deleteOne()
	res.status(200).json({ success: 'user deleted' })
}

const getUserByIdUnsafe: IAsyncRequestHandler = async (req, res) => {
	const { value: userId, error } = dbDocIdValidationSchema.validate(
		req.params.userId
	)
	if (error) {
		res.status(400).json({ error: 'invalid user id' })
		return
	}

	const user = await UserModel.findById(userId).select('-password')
	if (!user) {
		res.status(400).json({ error: 'no such user' })
		return
	}

	res.status(200).json(user)
}

const getUsersByIdsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userIds = req.dBDocIds
	const users = await UserModel.find({ _id: { $in: userIds } })
	res.status(200).json(users)
}

const unfriendUnsafe: IAsyncRequestHandler = async (req, res) => {
	const userId = req.currentUserId as string
	const { value: friendId, error } = dbDocIdValidationSchema.validate(
		req.params.friendId
	)
	if (error) {
		res.status(400).json({ error: 'invalid user id' })
		return
	}
	const user = await UserModel.findById(userId)
	const friend = await UserModel.findById(friendId)
	if (!user || !friend) {
		res.status(400).json({ error: 'user or friend not found' })
		return
	}

	const userIdx = friend.friends.indexOf(userId)
	const friendIdx = user.friends.indexOf(friendId)
	if (friendIdx === -1) {
		res.status(400).json({ error: 'already a not friend' })
		return
	}

	user.friends.splice(friendIdx, 1)
	friend.friends.splice(userIdx, 1)
	await Promise.all([user.save(), friend.save()])
	res.status(200).json({ succuss: 'friend removed' })
}

const getOnlineUsersIdsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await UserModel.findById(req.currentUserId)
	if (!currentUser) {
		res.status(400).json({ error: 'auth error' })
		return
	}
	const onlineUsersIds = currentUser.friends.filter((friendId) =>
		socketConnections.get(friendId)
	)
	res.status(200).json(onlineUsersIds)
}

const searchUsersByUserNameUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUserId = req.currentUserId
	const { error, value: username } = Joi.string()
		.min(3)
		.max(18)
		.required()
		.validate(req.params.username)
	if (error) {
		res.status(400).json({ error: 'invalid username' })
		return
	}
	//todo use algolia or another fuzzy search method regex is expensive

	const filteringIds = (
		await FriendRequestsModel.find({
			status: 'pending',
			$or: [{ recipient: currentUserId }, { requester: currentUserId }],
		})
	).reduce<string[]>(
		(prev, curr) =>
			curr.recipient === currentUserId
				? [...prev, curr.requester]
				: [...prev, curr.recipient],
		[]
	)
	filteringIds.push(currentUserId as string)

	const regex = new RegExp(username, 'gi')
	const users = await UserModel.find({
		userName: regex,
		_id: { $nin: filteringIds },
	})

	res.status(200).json(users)
}

const getFriendsIdsUnsafe: IAsyncRequestHandler = async (req, res) => {
	const currentUser = await UserModel.findById(req.currentUserId)
	if (!currentUser) {
		res.status(400).json({ error: 'auth error' })
		return
	}
	res.status(200).json(currentUser.friends)
}

const getAccountsUnSafe: IAsyncRequestHandler = async (req, res) => {
	const email = await UserModel.find().select('email avatar userName')
	res.status(200).json(email)
}

export const getAccounts = catchAsyncReqHandlerErr(getAccountsUnSafe)
export const signup = catchAsyncReqHandlerErr(signupUnsafe)
export const login = catchAsyncReqHandlerErr(loginUnsafe)
export const updateUser = catchAsyncReqHandlerErr(updateUserUnsafe)
export const deleteUser = catchAsyncReqHandlerErr(deleteUserUnsafe)
export const getUserById = catchAsyncReqHandlerErr(getUserByIdUnsafe)
export const getUsersByIds = catchAsyncReqHandlerErr(getUsersByIdsUnsafe)
export const getFriendsIds = catchAsyncReqHandlerErr(getFriendsIdsUnsafe)
export const removeFriend = catchAsyncReqHandlerErr(unfriendUnsafe)
export const getOnlineUsersIds = catchAsyncReqHandlerErr(
	getOnlineUsersIdsUnsafe
)
export const searchUsersByUserName = catchAsyncReqHandlerErr(
	searchUsersByUserNameUnsafe
)
