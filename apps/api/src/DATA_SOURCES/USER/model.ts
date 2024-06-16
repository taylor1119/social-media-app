import bcrypt from 'bcryptjs'
import { model, Schema } from 'mongoose'
import { IUser } from 'shared'

const UserSchema = new Schema<IUser>({
	email: { type: String, unique: true },
	userName: { type: String, unique: true },
	password: String,
	avatar: String,
	cover: String,
	friends: [String],
	likedPosts: [String],
	dislikedPosts: [String],

	intro: {
		bio: String,
		address: String,
		from: String,
		work: String,
		studiesAt: String,
		studiedAt: String,
		relationshipStatus: String,
	},
})

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next()
	const salt = bcrypt.genSaltSync(10)
	this.password = bcrypt.hashSync(this.password, salt)
	next()
})

export default model('User', UserSchema)
