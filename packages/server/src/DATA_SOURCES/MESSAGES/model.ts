import { IChatMessage } from '@social-media-app/shared';
import { model, Schema } from 'mongoose';

const messageSchema = new Schema<IChatMessage>({
	senderId: String,
	targetId: String,
	text: String,
	status: { type: String, default: 'sent' },
});

export default model('message', messageSchema);
