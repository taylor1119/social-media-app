import { Stack, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { useAddPostComment } from '../../hooks/postCommentsHooks';
import { currentUserState } from '../../recoil/atoms';

const PostCommentForm = ({ postId }: { postId: string }) => {
	const currentUser = useRecoilValue(currentUserState);

	const { handleSubmit, register, reset } = useForm<{ text: string }>();

	const {
		mutate: addPostMutation,
		isSuccess,
		isLoading,
	} = useAddPostComment(postId);

	const onSubmit = (postComment: { text: string }) =>
		addPostMutation(postComment);

	useEffect(() => {
		if (isSuccess) reset();
	}, [isSuccess, reset]);

	return (
		<Stack
			direction='row'
			spacing={2}
			sx={{ m: 3 }}
			component='form'
			onSubmit={handleSubmit(onSubmit)}
		>
			<Avatar src={currentUser?.avatar} alt={currentUser?.userName} />
			<TextField
				autoComplete='off'
				placeholder='Write a comment...'
				size='small'
				fullWidth
				helperText='Press Enter to post.'
				disabled={isLoading || !postId}
				{...register('text')}
			/>
		</Stack>
	);
};

export default PostCommentForm;
