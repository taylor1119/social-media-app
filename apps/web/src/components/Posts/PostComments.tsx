import { yupResolver } from '@hookform/resolvers/yup'
import {
	FormControl,
	FormHelperText,
	OutlinedInput,
	Paper,
	Stack,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { IPost, IPostComment, TPostCommentInput } from 'shared'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { object, string } from 'yup'
import {
	useDeletePostComment,
	useUpdatePostComment,
} from '../../hooks/postCommentsHooks'
import useGetPostComments from '../../hooks/usePostComments'
import { currentUserState } from '../../recoil/atoms'

const CommentText = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}))

const PostComment = ({ postComment }: { postComment: IPostComment }) => {
	const currentUser = useRecoilValue(currentUserState)
	const [edit, setEdit] = useState(false)
	const handleEnableEdit = () => setEdit(true)
	const handleDisableEdit = () => setEdit(false)

	const { register, handleSubmit } = useForm<TPostCommentInput>({
		resolver: yupResolver(object({ text: string().required() })),
		defaultValues: { text: postComment.text },
	})

	const { mutate: updatePostComment } = useUpdatePostComment(
		postComment.id,
		postComment.postId
	)
	const { mutate: deletePostComment } = useDeletePostComment(
		postComment.id,
		postComment.postId
	)

	const handleUpdateComment = handleSubmit((postCommentInput) => {
		updatePostComment(postCommentInput)
		setEdit(false)
	})
	const handleDeleteComment = () => {
		if (postComment.id.includes('placeholder-new-post-comment-id')) return
		deletePostComment()
	}

	const isCurrentUserAuthor = postComment.author.id === currentUser?.id

	return (
		<Stack
			component='form'
			onSubmit={handleUpdateComment}
			spacing={1}
			width='fit-content'
		>
			<Stack direction='row' spacing={2}>
				<Avatar
					src={postComment.author.avatar}
					alt={postComment.author.userName}
				/>
				{edit ? (
					<FormControl fullWidth variant='outlined'>
						<OutlinedInput
							{...register('text')}
							id='post-comment'
						/>
						<FormHelperText id='post-comment'>
							{/*TODO add error messages */}
						</FormHelperText>
					</FormControl>
				) : (
					<CommentText sx={{ px: '12px', py: '8px' }} elevation={0}>
						<Typography>{postComment.text}</Typography>
					</CommentText>
				)}
			</Stack>
			{isCurrentUserAuthor && (
				<Stack
					direction='row'
					spacing={2}
					alignSelf='self-end'
					pr='16px'
				>
					<Typography
						fontWeight='500'
						fontSize='0.85rem'
						color='error'
						sx={{ cursor: 'pointer' }}
						onClick={edit ? handleDisableEdit : handleDeleteComment}
					>
						{edit ? 'Cancel' : 'Delete'}
					</Typography>
					<Typography
						onClick={edit ? handleUpdateComment : handleEnableEdit}
						fontWeight='500'
						fontSize='0.85rem'
						sx={{ cursor: 'pointer' }}
					>
						{edit ? 'Update' : 'Edit'}
					</Typography>
				</Stack>
			)}
		</Stack>
	)
}

const PostComments = ({ post }: { post: IPost }) => {
	const { data: comments } = useGetPostComments(post.comments, true, post.id)

	return (
		<>
			{comments?.map((comment) => (
				<PostComment key={comment.id} postComment={comment} />
			))}
		</>
	)
}

export default PostComments
