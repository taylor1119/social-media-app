import { TChatMessageStatus, TFriendRequestStatus } from './types'

export interface IUser {
	id: string
	avatar?: string
	userName: string
	email: string
	cover?: string
	intro?: {
		bio?: string
		address?: string
		from?: string
		work?: string
		studiesAt?: string
		studiedAt?: string
		relationshipStatus?:
			| 'Single'
			| 'Married'
			| 'Engaged'
			| 'In A Relationship'
			| 'Its Complicated'
	}
	password: string
	friends: string[]
	likedPosts: string[]
	dislikedPosts: string[]
	createdAt: Date
	updatedAt: Date
}

export interface IFriendRequest {
	id: string
	requester: string
	recipient: string
	status: TFriendRequestStatus
	createdAt: Date
	updatedAt: Date
}

export interface IChatMessage {
	id: string
	senderId: string
	targetId: string
	text: string
	status: TChatMessageStatus
	createdAt: Date
	updatedAt: Date
}

export interface IPost {
	id: string
	author: Pick<IUser, 'id' | 'userName' | 'avatar'>
	description: string
	img?: string
	likes: string[]
	dislikes: string[]
	comments: string[]
	createdAt: Date
	updatedAt: Date
}

export interface IPostComment {
	id: string
	postId: string
	author: Pick<IUser, 'id' | 'userName' | 'avatar'>
	text: string
	likes: string[]
	dislikes: string[]
	createdAt: Date
	updatedAt: Date
}

export interface IChatMessageTypingAction {
	type: 'chat-typing-started' | 'chat-typing-stopped'
	payload: { userId: string }
}

export interface IChatMessageAction {
	type: 'chat-message'
	payload: IChatMessage
}

export interface IUserConnectionAction {
	type: 'user-connected' | 'user-disconnected'
	payload: { userId: string }
}

export interface IFriendRequestAction {
	type: 'received-friend-request'
	payload: IFriendRequest
}

export interface IGetPostsWithImagesInput {
	postId?: string
	authorId?: string
	date?: number | 'first'
}
