import {
	Box,
	Button,
	ButtonTypeMap,
	Divider,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Typography,
} from '@mui/material'
import { useUpdateUserIntro } from '../../hooks/usersHooks'

const IntroUpdateForm = () => {
	const {
		useFormReturn: {
			register,
			formState: { errors, defaultValues },
		},
		useMutationReturn: { status, isLoading },
		onSubmit,
	} = useUpdateUserIntro()

	let singUpBtnText = 'Update Intro'
	let singUpBtnColor: ButtonTypeMap['props']['color'] = 'primary'

	switch (status) {
		case 'idle':
			singUpBtnColor = 'primary'
			singUpBtnText = 'Update Intro'
			break
		case 'loading':
			singUpBtnText = 'Updating...'
			break
		case 'success':
			singUpBtnText = 'Intro Updated'
			singUpBtnColor = 'success'
			break
		case 'error':
			singUpBtnText = 'something went wrong'
			singUpBtnColor = 'error'
			break
		default:
			break
	}

	return (
		<Box sx={{ width: '600px', p: '20px' }}>
			<Typography variant='h4' fontWeight={600}>
				Edit Your Intro
			</Typography>
			<Divider sx={{ my: '1rem', mx: '-20px' }} />
			<Stack spacing={2} component='form' onSubmit={onSubmit}>
				<FormControl variant='outlined' error={Boolean(errors.bio)}>
					<InputLabel htmlFor='bio'>Bio</InputLabel>
					<OutlinedInput
						id='bio'
						label='bio'
						{...register('bio')}
						disabled={isLoading}
						multiline
						rows={3}
					/>
					<FormHelperText id='bio'>
						{errors.bio?.message}
					</FormHelperText>
				</FormControl>

				<Stack direction='row' spacing={2}>
					<FormControl
						variant='outlined'
						error={Boolean(errors.from)}
						fullWidth
					>
						<InputLabel htmlFor='from'>From</InputLabel>
						<OutlinedInput
							id='from'
							label='from'
							{...register('from')}
							disabled={isLoading}
						/>
						<FormHelperText id='from'>
							{errors.from?.message}
						</FormHelperText>
					</FormControl>
					<FormControl
						variant='outlined'
						error={Boolean(errors.address)}
						fullWidth
					>
						<InputLabel htmlFor='address'>Address</InputLabel>
						<OutlinedInput
							id='address'
							label='address'
							{...register('address')}
							disabled={isLoading}
						/>
						<FormHelperText id='address'>
							{errors.address?.message}
						</FormHelperText>
					</FormControl>
				</Stack>

				<FormControl
					variant='outlined'
					error={Boolean(errors.work)}
					fullWidth
				>
					<InputLabel htmlFor='work'>Work</InputLabel>
					<OutlinedInput
						id='work'
						label='work'
						{...register('work')}
						disabled={isLoading}
					/>
					<FormHelperText id='work'>
						{errors.work?.message}
					</FormHelperText>
				</FormControl>

				<Stack direction='row' spacing={2}>
					<FormControl
						variant='outlined'
						error={Boolean(errors.studiedAt)}
						fullWidth
					>
						<InputLabel htmlFor='studiedAt'>Studied At</InputLabel>
						<OutlinedInput
							id='studiedAt'
							label='studiedAt'
							{...register('studiedAt')}
							disabled={isLoading}
						/>
						<FormHelperText id='studiedAt'>
							{errors.studiedAt?.message}
						</FormHelperText>
					</FormControl>

					<FormControl
						variant='outlined'
						error={Boolean(errors.studiesAt)}
						fullWidth
					>
						<InputLabel htmlFor='studiesAt'>Studies At</InputLabel>
						<OutlinedInput
							id='studiesAt'
							label='studiesAt'
							{...register('studiesAt')}
							disabled={isLoading}
						/>
						<FormHelperText id='studiesAt'>
							{errors.studiesAt?.message}
						</FormHelperText>
					</FormControl>
				</Stack>

				<FormControl
					variant='outlined'
					error={Boolean(errors.relationshipStatus)}
				>
					<InputLabel htmlFor='relationshipStatus'>
						Relationship Status
					</InputLabel>
					<Select
						id='relationshipStatus'
						label='relationshipStatus'
						{...register('relationshipStatus')}
						disabled={isLoading}
						defaultValue={defaultValues?.relationshipStatus ?? ''}
					>
						<MenuItem value='Single'>Single</MenuItem>
						<MenuItem value='Married'>Married</MenuItem>
						<MenuItem value='Engaged'>Engaged</MenuItem>
						<MenuItem value='In A Relationship'>
							In A Relationship
						</MenuItem>
						<MenuItem value='Its Complicated'>
							Its Complicated
						</MenuItem>
					</Select>
					<FormHelperText id='relationshipStatus'>
						{errors.relationshipStatus?.message?.toString()}
					</FormHelperText>
				</FormControl>

				{/* //TODO add search a partner */}
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

export default IntroUpdateForm
