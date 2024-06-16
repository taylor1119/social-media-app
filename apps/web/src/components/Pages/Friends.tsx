import { Stack } from '@mui/material'
import { Suspense } from 'react'
import FriendsCardList from '../FriendRequests/Friends'
import ReceivedRequests from '../FriendRequests/ReceivedRequests'
import SentRequests from '../FriendRequests/SentRequests'
import LeftSideBar from '../LeftSideBar'
import Loading from '../Loading'

const Friends = () => (
	<Stack sx={{ mt: '64px' }} direction='row'>
		<LeftSideBar />
		<Stack sx={{ width: '100%' }}>
			<Suspense fallback={<Loading mt='64px' />}>
				<ReceivedRequests />
				<SentRequests />
				<FriendsCardList />
			</Suspense>
		</Stack>
	</Stack>
)

export default Friends
