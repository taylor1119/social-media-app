import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import { TUserDB } from './types';

const UserSchema = new Schema<TUserDB>(
	{
		username: { type: String, unique: true },
		password: String,
		profilePicture: String,
		followers: Array,
		followings: Array,
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

export default model('User', UserSchema);
