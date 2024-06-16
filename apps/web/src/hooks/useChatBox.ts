import { useRecoilState } from 'recoil'
import { TUiUser } from '../common/types'
import { chatBoxesState } from '../recoil/atoms'

const useChatBox = (user: TUiUser) => {
	const [chatBoxes, setChatBoxes] = useRecoilState(chatBoxesState)

	const { minimized, open } = chatBoxes

	const openKeys = Array.from(chatBoxes.open.keys())
	const minimizedKeys = Array.from(chatBoxes.minimized.keys())
	const openValues = Array.from(chatBoxes.open.values())

	const onMinimize = () => {
		open.delete(user.id)
		minimized.set(user.id, user)
		if (minimizedKeys.length >= 7) minimized.delete(minimizedKeys[0])

		setChatBoxes({
			minimized,
			open,
		})
	}

	const onMaximize = () => {
		minimized.delete(user.id)

		if (openKeys.length === 3) {
			minimized.set(openKeys[0], openValues[0])
			open.delete(openKeys[0])
		}

		open.set(user.id, user)
		setChatBoxes({
			minimized,
			open,
		})
	}

	const onOpen = () => {
		if (open.get(user.id)) return

		if (open.size < 3) {
			open.set(user.id, user)
			minimized.delete(user.id)
		} else {
			open.delete(openKeys[0])
			open.set(user.id, user)

			minimized.set(openKeys[0], openValues[0])
			minimized.delete(user.id)
			if (minimizedKeys.length >= 7) minimized.delete(minimizedKeys[0])
		}
		setChatBoxes({
			open,
			minimized,
		})
	}

	const onClose = () => {
		open.delete(user.id)
		minimized.delete(user.id)
		setChatBoxes({
			open,
			minimized,
		})
	}

	return {
		onOpen,
		onClose,
		onMaximize,
		onMinimize,
	}
}
export default useChatBox
