import { Box, Stack } from '@mui/material'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import PostsInfiniteList from '../Posts/PostsInfiniteList'
import PostsInfiniteListSkeleton from '../Posts/PostsInfiniteListSkeleton'
import LeftSection from '../Profile/LeftSection'
import UpperSection from '../Profile/UpperSection'
const Profile = () => {
	const { userId } = useParams()
	return (
		<Box sx={{ mt: '64px' }}>
			<UpperSection />
			<Stack
				justifyContent='center'
				alignItems={{ xs: 'center', md: 'flex-start' }}
				spacing={3}
				sx={{ mt: '20px' }}
				direction={{ xs: 'column', md: 'row' }}
			>
				<LeftSection />
				<Suspense fallback={<PostsInfiniteListSkeleton />}>
					<PostsInfiniteList listType='timeline' userId={userId} />
				</Suspense>
			</Stack>
		</Box>
	)
}

export default Profile
