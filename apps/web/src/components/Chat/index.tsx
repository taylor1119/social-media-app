import { Stack } from '@mui/material'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import { chatBoxesState } from '../../recoil/atoms'
import ChatBox from './ChatBox'
import ChatBoxSkeleton from './ChatBox/Skeleton'
import MinimizedChatBox from './MinimizedChatBox'

const Chat = () => {
	const chatBox = useRecoilValue(chatBoxesState)
	const minimized = Array.from(chatBox.minimized.values())
	const open = Array.from(chatBox.open.values())

	return (
		<>
			<Stack
				spacing={2}
				sx={{
					position: 'fixed',
					bottom: 10,
					right: 10,
					zIndex: 9999,
				}}
			>
				{minimized.map((user) => (
					<MinimizedChatBox
						key={'minimized-chat-box-' + user.id}
						user={user}
					/>
				))}
			</Stack>
			<Stack
				direction='row'
				spacing={1}
				sx={{
					position: 'fixed',
					bottom: 0,
					right: 100,
					zIndex: 9999,
				}}
			>
				{open.map((user) => (
					<Suspense
						key={user.id}
						fallback={<ChatBoxSkeleton user={user} />}
					>
						<ChatBox user={user} />
					</Suspense>
				))}
			</Stack>
		</>
	)
}

export default Chat
