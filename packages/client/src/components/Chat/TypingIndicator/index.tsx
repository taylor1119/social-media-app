import { Avatar, Paper, Stack, styled } from '@mui/material';
import './styles.css';

const ChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}));

const TypingIndicator = ({ avatar }: { avatar?: string }) => (
	<Stack direction='row' spacing={1} sx={{ mb: 4 }} alignSelf='flex-end'>
		<ChatMsgPaper sx={{ px: '30px', py: '15px' }} elevation={0}>
			<div className='snippet' data-title='.dot-typing'>
				<div className='stage'>
					<div className='dot-typing'></div>
				</div>
			</div>
		</ChatMsgPaper>
		<Avatar
			src={avatar}
			sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
		/>
	</Stack>
);

export default TypingIndicator;
