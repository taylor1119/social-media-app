import ShareIcon from '@mui/icons-material/Share'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	Skeleton,
	Stack,
} from '@mui/material'
import PostForm from './PostForm'

//TODO pass down userId to post comp
const PostsInfiniteListSkeleton = () => {
	return (
		<Stack
			spacing={2.5}
			sx={{
				mb: '20px',
				width: { xs: '95%', md: '600px' },
			}}
		>
			<PostForm />
			{[...Array(2)].map((_, idx) => (
				<Card key={idx}>
					<CardHeader
						avatar={
							<Skeleton
								variant='circular'
								width={40}
								height={40}
							/>
						}
						title={
							<Skeleton variant='text' height={20} width={150} />
						}
						subheader={
							<Skeleton variant='text' height={20} width={130} />
						}
					/>
					<CardMedia>
						<Skeleton
							variant='rectangular'
							height={300}
							width={600}
						/>
					</CardMedia>
					<CardContent>
						<Skeleton variant='text' height={24} width={570} />
						<Skeleton variant='text' height={24} width={570} />
						<Skeleton variant='text' height={24} width={500} />
					</CardContent>
					<CardActions disableSpacing>
						<IconButton disabled aria-label='like'>
							<ThumbUpIcon />
						</IconButton>
						<IconButton disabled aria-label='dislike'>
							<ThumbDownIcon />
						</IconButton>
						<IconButton disabled aria-label='share'>
							<ShareIcon />
						</IconButton>
					</CardActions>
				</Card>
			))}
		</Stack>
	)
}

export default PostsInfiniteListSkeleton
