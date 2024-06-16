import {
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	SwitchAccount as SwitchAccountIcon,
	Visibility,
	VisibilityOff,
} from '@mui/icons-material'
import {
	Box,
	Button,
	ButtonTypeMap,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	OutlinedInput,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { lazy, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useLogin } from '../../hooks/usersHooks'
import { themeState } from '../../recoil/atoms'
import MockAccountsList from './MockAccountsList'

const SignUpForm = lazy(() => import('./SignUpForm'))

const LoginForm = () => {
	const {
		useFormReturn: {
			register,
			formState: { errors },
		},
		useMutationResult: { isLoading, status, mutate },
		onSubmit,
	} = useLogin()

	const [showPassword, setShowPassword] = useState(false)
	const handleToggleShowPassword = () => setShowPassword((prev) => !prev)

	const [openSignUpForm, setOpenSignUpForm] = useState(false)
	const handleOpenSignUpForm = () => setOpenSignUpForm(true)
	const handleCloseSignUpForm = () => setOpenSignUpForm(false)

	const [openMockAccountsList, setMockAccountsList] = useState(false)
	const handleOpenOpenMockAccountsList = () => setMockAccountsList(true)
	const handleCloseOpenMockAccountsList = () => setMockAccountsList(false)

	let LoginBtnText = 'login'
	let loginBtnColor: ButtonTypeMap['props']['color'] = 'primary'

	switch (status) {
		case 'idle':
			loginBtnColor = 'primary'
			LoginBtnText = 'login'
			break
		case 'loading':
			LoginBtnText = 'login in...'
			break
		case 'error':
			LoginBtnText = 'something went wrong'
			loginBtnColor = 'error'
			break
		default:
			break
	}

	const [theme, setTheme] = useRecoilState(themeState)

	const handleToggleTheme = () => {
		setTheme((currVal) => ({
			isUserPicked: true,
			mode: currVal.mode === 'dark' ? 'light' : 'dark',
		}))
	}

	return (
		<Stack height='100vh'>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				justifyContent={{ xs: 'flex-start', md: 'center' }}
				alignItems='center'
				spacing={3}
				flexGrow='1'
			>
				<Box
					sx={{ maxWidth: 500, p: '20px' }}
					textAlign={['center', 'center', 'left']}
				>
					<Typography
						sx={{ fontWeight: 'bold' }}
						variant='h3'
						color='#1976d2'
						gutterBottom
					>
						SocialApp
					</Typography>
					<Typography variant='h5' gutterBottom>
						Connect with friends and the world around you on
						SocialApp.
					</Typography>
				</Box>
				<Paper sx={{ p: '20px', width: '400px' }}>
					<Stack spacing={2} component='form' onSubmit={onSubmit}>
						<FormControl
							variant='outlined'
							error={Boolean(errors.email)}
						>
							<OutlinedInput
								placeholder='Email'
								id='email'
								{...register('email')}
							/>
							<FormHelperText id='email'>
								{errors.email?.message}
							</FormHelperText>
						</FormControl>
						<FormControl
							variant='outlined'
							error={Boolean(errors.password)}
						>
							<OutlinedInput
								id='password'
								placeholder='Password'
								type={showPassword ? 'text' : 'password'}
								{...register('password')}
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
							<FormHelperText id='password'>
								{errors.password?.message}
							</FormHelperText>
						</FormControl>

						<Button
							variant='contained'
							size='large'
							type='submit'
							disabled={isLoading}
							color={loginBtnColor}
						>
							{LoginBtnText}
						</Button>
						<Button
							variant='contained'
							size='large'
							color='warning'
							startIcon={<SwitchAccountIcon />}
							onClick={handleOpenOpenMockAccountsList}
						>
							Mock Accounts
						</Button>
						<Button variant='text' size='small'>
							Forget password?
						</Button>
						<Divider variant='middle' />
						<Button
							color='success'
							variant='contained'
							onClick={handleOpenSignUpForm}
						>
							Create new account
						</Button>
					</Stack>
				</Paper>
			</Stack>
			<Stack justifyContent='center' alignItems='center' p='16px'>
				<IconButton size='large' onClick={handleToggleTheme}>
					{theme.mode === 'dark' ? (
						<DarkModeIcon />
					) : (
						<LightModeIcon />
					)}
				</IconButton>
			</Stack>

			<SignUpForm
				handleCloseSignUpForm={handleCloseSignUpForm}
				openSignUpForm={openSignUpForm}
			/>
			<MockAccountsList
				handleCloseOpenMockAccountsList={
					handleCloseOpenMockAccountsList
				}
				openMockAccountsList={openMockAccountsList}
				mutate={mutate}
			/>
		</Stack>
	)
}

export default LoginForm
