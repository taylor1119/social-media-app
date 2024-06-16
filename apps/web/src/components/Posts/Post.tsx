import { yupResolver } from '@hookform/resolvers/yup'
import { Delete as DeleteIcon, Edit } from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
	Badge,
	Button,
	Divider,
	FormControl,
	FormHelperText,
	InputLabel,
	Link,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	OutlinedInput,
	Stack,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { TPostInput } from 'shared'
import { TPaginatedPost } from '../../common/types'
import { updatePostValidationSchema } from '../../common/validation'
import {
	useDeletePost,
	useDislikePost,
	useLikePost,
	useUpdatePost,
} from '../../hooks/postsHooks'
import { currentUserState } from '../../recoil/atoms'
import PostCommentForm from './PostCommentForm'
import PostComments from './PostComments'
import PostCommentsSkeleton from './PostCommentsSkeleton'

const Post = ({
	post,
	observedItemRef: lastItemRef,
}: {
	post: TPaginatedPost
	observedItemRef?: (node: HTMLDivElement) => void
}) => {
	const [showComments, setShowComments] = useState(false)
	const handleShowComments = () => setShowComments((prev) => !prev)

	const [seeMore, setSeeMore] = useState(false)
	const handleSeeMore = () => setSeeMore(!seeMore)
	const canSeeMore = post.description.length > 200
	const description =
		canSeeMore === true && seeMore === false
			? post.description.substring(0, 200) + ' ...'
			: post.description

	const { mutate: likeMutation } = useLikePost(post.id, post.page, post.index)
	const { mutate: dislikeMutation } = useDislikePost(
		post.id,
		post.page,
		post.index
	)

	const currentUser = useRecoilValue(currentUserState)

	const isLiked = post.likes.includes(currentUser?.id ?? '')
	const isDisliked = post.dislikes.includes(currentUser?.id ?? '')

	const location = useLocation()
	const postsType =
		location.pathname === '/posts/liked' ? 'liked' : 'timeline'

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

	const { mutate: updatePost } = useUpdatePost(post.page, post.index)
	const { mutate: deletePost } = useDeletePost(post.page, post.index)

	const { register, handleSubmit } = useForm<TPostInput>({
		resolver: yupResolver(updatePostValidationSchema),
		defaultValues: {
			description: post.description,
			img: post.img,
		},
	})

	const onSubmit = handleSubmit((postInput) => {
		updatePost({ postId: post.id, postInput })
		setEdit(false)
	})

	const handleDeletePost = () => {
		handleSettingsClose()
		deletePost(post.id)
	}

	const isCurrentUserAuthor = post.author.id === currentUser?.id

	return (
		<Card ref={lastItemRef}>
			<CardHeader
				avatar={
					<Avatar
						src={post.author.avatar}
						alt={post.author.userName}
						aria-label='avatar'
						component={RouterLink}
						to={'/profile/' + post.author.id}
					/>
				}
				action={
					isCurrentUserAuthor && (
						<IconButton
							id='settings-button'
							aria-controls={
								openSettings ? 'settings-menu' : undefined
							}
							aria-haspopup='true'
							aria-expanded={openSettings ? 'true' : undefined}
							onClick={handleSettingsOpen}
						>
							<MoreVertIcon />
						</IconButton>
					)
				}
				title={post.author.userName}
				subheader={new Date(post.createdAt).toLocaleDateString(
					'en-gb',
					{
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					}
				)}
			/>
			{post.img && !edit && (
				<RouterLink
					to={`/posts/${postsType}/${currentUser?.id}?page=${post.page}&index=${post.index}`}
				>
					<CardMedia
						crossOrigin='anonymous'
						loading='lazy'
						component='img'
						image={post.img}
						alt='post img'
					/>
				</RouterLink>
			)}
			<CardContent>
				{edit ? (
					<Stack component='form' spacing={2} onSubmit={onSubmit}>
						<FormControl fullWidth variant='outlined'>
							<InputLabel htmlFor='post-image'>
								Post Image
							</InputLabel>
							<OutlinedInput
								id='post-image'
								label='post-image'
								{...register('img')}
							/>
							<FormHelperText id='post-image'>{}</FormHelperText>
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
						<Stack direction='row' justifyContent='space-between'>
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
					<Typography paragraph>
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
			</CardContent>
			<CardActions disableSpacing>
				<IconButton
					disabled={isLiked}
					aria-label='like'
					onClick={() => likeMutation()}
				>
					<Badge
						badgeContent={post.likes.length}
						color='primary'
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<ThumbUpIcon color={isLiked ? 'primary' : 'inherit'} />
					</Badge>
				</IconButton>
				<IconButton
					disabled={isDisliked}
					aria-label='dislike'
					onClick={() => dislikeMutation()}
				>
					<Badge
						badgeContent={post.dislikes.length}
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
				<IconButton aria-label='share'>
					<ShareIcon />
				</IconButton>
				<Button
					onClick={handleShowComments}
					variant='text'
					sx={{ ml: 'auto' }}
					disabled={!post.comments.length}
				>
					{post.comments.length} Comments
				</Button>
			</CardActions>
			<Divider variant='middle' />
			<PostCommentForm postId={post.id} />

			{showComments && (
				<Stack direction='column' spacing={3} sx={{ m: 3 }}>
					<Suspense
						fallback={<PostCommentsSkeleton commentsNumber={8} />}
					>
						<PostComments post={post} />
					</Suspense>
				</Stack>
			)}

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
						<Edit />
					</ListItemIcon>
					<ListItemText>Edit</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleDeletePost}>
					<ListItemIcon>
						<DeleteIcon color='error' />
					</ListItemIcon>
					<ListItemText primaryTypographyProps={{ color: 'error' }}>
						Delete
					</ListItemText>
				</MenuItem>
			</Menu>
		</Card>
	)
}

export default Post
