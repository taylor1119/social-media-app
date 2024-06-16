import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
	Button,
	ButtonTypeMap,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	Modal,
	OutlinedInput,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { useSignUp } from '../../hooks/usersHooks'
interface ISignUpFormProps {
	openSignUpForm: boolean
	handleCloseSignUpForm: () => void
}

const SignUpForm = ({
	handleCloseSignUpForm,
	openSignUpForm,
}: ISignUpFormProps) => {
	const {
		useFormReturn: {
			register,
			formState: { errors },
		},
		useMutationReturn: { status, isLoading, error },
		onSubmit,
	} = useSignUp()

	const [showPassword, setShowPassword] = useState(false)
	const handleToggleShowPassword = () => setShowPassword((prev) => !prev)

	let singUpBtnText = 'sign up'
	let singUpBtnColor: ButtonTypeMap['props']['color'] = 'primary'

	switch (status) {
		case 'idle':
			singUpBtnColor = 'primary'
			singUpBtnText = 'sign up'
			break
		case 'loading':
			singUpBtnText = 'signing up...'
			break
		case 'success':
			singUpBtnText = 'try logging in'
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
		<Modal
			open={openSignUpForm}
			onClose={handleCloseSignUpForm}
			aria-labelledby='sign-up-form'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Paper sx={{ width: '450px', p: '20px' }}>
				<Typography variant='h4' fontWeight={600}>
					Sign Up
				</Typography>
				<Typography variant='subtitle1'>
					It&apos;s quick and easy.
				</Typography>
				<Divider sx={{ my: '1rem', mx: '-20px' }} />
				<Stack spacing={2} component='form' onSubmit={onSubmit}>
					<FormControl
						variant='outlined'
						error={Boolean(
							errors.userName || serverResErr?.userName
						)}
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

					<FormControl
						variant='outlined'
						error={Boolean(errors.avatar)}
					>
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

					<FormControl
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

					<FormControl
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
			</Paper>
		</Modal>
	)
}

export default SignUpForm
