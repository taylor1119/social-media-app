import { Stack } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { TPaginatedPostsType } from '../../common/types'
import useGetInfinitePosts from '../../hooks/useGetInfinitePosts'
import JumpToTopButton from '../JumpToTopButton'
import Post from './Post'
import PostForm from './PostForm'
import PostsInfiniteListSkeleton from './PostsInfiniteListSkeleton'

const PostsInfiniteList = ({
	listType,
	userId,
}: {
	userId?: string
	listType: TPaginatedPostsType
}) => {
	const { intersectionItemRef, data, isFetchingNextPage } =
		useGetInfinitePosts(listType, userId)
	const posts = data?.pages.flat()
	const { pathname } = useLocation()

	return (
		<>
			<Stack
				spacing={2.5}
				sx={{
					mb: '20px',
					width: { xs: '95%', md: '600px' },
				}}
			>
				{pathname === '/' && <PostForm />}
				{posts?.map((post, idx) =>
					idx === posts.length - 2 ? (
						<Post
							key={post.id}
							observedItemRef={intersectionItemRef}
							post={post}
						/>
					) : (
						<Post key={post.id} post={post} />
					)
				)}
				{isFetchingNextPage && <PostsInfiniteListSkeleton />}
			</Stack>

			<JumpToTopButton />
		</>
	)
}

export default PostsInfiniteList
