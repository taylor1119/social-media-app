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
	Stack,
	styled,
} from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { TUiUser } from '../../../common/types'
import useChatBox from '../../../hooks/useChatBox'
import useGetConversation from '../../../hooks/useGetConversation'
import useSendMessage from '../../../hooks/useSendMessage'
import { useTypingNotification } from '../../../hooks/useTypingNotification'
import {
	currentUserState,
	typingIndicatorMapState,
} from '../../../recoil/atoms'
import ChatMessage from '../ChatMessage'
import TypingIndicator from '../TypingIndicator'

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

const ChatBox = ({ user }: { user: TUiUser }) => {
	const currentUser = useRecoilValue(currentUserState)
	const { data: chatMessages } = useGetConversation(user.id)
	const { onMinimize, onClose } = useChatBox(user)
	const { onSubmit, register } = useSendMessage(user.id)
	const { handleInputKeyDown, handleInputKeyUp } = useTypingNotification(
		user.id
	)
	const typingIndicatorMap = useRecoilValue(typingIndicatorMapState)

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
							alt={user.userName}
							src={user.avatar}
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
						onClick={onMinimize}
					>
						<RemoveIcon />
					</IconButton>
					<IconButton
						aria-label='minimize'
						sx={{ height: 26, width: 26 }}
						onClick={onClose}
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
				{typingIndicatorMap.get(user.id) && (
					<TypingIndicator avatar={user.avatar} />
				)}
				{chatMessages
					?.slice(0)
					.reverse()
					.map((chatMessage) => (
						<ChatMessage
							key={chatMessage.id}
							chatMessage={chatMessage}
							isOwn={currentUser?.id === chatMessage.senderId}
							sender={
								currentUser?.id === chatMessage.senderId
									? (currentUser as TUiUser)
									: user
							}
						/>
					))}
			</CardContent>
			<CardActions sx={{ justifyContent: 'space-between' }}>
				<IconButton aria-label='add'>
					<AddCircleIcon color='primary' />
				</IconButton>
				<form onSubmit={onSubmit}>
					<CustomInput
						placeholder='Aa'
						inputProps={{ 'aria-label': 'chat' }}
						onKeyUp={handleInputKeyUp}
						onKeyDown={handleInputKeyDown}
						{...register('text')}
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

export default ChatBox
