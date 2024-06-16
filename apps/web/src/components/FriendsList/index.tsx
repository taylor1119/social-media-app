import { Avatar, ListItemAvatar, ListItemButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import { TUiUser } from '../../common/types'
import useChatBox from '../../hooks/useChatBox'
import {
	useGetCurrentUserFriends,
	useGetOnlineUsersIds,
} from '../../hooks/usersHooks'
import ConditionalWrapper from '../ConditionalWrapper'
import OnlineBadgeWrapper from '../OnlineBadgeWrapper'

const FriendsListItem = ({
	user,
	isOnline,
}: {
	user: TUiUser
	isOnline: boolean
}) => {
	const { onOpen } = useChatBox(user)

	return (
		<ListItemButton onClick={onOpen}>
			<ListItemAvatar>
				<ConditionalWrapper
					condition={isOnline}
					wrapper={OnlineBadgeWrapper}
				>
					<Avatar src={user.avatar} alt={user.userName} />
				</ConditionalWrapper>
			</ListItemAvatar>
			<ListItemText primary={user.userName} />
		</ListItemButton>
	)
}

const FriendsList = () => {
	const { data: friends } = useGetCurrentUserFriends()
	const { data: onlineUsersIds } = useGetOnlineUsersIds()

	return (
		<Drawer
			variant='permanent'
			anchor='right'
			sx={{
				display: { xs: 'none', md: 'block' },
				width: 330,
				[`& .MuiDrawer-paper`]: {
					width: 330,
					border: 'none',
				},
			}}
		>
			<List sx={{ px: '8px', pt: '76px' }}>
				{friends?.map((friend) => (
					<FriendsListItem
						key={friend.id}
						isOnline={onlineUsersIds?.includes(friend.id) ?? false}
						user={friend}
					/>
				))}
			</List>
		</Drawer>
	)
}

export default FriendsList
