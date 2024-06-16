import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Avatar, Badge, styled } from '@mui/material'
import { useState } from 'react'
import { TUiUser } from '../../common/types'
import useChatBox from '../../hooks/useChatBox'
import { useGetOnlineUsersIds } from '../../hooks/usersHooks'
import ConditionalWrapper from '../ConditionalWrapper'
import OnlineBadgeWrapper from '../OnlineBadgeWrapper'

const MinimizedAvatar = styled(Avatar)(({ theme }) => ({
	width: '20px',
	height: '20px',
	border: `2px solid ${theme.palette.background.paper}`,
	cursor: 'pointer',
}))

const MinimizedChatBox = ({ user }: { user: TUiUser }) => {
	const [isMouseOver, setIsMouseOver] = useState(false)
	const { onMaximize, onClose } = useChatBox(user)
	const { data: onlineUsersIds } = useGetOnlineUsersIds()
	const isOnline = onlineUsersIds?.includes(user.id) ?? false

	return (
		<Badge
			overlap='circular'
			color={isMouseOver ? 'default' : 'primary'}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			onMouseOver={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
			badgeContent={
				isMouseOver ? (
					<MinimizedAvatar onClick={onClose}>
						<CloseRoundedIcon sx={{ p: '5px' }} />
					</MinimizedAvatar>
				) : null
			}
		>
			<ConditionalWrapper
				condition={isOnline}
				wrapper={OnlineBadgeWrapper}
			>
				<Avatar
					src={user.avatar}
					sx={{ height: '48px', width: '48px', cursor: 'pointer' }}
					onClick={onMaximize}
					alt={user.userName}
				/>
			</ConditionalWrapper>
		</Badge>
	)
}

export default MinimizedChatBox
