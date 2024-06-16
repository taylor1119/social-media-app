import { Avatar, Paper, Stack, styled } from '@mui/material'
import './styles.css'

const ChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#e4e6eb',
	borderRadius: '16px',
}))

const TypingIndicator = ({ avatar }: { avatar?: string }) => (
	<Stack direction='row' spacing={1} alignSelf='flex-start'>
		<Avatar
			src={avatar}
			sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
		/>
		<ChatMsgPaper sx={{ px: '12px', py: '13px' }} elevation={0}>
			<div className='typing'>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</ChatMsgPaper>
	</Stack>
)

export default TypingIndicator
