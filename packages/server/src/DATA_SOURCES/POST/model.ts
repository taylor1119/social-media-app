import { IPost } from '@social-media-app/shared';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<IPost>({
	author: {
		id: String,
		avatar: String,
		userName: String,
	},
	description: String,
	img: String,
	likes: [String],
	dislikes: [String],
	comments: [String],
});

export default model('Post', UserSchema);
