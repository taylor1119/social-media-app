import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { Avatar, Button, Divider, Paper, Stack, TextField } from '@mui/material'
import { TPostInput } from 'shared'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { useAddPost } from '../../hooks/postsHooks'
import { currentUserState } from '../../recoil/atoms'

const PostForm = () => {
	const currentUser = useRecoilValue(currentUserState)
	const { handleSubmit, register, reset, resetField } = useForm<TPostInput>()

	const { mutate, isSuccess, isError, status } = useAddPost()

	const onSubmit = handleSubmit((post: TPostInput) => {
		mutate(post)
	})

	useEffect(() => {
		if (isSuccess) reset()
	}, [isSuccess, reset])

	const [photoEnabled, setPhotoEnabled] = useState(false)
	const handleEnablePhoto = () => {
		setPhotoEnabled((prev) => {
			if (prev) resetField('img')
			return !prev
		})
	}

	let sendBtnText = 'add post'
	switch (status) {
		case 'loading':
			sendBtnText = 'adding post...'
			break
		case 'error':
			sendBtnText = 'adding post failed'
			break
		default:
			sendBtnText = 'add post'
			break
	}

	return (
		<Paper component='form' onSubmit={onSubmit}>
			<Stack direction='column' sx={{ p: '12px' }} spacing={2}>
				<Stack direction='row' spacing={2}>
					<Avatar
						src={currentUser?.avatar}
						alt={currentUser?.userName}
					/>
					<TextField
						autoComplete='off'
						placeholder={`What's on your mind, ${currentUser?.userName}?`}
						size='small'
						multiline
						fullWidth
						disabled={status === 'loading'}
						{...register('description')}
					/>
				</Stack>
				{photoEnabled && (
					<TextField
						autoComplete='off'
						placeholder='Paste a photo url'
						size='small'
						fullWidth
						disabled={status === 'loading'}
						sx={{ pl: '56px' }}
						{...register('img')}
					/>
				)}
			</Stack>
			<Divider variant='middle' />
			<Stack
				direction='row'
				sx={{ p: '6px' }}
				justifyContent='space-around'
			>
				<Button
					aria-describedby='photo-url'
					onClick={handleEnablePhoto}
					size='large'
					variant='text'
					startIcon={<AddPhotoAlternateIcon />}
					disabled={status === 'loading'}
				>
					{photoEnabled ? 'remove photo' : 'add photo'}
				</Button>
				<Button
					type='submit'
					size='large'
					variant='text'
					startIcon={<AddCircleIcon />}
					disabled={status === 'loading'}
					color={isError ? 'error' : 'primary'}
				>
					{sendBtnText}
				</Button>
			</Stack>
		</Paper>
	)
}

export default PostForm
