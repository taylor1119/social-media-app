import {
	ArrowBack,
	ArrowForward,
	Close as CloseIcon,
	MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import ShareIcon from '@mui/icons-material/Share'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
	Avatar,
	Box,
	CardHeader,
	Divider,
	IconButton,
	Paper,
	Skeleton,
	Stack,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import PostCommentForm from './PostCommentForm'
import PostCommentsSkeleton from './PostCommentsSkeleton'

const PostsWithImageViewerSkeleton = () => (
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
				to={'/'}
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
				disabled
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
				disabled
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
			<Skeleton
				variant='rectangular'
				sx={{
					width: { xs: '100vw', md: '85%' },
					height: { xs: '35vh', sm: '50vh', md: '80vh' },
				}}
			/>
		</Box>

		<Paper
			sx={{
				borderRadius: 0,
				width: { sx: '100%', md: '400px' },
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Stack flexGrow='1' overflow='auto'>
				<CardHeader
					avatar={
						<Skeleton
							variant='circular'
							height='40px'
							width='40px'
						/>
					}
					action={
						<IconButton aria-label='settings'>
							<MoreVertIcon />
						</IconButton>
					}
					title={
						<Skeleton
							variant='rectangular'
							height='16px'
							width='140px'
						/>
					}
				/>
				<Stack spacing={2} p='16px'>
					<Skeleton
						variant='rectangular'
						height='16px'
						width='360px'
					/>
					<Skeleton
						variant='rectangular'
						height='16px'
						width='330px'
					/>
					<Skeleton
						variant='rectangular'
						height='16px'
						width='300px'
					/>
				</Stack>

				<Divider variant='middle' />
				<Stack direction='row' justifyContent='space-around' py='12px'>
					<span>
						<IconButton disabled aria-label='like'>
							<ThumbUpIcon />
						</IconButton>
						<IconButton aria-label='dislike' disabled>
							<ThumbDownIcon />
						</IconButton>
					</span>

					<IconButton aria-label='share'>
						<ShareIcon />
					</IconButton>
				</Stack>
				<Divider variant='middle' />
				<Stack p='16px' direction='column' spacing={2}>
					<PostCommentsSkeleton commentsNumber={8} />
				</Stack>
			</Stack>

			<PostCommentForm postId='' />
		</Paper>
	</Stack>
)

export default PostsWithImageViewerSkeleton
