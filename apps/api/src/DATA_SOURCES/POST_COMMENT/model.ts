import { model, Schema } from 'mongoose'
import { IPostComment } from 'shared'

const UserSchema = new Schema<IPostComment>({
	postId: String,
	author: {
		id: String,
		avatar: String,
		userName: String,
	},
	text: String,
	likes: [String],
	dislikes: [String],
})

export default model('PostComment', UserSchema)
