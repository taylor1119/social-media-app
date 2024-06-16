import { yupResolver } from '@hookform/resolvers/yup'
import {
	ArrowBack,
	ArrowForward,
	Close as CloseIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import ShareIcon from '@mui/icons-material/Share'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
	Avatar,
	Badge,
	Box,
	Button,
	CardHeader,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	Link,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	OutlinedInput,
	Paper,
	Stack,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	Navigate,
	Link as RouterLink,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { TPostInput } from 'shared'
import { TPaginatedPostsType } from '../../common/types'
import { updatePostValidationSchema } from '../../common/validation'
import { POSTS_PAGE_SIZE } from '../../constants/envVars'
import {
	useDeletePost,
	useDislikePost,
	useLikePost,
	useUpdatePost,
} from '../../hooks/postsHooks'
import useGetInfinitePosts from '../../hooks/useGetInfinitePosts'
import { currentUserState } from '../../recoil/atoms'
import PostCommentForm from '../Posts/PostCommentForm'
import PostComments from '../Posts/PostComments'
import PostCommentsSkeleton from '../Posts/PostCommentsSkeleton'

//TODO refactor
const useRouteQuery = () => {
	const { search } = useLocation()
	return useMemo(() => new URLSearchParams(search), [search])
}

const PostsWithImageViewer = () => {
	const { type, authorId } = useParams()
	const routeQuery = useRouteQuery()

	const page = parseInt(routeQuery.get('page') ?? '0')
	const index = parseInt(routeQuery.get('index') ?? '0')

	const navigate = useNavigate()

	const currentUser = useRecoilValue(currentUserState)
	const { data, fetchNextPage } = useGetInfinitePosts(
		type as TPaginatedPostsType,
		authorId
	)

	const posts = data?.pages.flat() ?? []
	const postIndex = page * POSTS_PAGE_SIZE + index
	const canNext = postIndex + 1 < (posts?.length ?? 0)
	const canBack = postIndex > 0

	const handleNext = () => {
		setEdit(false)
		const nextPage = index === POSTS_PAGE_SIZE - 1 ? page + 1 : page
		const nextIndex = index === POSTS_PAGE_SIZE - 1 ? 0 : index + 1
		navigate(
			`/posts/${type}/${currentUser?.id}?page=${nextPage}&index=${nextIndex}`
		)
	}
	const handleBack = () => {
		setEdit(false)
		const nextPage = index === 0 ? page - 1 : page
		const nextIndex = index === 0 ? POSTS_PAGE_SIZE - 1 : index - 1
		navigate(
			`/posts/${type}/${currentUser?.id}?page=${nextPage}&index=${nextIndex}`
		)
	}

	const postId = posts?.[postIndex]?.id ?? ''
	const { mutate: likeMutation } = useLikePost(postId, page, index)
	const { mutate: dislikeMutation } = useDislikePost(postId, page, index)

	useEffect(() => {
		if (postIndex > posts.length - 2) fetchNextPage()
	}, [fetchNextPage, postIndex, posts.length])

	const [seeMore, setSeeMore] = useState(false)
	const handleSeeMore = () => setSeeMore(!seeMore)

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const openSettings = Boolean(anchorEl)
	const handleSettingsOpen: React.MouseEventHandler<HTMLButtonElement> = (
		event
	) => setAnchorEl(event.currentTarget)
	const handleSettingsClose = () => setAnchorEl(null)

	const [edit, setEdit] = useState(false)
	const handleEnableEdit = () => {
		handleSettingsClose()
		setEdit(true)
	}

	const { mutate: updatePost } = useUpdatePost(page, index)
	const { mutate: deletePost } = useDeletePost(page, index)

	const { register, handleSubmit } = useForm<TPostInput>({
		resolver: yupResolver(updatePostValidationSchema),
		defaultValues: {
			description: posts?.[postIndex]?.description ?? '',
			img: posts?.[postIndex]?.img ?? '',
		},
	})

	if (!posts[postIndex]) return <Navigate to='/' replace />

	const isCurrentUserAuthor = posts[postIndex].author.id === currentUser?.id

	const canSeeMore = posts[postIndex].description.length > 200
	const description =
		canSeeMore === true && seeMore === false
			? posts[postIndex].description.substring(0, 200) + ' ...'
			: posts[postIndex].description

	const isLiked = posts[postIndex].likes.includes(currentUser?.id ?? '')
	const isDisliked = posts[postIndex].dislikes.includes(currentUser?.id ?? '')

	const onSubmit = handleSubmit((postInput) => {
		updatePost({ postId: posts[postIndex].id, postInput })
		setEdit(false)
	})

	const handleDeletePost = () => {
		handleSettingsClose()
		deletePost(posts[postIndex].id)
	}

	return (
		<Stack height='100vh' direction={{ md: 'row' }}>
			<Box
				position='relative'
				display='flex'
				justifyContent='center'
				alignItems='center'
				flexGrow='1'
			>
				<IconButton
					component={RouterLink}
					to='/'
					sx={{
						top: '8px',
						left: '8px',
						height: 'fit-content',
						position: 'absolute',
					}}
				>
					<Avatar>
						<CloseIcon />
					</Avatar>
				</IconButton>
				<IconButton
					onClick={handleBack}
					disabled={!canBack}
					sx={{
						left: '8px',
						position: 'absolute',
						top: 0,
						bottom: 0,
						mt: 'auto',
						mb: 'auto',
						height: 'fit-content',
					}}
				>
					<Avatar>
						<ArrowBack />
					</Avatar>
				</IconButton>
				<IconButton
					onClick={handleNext}
					disabled={!canNext}
					sx={{
						right: '8px',
						position: 'absolute',
						top: 0,
						bottom: 0,
						mt: 'auto',
						mb: 'auto',
						height: 'fit-content',
					}}
				>
					<Avatar>
						<ArrowForward />
					</Avatar>
				</IconButton>
				<Box
					crossOrigin='anonymous'
					loading='lazy'
					component='img'
					maxHeight={{ xs: '50vh', md: '100vh' }}
					maxWidth='100%'
					sx={{ objectFit: 'contain' }}
					src={posts?.[postIndex].img}
				/>
			</Box>

			<Paper
				sx={{
					borderRadius: 0,
					width: { xs: '100%', md: '400px' },
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Stack flexGrow='1' overflow='auto'>
					<CardHeader
						avatar={
							<Avatar
								src={posts?.[postIndex].author.avatar}
								alt={posts?.[postIndex].author.userName}
								aria-label='avatar'
								component={RouterLink}
								to={'/profile/' + posts?.[postIndex].author.id}
							/>
						}
						action={
							isCurrentUserAuthor && (
								<IconButton
									id='settings-button'
									aria-controls={
										openSettings
											? 'settings-menu'
											: undefined
									}
									aria-haspopup='true'
									aria-expanded={
										openSettings ? 'true' : undefined
									}
									onClick={handleSettingsOpen}
								>
									<MoreVertIcon />
								</IconButton>
							)
						}
						title={posts?.[postIndex].author.userName}
						subheader={new Date(
							posts?.[postIndex].createdAt
						).toLocaleDateString('en-gb', {
							year: 'numeric',
							day: 'numeric',
							month: 'long',
						})}
					/>
					{edit ? (
						<Stack
							px='16px'
							component='form'
							spacing={2}
							onSubmit={onSubmit}
						>
							<FormControl fullWidth variant='outlined'>
								<InputLabel htmlFor='post-image'>
									Post Image
								</InputLabel>
								<OutlinedInput
									id='post-image'
									label='post-image'
									{...register('img')}
								/>
								<FormHelperText id='post-image'>
									{}
								</FormHelperText>
							</FormControl>

							<FormControl fullWidth variant='outlined'>
								<InputLabel htmlFor='post-text'>
									Post Text
								</InputLabel>
								<OutlinedInput
									id='post-text'
									label='post-text'
									multiline
									rows={3}
									{...register('description')}
								/>
								<FormHelperText id='post-text'></FormHelperText>
							</FormControl>
							<Stack
								direction='row'
								justifyContent='space-between'
							>
								<Button
									onClick={() => setEdit(false)}
									color='error'
									variant='text'
								>
									Cancel
								</Button>
								<Button type='submit' variant='text'>
									Update
								</Button>
							</Stack>
						</Stack>
					) : (
						<Typography px='16px' paragraph>
							{description + ' '}
							{canSeeMore && (
								<Link
									sx={{ cursor: 'pointer' }}
									component='span'
									underline='hover'
									onClick={handleSeeMore}
								>
									{seeMore ? 'See less' : 'See more'}
								</Link>
							)}
						</Typography>
					)}
					<Divider variant='middle' />
					<Stack
						direction='row'
						justifyContent='space-around'
						py='12px'
					>
						<span>
							<IconButton
								disabled={isLiked}
								aria-label='like'
								onClick={() => likeMutation()}
							>
								<Badge
									badgeContent={
										posts?.[postIndex].likes.length
									}
									color='primary'
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
								>
									<ThumbUpIcon
										color={isLiked ? 'primary' : 'inherit'}
									/>
								</Badge>
							</IconButton>
							<IconButton
								aria-label='dislike'
								disabled={isDisliked}
								onClick={() => dislikeMutation()}
							>
								<Badge
									badgeContent={
										posts?.[postIndex].dislikes.length
									}
									color='error'
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
								>
									<ThumbDownIcon
										color={isDisliked ? 'error' : 'inherit'}
									/>
								</Badge>
							</IconButton>
						</span>

						<IconButton aria-label='share'>
							<ShareIcon />
						</IconButton>
					</Stack>
					<Divider variant='middle' />
					<Stack p='16px' direction='column' spacing={2}>
						<Suspense
							fallback={
								<PostCommentsSkeleton commentsNumber={6} />
							}
						>
							<PostComments post={posts?.[postIndex]} />
						</Suspense>
					</Stack>

					<Menu
						id='settings-menu'
						anchorEl={anchorEl}
						open={openSettings}
						onClose={handleSettingsClose}
						MenuListProps={{
							'aria-labelledby': 'settings-button',
						}}
					>
						<MenuItem onClick={handleEnableEdit}>
							<ListItemIcon>
								<EditIcon />
							</ListItemIcon>
							<ListItemText>Edit</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleDeletePost}>
							<ListItemIcon>
								<DeleteIcon color='error' />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{ color: 'error' }}
							>
								Delete
							</ListItemText>
						</MenuItem>
					</Menu>
				</Stack>

				<PostCommentForm postId={posts?.[postIndex].id as string} />
			</Paper>
		</Stack>
	)
}

export default PostsWithImageViewer
