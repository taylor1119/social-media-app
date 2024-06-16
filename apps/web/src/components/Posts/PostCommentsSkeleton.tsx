import { Skeleton, Stack } from '@mui/material'

const PostCommentsSkeleton = ({
	commentsNumber,
}: {
	commentsNumber: number
}) => (
	<>
		{[...Array(commentsNumber)].map((_, idx) => (
			<Stack key={idx} direction='row' spacing={2}>
				<Skeleton variant='circular' height={40} width={40} />
				<Skeleton
					variant='rectangular'
					height={40}
					width={280}
					sx={{ borderRadius: '16px' }}
				/>
			</Stack>
		))}
	</>
)

export default PostCommentsSkeleton
