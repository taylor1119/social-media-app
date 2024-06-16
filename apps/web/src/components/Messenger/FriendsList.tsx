import {
	Avatar,
	Drawer,
	List,
	ListItemAvatar,
	ListItemButton,
} from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import { useSetRecoilState } from 'recoil'
import { TUiUser } from '../../common/types'
import {
	useGetCurrentUserFriends,
	useGetOnlineUsersIds,
} from '../../hooks/usersHooks'
import { selectedFriendState } from '../../recoil/atoms'
import ConditionalWrapper from '../ConditionalWrapper'
import OnlineBadgeWrapper from '../OnlineBadgeWrapper'

const FriendsListItem = ({
	friend,
	isOnline,
}: {
	friend: TUiUser
	isOnline: boolean
}) => {
	const setSelectedFriend = useSetRecoilState(selectedFriendState)
	const handleSelectFriend = () => setSelectedFriend(friend)

	return (
		<ListItemButton onClick={handleSelectFriend}>
			<ListItemAvatar>
				<ConditionalWrapper
					condition={isOnline}
					wrapper={OnlineBadgeWrapper}
				>
					<Avatar
						src={friend.avatar}
						alt={friend.userName}
						sx={{ width: '55px', height: '55px' }}
					/>
				</ConditionalWrapper>
			</ListItemAvatar>
			<ListItemText
				sx={{ display: { xs: 'none', md: 'inherit' }, px: '12px' }}
				primary={friend.userName}
			/>
		</ListItemButton>
	)
}

const FriendsList = () => {
	const { data: friends } = useGetCurrentUserFriends()
	const { data: onlineUsersIds } = useGetOnlineUsersIds()

	return (
		<Drawer
			sx={{
				width: { xs: '103px', md: '360px' },
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: { xs: '103px', md: '360px' },
					boxSizing: 'border-box',
					pt: { xs: '56px', sm: '64px' },
				},

				zIndex: 0,
			}}
			variant='permanent'
			anchor='left'
		>
			<List
				sx={{
					px: '8px',
					pt: '8px',
					'& .MuiButtonBase-root': {
						borderRadius: '8px',
						':hover': {
							borderRadius: '8px',
						},
					},
				}}
			>
				{friends?.map((friend) => (
					<FriendsListItem
						key={friend.id}
						isOnline={onlineUsersIds?.indexOf(friend.id) !== -1}
						friend={friend}
					/>
				))}
			</List>
		</Drawer>
	)
}

export default FriendsList
