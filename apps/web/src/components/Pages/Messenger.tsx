import { Stack } from '@mui/material'
import { Suspense } from 'react'
import ChatBox from '../Messenger/Chat'
import FriendDetails from '../Messenger/FriendDetails'
import FriendsList from '../Messenger/FriendsList'
import ChatBoxSkeleton from '../Messenger/Skeleton'

const Messenger = () => {
	return (
		<Stack direction='row' mt={{ xs: '56px', sm: '64px' }}>
			<FriendsList />
			<Suspense fallback={<ChatBoxSkeleton />}>
				<ChatBox />
			</Suspense>

			<FriendDetails />
		</Stack>
	)
}

export default Messenger
