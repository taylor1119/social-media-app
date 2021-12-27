import { model, Schema } from 'mongoose';
import { TPostDB } from './types';

const UserSchema = new Schema<TPostDB>(
	{
		author: String,
		description: String,
		img: String,
		likes: [String],
		dislikes: [String],
	},
	{ timestamps: true, versionKey: false }
);

export default model('Post', UserSchema);
