import { Stack } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { TPaginatedPostsType } from '../../common/types'
import { currentUserState } from '../../recoil/atoms'
import FriendsList from '../FriendsList'
import FriendsListSkeleton from '../FriendsList/Skeleton'
import LeftSideBar from '../LeftSideBar'
import PostsInfiniteList from '../Posts/PostsInfiniteList'
import PostsInfiniteListSkeleton from '../Posts/PostsInfiniteListSkeleton'

const Home = () => {
	const currentUserId = useRecoilValue(currentUserState)?.id
	const { pathname } = useLocation()
	const listType: TPaginatedPostsType =
		pathname === '/posts/liked' ? 'liked' : 'timeline'

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: 'auto',
		})
	}, [listType])

	return (
		<Stack
			direction='row'
			justifyContent={{ xs: 'center', lg: 'space-between' }}
			sx={{ mt: '78px' }}
		>
			<LeftSideBar />
			<Suspense fallback={<PostsInfiniteListSkeleton />}>
				<PostsInfiniteList listType={listType} userId={currentUserId} />
			</Suspense>
			<Suspense fallback={<FriendsListSkeleton />}>
				<FriendsList />
			</Suspense>
		</Stack>
	)
}

export default Home
