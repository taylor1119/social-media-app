import { model, Schema } from 'mongoose'
import { IChatMessage } from 'shared'

const messageSchema = new Schema<IChatMessage>({
	senderId: String,
	targetId: String,
	text: String,
	status: { type: String, default: 'sent' },
})

export default model('message', messageSchema)
