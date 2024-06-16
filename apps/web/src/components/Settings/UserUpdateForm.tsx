import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
	Box,
	Button,
	ButtonTypeMap,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { useUpdateUserProfile } from '../../hooks/usersHooks'

const UserUpdateForm = () => {
	const {
		useFormReturn: {
			register,
			formState: { errors },
		},
		useMutationReturn: { status, isLoading, error },
		onSubmit,
	} = useUpdateUserProfile()

	const [showPassword, setShowPassword] = useState(false)
	const handleToggleShowPassword = () => setShowPassword((prev) => !prev)

	let singUpBtnText = 'Update Profile'
	let singUpBtnColor: ButtonTypeMap['props']['color'] = 'primary'

	switch (status) {
		case 'idle':
			singUpBtnColor = 'primary'
			singUpBtnText = 'Update Profile'
			break
		case 'loading':
			singUpBtnText = 'Updating...'
			break
		case 'success':
			singUpBtnText = 'Profile Updated'
			singUpBtnColor = 'success'
			break
		case 'error':
			singUpBtnText = 'something went wrong'
			singUpBtnColor = 'error'
			break
		default:
			break
	}

	const serverResErr = error?.response?.data

	return (
		<Box sx={{ maxWidth: '600px', p: '20px' }}>
			<Typography variant='h4' fontWeight={600}>
				Edit Your Profile
			</Typography>
			<Divider sx={{ my: '1rem', mx: '-20px' }} />
			<Stack spacing={2} component='form' onSubmit={onSubmit}>
				<FormControl
					variant='outlined'
					error={Boolean(errors.userName || serverResErr?.userName)}
				>
					<InputLabel htmlFor='userName'>User Name</InputLabel>
					<OutlinedInput
						id='userName'
						label='userName'
						{...register('userName')}
						disabled={isLoading}
					/>
					<FormHelperText id='userName'>
						{errors.userName?.message || serverResErr?.userName}
					</FormHelperText>
				</FormControl>

				<FormControl variant='outlined' error={Boolean(errors.avatar)}>
					<InputLabel htmlFor='avatar'>Avatar</InputLabel>
					<OutlinedInput
						id='avatar'
						label='avatar'
						{...register('avatar')}
						disabled={isLoading}
					/>
					<FormHelperText id='avatar'>
						{errors.avatar?.message || 'Image Link (Optional)'}
					</FormHelperText>
				</FormControl>

				<FormControl variant='outlined' error={Boolean(errors.cover)}>
					<InputLabel htmlFor='cover'>Cover</InputLabel>
					<OutlinedInput
						id='cover'
						label='cover'
						{...register('cover')}
						disabled={isLoading}
					/>
					<FormHelperText id='cover'>
						{errors.cover?.message || 'Image Link (Optional)'}
					</FormHelperText>
				</FormControl>

				<Stack direction='row' spacing={2}>
					<FormControl
						fullWidth
						variant='outlined'
						error={Boolean(errors.email || serverResErr?.email)}
					>
						<InputLabel htmlFor='email'>Email</InputLabel>
						<OutlinedInput
							id='email'
							label='Email'
							{...register('email')}
							disabled={isLoading}
						/>
						<FormHelperText id='email'>
							{errors.email?.message || serverResErr?.email}
						</FormHelperText>
					</FormControl>

					<FormControl
						fullWidth
						variant='outlined'
						error={Boolean(errors.confirmEmail)}
					>
						<InputLabel htmlFor='confirmEmail'>
							Confirm Email
						</InputLabel>
						<OutlinedInput
							id='confirmEmail'
							label='confirmEmail'
							{...register('confirmEmail')}
							disabled={isLoading}
						/>
						<FormHelperText id='email'>
							{errors.confirmEmail?.message}
						</FormHelperText>
					</FormControl>
				</Stack>

				<Stack direction='row' spacing={2}>
					<FormControl
						fullWidth
						variant='outlined'
						error={Boolean(errors.password)}
					>
						<InputLabel htmlFor='password'>password</InputLabel>
						<OutlinedInput
							id='password'
							label='password'
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
							disabled={isLoading}
						/>
						<FormHelperText id='email'>
							{errors.password?.message}
						</FormHelperText>
					</FormControl>

					<FormControl
						fullWidth
						variant='outlined'
						error={Boolean(errors.confirmPassword)}
					>
						<InputLabel htmlFor='confirmPassword'>
							Confirm Password
						</InputLabel>
						<OutlinedInput
							id='confirmPassword'
							label='confirmPassword'
							type={showPassword ? 'text' : 'password'}
							{...register('confirmPassword')}
							disabled={isLoading}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleToggleShowPassword}
										edge='end'
									>
										{showPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText id='confirmPassword'>
							{errors.confirmPassword?.message}
						</FormHelperText>
					</FormControl>
				</Stack>

				<Button
					variant='contained'
					size='large'
					type='submit'
					disabled={isLoading}
					color={singUpBtnColor}
				>
					{singUpBtnText}
				</Button>
			</Stack>
		</Box>
	)
}

export default UserUpdateForm
