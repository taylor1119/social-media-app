import AddCircleIcon from '@mui/icons-material/AddCircle'
import CloseIcon from '@mui/icons-material/Close'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import RemoveIcon from '@mui/icons-material/Remove'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
	alpha,
	Avatar,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	InputBase,
	Skeleton,
	Stack,
	styled,
} from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import { TUiUser } from '../../../common/types'

const CustomInput = styled(InputBase)(({ theme }) => ({
	position: 'relative',
	borderRadius: '50px',
	marginInline: '16px',
	height: '36px',
	backgroundColor: alpha(theme.palette.action.active, 0.1),
	'&:hover': {
		backgroundColor: alpha(theme.palette.action.active, 0.15),
	},
	'& .MuiInputBase-input': {
		paddingInline: '10px',
	},
}))

const ChatMessageSkeleton = ({ isOwn }: { isOwn: boolean }) => {
	return isOwn ? (
		<Stack
			direction='row'
			spacing={1}
			sx={{ maxWidth: '600px', alignSelf: 'flex-end' }}
		>
			<Skeleton
				variant='rectangular'
				height={37}
				width={185}
				sx={{ borderRadius: 16 }}
			/>
			<Skeleton
				variant='circular'
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
			/>
		</Stack>
	) : (
		<Stack direction='row' spacing={1} sx={{ maxWidth: '600px' }}>
			<Skeleton
				variant='circular'
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
			/>
			<Skeleton
				variant='rectangular'
				height={37}
				width={185}
				sx={{ borderRadius: 16 }}
			/>
		</Stack>
	)
}

const ChatBoxSkeleton = ({ user }: { user: TUiUser }) => {
	return (
		<Card
			sx={{
				width: 338,
				height: 465,
			}}
		>
			<Stack
				direction='row'
				justifyContent='space-between'
				alignItems='center'
			>
				<Button
					component={RouterLink}
					to={'/profile/' + user.id}
					sx={{
						textTransform: 'none',
						m: '2px',
					}}
					variant='text'
					startIcon={
						<Avatar
							src={user.avatar}
							alt={user.userName}
							sx={{ height: 32, width: 32 }}
						/>
					}
				>
					{user.userName}
				</Button>
				<Stack direction='row' spacing={1} sx={{ p: '8px' }}>
					<IconButton
						aria-label='close'
						sx={{ height: 26, width: 26 }}
					>
						<RemoveIcon />
					</IconButton>
					<IconButton
						aria-label='minimize'
						sx={{ height: 26, width: 26 }}
					>
						<CloseIcon />
					</IconButton>
				</Stack>
			</Stack>
			<Divider />
			<CardContent
				sx={{
					height: 353,
					overflowX: 'hidden',
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column-reverse',
					gap: '12px',
				}}
			>
				{[...Array(7)].map((_, idx) => (
					<ChatMessageSkeleton key={idx} isOwn={idx % 2 === 0} />
				))}
			</CardContent>
			<CardActions sx={{ justifyContent: 'space-between' }}>
				<IconButton aria-label='add'>
					<AddCircleIcon color='primary' />
				</IconButton>
				<form>
					<CustomInput
						placeholder='Aa'
						inputProps={{ 'aria-label': 'chat' }}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									sx={{
										height: '28px',
										width: '28px',
										mr: '4px',
									}}
								>
									<EmojiEmotionsIcon color='primary' />
								</IconButton>
							</InputAdornment>
						}
					/>
				</form>
				<IconButton aria-label='like'>
					<ThumbUpIcon color='primary' />
				</IconButton>
			</CardActions>
		</Card>
	)
}

export default ChatBoxSkeleton
