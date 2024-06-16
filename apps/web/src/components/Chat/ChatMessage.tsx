import { Avatar, Paper, Stack, styled, Typography } from '@mui/material'
import { IChatMessage } from 'shared'
import { TUiUser } from '../../common/types'

const ChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#e4e6eb',
	borderRadius: '16px',
}))

const OwmChatMsgPaper = styled(Paper)(() => ({
	backgroundColor: '#0084ff',
	color: 'white',
	borderRadius: '16px',
}))

const ChatMessage = ({
	chatMessage,
	sender,
	isOwn,
}: {
	chatMessage: IChatMessage
	sender: TUiUser
	isOwn: boolean
}) => {
	if (isOwn)
		return (
			<Stack direction='row' spacing={1}>
				<Avatar
					src={sender?.avatar}
					sx={{
						alignSelf: 'flex-end',
						width: '28px',
						height: '28px',
					}}
					alt={sender?.userName}
				/>
				<ChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
					<Typography variant='body2'>{chatMessage.text}</Typography>
				</ChatMsgPaper>
			</Stack>
		)

	return (
		<Stack direction='row' spacing={1} alignSelf='flex-end'>
			<OwmChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
				<Typography variant='body2'>{chatMessage.text}</Typography>
			</OwmChatMsgPaper>
			<Avatar
				src={sender?.avatar}
				sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
				alt={sender?.userName}
			/>
		</Stack>
	)
}

export default ChatMessage
