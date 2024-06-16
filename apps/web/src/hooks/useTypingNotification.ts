import { IChatMessageTypingAction } from 'shared'
import { debounce } from 'lodash'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { queryClient } from '..'
import queryKeys from '../constants/reactQueryKeys'
import { webSocketState } from '../recoil/atoms'

export const useTypingNotification = (friendId: string) => {
	const socket = useRecoilValue(webSocketState)
	const activeUsers = queryClient.getQueryData<string[]>(
		queryKeys.activeFriends
	)

	const sendTypingNotification = (action: IChatMessageTypingAction) =>
		socket?.send(JSON.stringify(action))

	const debounceStartTyping = debounce(sendTypingNotification, 1000, {
		leading: true,
		trailing: false,
	})

	const debounceEndTyping = debounce(sendTypingNotification, 1000, {
		leading: false,
		trailing: true,
	})

	const isAnActiveFriend =
		!activeUsers || activeUsers.indexOf(friendId) === -1
	const payload = { userId: friendId }

	const handleInputKeyDown: React.KeyboardEventHandler = (event) => {
		if (isAnActiveFriend || event.key === 'Enter') return

		debounceStartTyping({
			type: 'chat-typing-started',
			payload,
		})
	}

	const handleInputKeyUp: React.KeyboardEventHandler = (event) => {
		if (isAnActiveFriend || event.key === 'Enter') return

		debounceEndTyping({
			type: 'chat-typing-stopped',
			payload,
		})
	}

	useEffect(
		() => () => {
			debounceStartTyping.cancel()
			debounceEndTyping.cancel()
		},
		[debounceEndTyping, debounceStartTyping]
	)

	return { handleInputKeyDown, handleInputKeyUp }
}
