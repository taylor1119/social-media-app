import { useEffect } from 'react'
import {
	SetterOrUpdater,
	useRecoilState,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import {
	IChatMessage,
	IChatMessageAction,
	IChatMessageTypingAction,
	IFriendRequest,
	IFriendRequestAction,
	IUserConnectionAction,
	TWebSocketAction,
} from 'shared'
import { queryClient } from '..'
import { STATIC_ORIGIN, WS_ORIGIN } from '../constants/envVars'
import queryKeys from '../constants/reactQueryKeys'
import {
	currentUserState,
	typingIndicatorMapState,
	webSocketState,
} from '../recoil/atoms'

export const useWebSocketInit = () => {
	const [socket, setSocket] = useRecoilState(webSocketState)
	const setTypingIndicatorMap = useSetRecoilState(typingIndicatorMapState)
	const currentUser = useRecoilValue(currentUserState)

	const openSocketEffectCallback = () => {
		if (!currentUser || socket) return
		setSocket(new WebSocket(WS_ORIGIN))
	}

	const onOpenEffectCallback = () => {
		if (!socket) return
		socket.onopen = () => console.log('WebSocket Connected')
	}

	const onCloseEffectCallback = () => {
		if (!socket) return
		socket.onclose = () => {
			console.log('WebSocket Closed')
			setTimeout(() => setSocket(new WebSocket(WS_ORIGIN)), 5000)
		}
	}

	const onMessageEffectCallback = () => {
		if (!socket) return
		socket.onmessage = (e) => {
			const action: TWebSocketAction = JSON.parse(e.data)
			switch (action.type) {
				case 'chat-message':
					handleChatMessageAction(setTypingIndicatorMap, action)
					break

				case 'chat-typing-started':
					handleTypingNotificationAction(
						setTypingIndicatorMap,
						action
					)
					break

				case 'chat-typing-stopped':
					handleTypingNotificationAction(
						setTypingIndicatorMap,
						action
					)
					break

				case 'user-connected':
					handleUserConnectionAction(action)
					break

				case 'user-disconnected':
					handleUserConnectionAction(action)
					break

				case 'received-friend-request':
					handleFriendRequestAction(action)
					break

				default:
					console.log(action)
					break
			}
		}
	}

	useEffect(openSocketEffectCallback, [currentUser, setSocket, socket])
	useEffect(onOpenEffectCallback, [socket])
	useEffect(onCloseEffectCallback, [setSocket, socket])
	useEffect(onMessageEffectCallback, [setTypingIndicatorMap, socket])
}

const handleUserConnectionAction = async (action: IUserConnectionAction) => {
	await queryClient.cancelQueries(queryKeys.activeFriends)

	const userId = action.payload.userId
	if (action.type === 'user-connected')
		queryClient.setQueryData<string[]>(queryKeys.activeFriends, (old) =>
			old ? [userId].concat(old) : [userId]
		)
	else
		queryClient.setQueryData<string[] | undefined>(
			queryKeys.activeFriends,
			(old) => old?.filter((friendId) => friendId !== userId)
		)
}

const handleTypingNotificationAction = (
	setTypingIndicatorMap: SetterOrUpdater<Map<string, boolean>>,
	action: IChatMessageTypingAction
) =>
	setTypingIndicatorMap((prev) =>
		new Map(prev).set(
			action.payload.userId,
			action.type === 'chat-typing-started'
		)
	)

const handleChatMessageAction = (
	setTypingIndicatorMap: SetterOrUpdater<Map<string, boolean>>,
	action: IChatMessageAction
) => {
	setTypingIndicatorMap((prev) =>
		new Map(prev).set(action.payload.senderId, false)
	)

	setTimeout(async () => {
		await queryClient.cancelQueries(queryKeys.conversation())
		queryClient.setQueryData<IChatMessage[]>(
			queryKeys.conversation(action.payload.senderId),
			(old) => (old ? old.concat(action.payload) : [action.payload])
		)
		playNotificationSound()
	}, 150)
}

const handleFriendRequestAction = async (action: IFriendRequestAction) => {
	await queryClient.cancelQueries(queryKeys.receivedFriendRequests)
	queryClient.setQueryData<IFriendRequest[]>(
		queryKeys.receivedFriendRequests,
		(old) => (old ? [action.payload].concat(old) : [action.payload])
	)
}

const playNotificationSound = () => {
	const notification = new Audio(`${STATIC_ORIGIN}/audio/notification.mp3`)
	notification.crossOrigin = 'anonymous'
	notification.play()
}
