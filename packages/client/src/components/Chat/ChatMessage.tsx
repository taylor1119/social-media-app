import { Avatar, Paper, Stack, styled, Typography } from '@mui/material';
import { IChatMessage } from '@social-media-app/shared/src';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../..';
import { TUiUser } from '../../common/types';
import queryKeys from '../../constants/reactQueryKeys';
import { currentUserState } from '../../recoil/atoms';

const ChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#383838' : '#f0f2f5',
	borderRadius: '16px',
}));

const OwmChatMsgPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: '#0084ff',
	color: 'white',
	borderRadius: '16px',
}));

const getFriendFromQueryCache = (friendId: string, userId?: string) =>
	queryClient
		.getQueryData<TUiUser[]>(queryKeys.friends(userId))
		?.reduce((prev, curr) => {
			if (prev) return prev;
			if (curr.id === friendId) return curr;
			return prev;
		});

const ChatMessage = ({ chatMessage }: { chatMessage: IChatMessage }) => {
	const currentUser = useRecoilValue(currentUserState);
	const senderId = chatMessage.senderId;
	const isSenderCurrentUser = senderId === currentUser?.id;
	const sender = isSenderCurrentUser
		? currentUser
		: getFriendFromQueryCache(senderId, currentUser?.id);

	if (isSenderCurrentUser)
		return (
			<Stack direction='row' spacing={1}>
				<Avatar
					src={sender?.avatar}
					sx={{ alignSelf: 'flex-end', width: '28px', height: '28px' }}
					alt={sender?.userName}
				/>
				<ChatMsgPaper sx={{ px: '12px', py: '8px' }} elevation={0}>
					<Typography variant='body2'>{chatMessage.text}</Typography>
				</ChatMsgPaper>
			</Stack>
		);

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
	);
};

export default ChatMessage;
