import { Request } from 'express'
import {
	IChatMessageTypingAction,
	IUserConnectionAction,
	TWebSocketAction,
} from 'shared'
import WebSocket, { WebSocketServer } from 'ws'
import UserModel from '../DATA_SOURCES/USER/model'
import { IListener } from '../common/interfaces'

const wss = new WebSocketServer({ noServer: true })
export const socketConnections = new Map<string, WebSocket.WebSocket>()

const messageListener =
	(currentUserId: string): IListener =>
	(messageStr) => {
		const message: TWebSocketAction = JSON.parse(messageStr.toString())

		switch (message.type) {
			case 'chat-typing-started':
				{
					const conn = socketConnections.get(message.payload.userId)
					if (!conn) return
					const newMsg: IChatMessageTypingAction = {
						type: message.type,
						payload: { userId: currentUserId },
					}
					conn.send(JSON.stringify(newMsg))
				}
				break
			case 'chat-typing-stopped':
				{
					const conn = socketConnections.get(message.payload.userId)
					if (!conn) return
					const newMsg: IChatMessageTypingAction = {
						type: message.type,
						payload: { userId: currentUserId },
					}
					conn.send(JSON.stringify(newMsg))
				}
				break
			default:
				console.log(message)
				break
		}
	}

wss.on('connection', async (ws, request) => {
	const req = request as Request
	const userId = req.currentUserId as string
	socketConnections.set(userId, ws)

	ws.on('message', messageListener(userId))

	const friends = (await UserModel.findById(userId))?.friends
	friends?.forEach((friendId) =>
		sendUserConnectionAction(userId, friendId, 'user-connected')
	)

	ws.on('close', async () => {
		socketConnections.delete(userId)
		friends?.forEach((friendId) =>
			sendUserConnectionAction(userId, friendId, 'user-disconnected')
		)
	})
})

const sendUserConnectionAction = (
	userId: string,
	friendId: string,
	type: IUserConnectionAction['type']
) => {
	const userConnectedAction: IUserConnectionAction = {
		type,
		payload: { userId },
	}
	socketConnections.get(friendId)?.send(JSON.stringify(userConnectedAction))
}

export default wss //Hash map of userIds as key and socket connection as values
