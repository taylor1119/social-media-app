import {
	AllOut as AllOutIcon,
	Settings as SettingsIcon,
} from '@mui/icons-material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightModeRounded'
import LogoutIcon from '@mui/icons-material/LogoutRounded'
import MessageIcon from '@mui/icons-material/MessageRounded'
import {
	Box,
	Button,
	ClickAwayListener,
	Divider,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Popper,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import React, { Suspense } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TUiUser } from '../../common/types'
import useChatBox from '../../hooks/useChatBox'
import useGetConversation from '../../hooks/useGetConversation'
import { useGetCurrentUserFriends, useLogout } from '../../hooks/usersHooks'
import { currentUserState, themeState } from '../../recoil/atoms'

const RightSection = () => {
	const [settingsAnchorEl, setSettingsAnchorElUser] =
		React.useState<null | HTMLElement>(null)

	const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
		setSettingsAnchorElUser(event.currentTarget)
	}

	const handleCloseSettingsMenu = () => {
		setSettingsAnchorElUser(null)
	}

	const [messengerAnchorEl, setMessengerAnchorElUser] =
		React.useState<null | HTMLElement>(null)

	const handleOpenMessengerMenu = (event: React.MouseEvent<HTMLElement>) => {
		setMessengerAnchorElUser(event.currentTarget)
	}

	const handleCloseMessengerMenu = () => {
		setMessengerAnchorElUser(null)
	}

	const [theme, setTheme] = useRecoilState(themeState)
	const handleToggleTheme = () => {
		setTheme((currVal) => ({
			isUserPicked: true,
			mode: currVal.mode === 'dark' ? 'light' : 'dark',
		}))
	}

	const currentUser = useRecoilValue(currentUserState)

	const logout = useLogout()
	const handleLogout = () => logout()
	const navigate = useNavigate()

	const { data: friends } = useGetCurrentUserFriends()

	return (
		<Stack
			direction='row'
			spacing={1}
			width='300px'
			justifyContent='flex-end'
			alignItems='center'
		>
			<Button
				component={RouterLink}
				to={'/profile/' + currentUser?.id}
				sx={{
					borderRadius: '24px',
					display: { xs: 'none', md: 'inline-flex' },
					textTransform: 'none',
				}}
				variant='text'
				startIcon={
					<Avatar
						alt={currentUser?.userName}
						src={currentUser?.avatar}
					/>
				}
			>
				{currentUser?.userName}
			</Button>

			<IconButton
				sx={{ p: 0, display: { xs: 'none', md: 'initial' } }}
				onClick={handleOpenMessengerMenu}
			>
				<Avatar>
					<MessageIcon />
				</Avatar>
			</IconButton>

			<IconButton
				sx={{ p: 0, display: { xs: 'initial', md: 'none' } }}
				onClick={() => navigate('/messenger')}
			>
				<Avatar>
					<MessageIcon />
				</Avatar>
			</IconButton>

			<Tooltip title='Open settings'>
				<IconButton onClick={handleOpenSettingsMenu} sx={{ p: 0 }}>
					<Avatar>
						<ArrowDropDownIcon />
					</Avatar>
				</IconButton>
			</Tooltip>

			<Menu
				sx={{ mt: '50px' }}
				id='menu-appBar'
				anchorEl={settingsAnchorEl}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(settingsAnchorEl)}
				onClose={handleCloseSettingsMenu}
			>
				<MenuItem
					component={RouterLink}
					to='/setting/account'
					onClick={handleCloseSettingsMenu}
				>
					<ListItemIcon>
						<SettingsIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Settings</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleToggleTheme}>
					<ListItemIcon>
						{theme.mode === 'light' ? (
							<DarkModeIcon fontSize='small' />
						) : (
							<LightModeIcon fontSize='small' />
						)}
					</ListItemIcon>
					<ListItemText>
						{theme.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
					</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Log Out</ListItemText>
				</MenuItem>
			</Menu>

			<Popper
				id='chat-popper'
				anchorEl={messengerAnchorEl}
				open={Boolean(messengerAnchorEl)}
				placement='bottom'
				sx={{ zIndex: 1201 }}
			>
				<ClickAwayListener onClickAway={handleCloseMessengerMenu}>
					<Paper
						elevation={1}
						sx={{
							width: '350px',
							height: '80vh',
							borderRadius: '5px',
							display: 'flex',
							flexDirection: 'column',
							p: '12px',
							pr: 0,
							mt: '18px',
							mr: '12px',
						}}
					>
						<Box overflow='auto'>
							<Stack
								direction='row'
								justifyContent='space-between'
								alignItems='center'
							>
								<Typography
									variant='h5'
									sx={{ fontWeight: 700 }}
								>
									Chats
								</Typography>
								<IconButton
									onClick={handleCloseMessengerMenu}
									component={RouterLink}
									to='/messenger'
									sx={{ height: 26, width: 26 }}
								>
									<AllOutIcon />
								</IconButton>
							</Stack>

							<List>
								{friends?.map((friend) => (
									<Suspense
										key={friend.id}
										fallback={<ChatsListItemSkeleton />}
									>
										<ChatsListItem friend={friend} />
									</Suspense>
								))}
							</List>
						</Box>
						<Divider />
						<Button
							onClick={handleCloseMessengerMenu}
							component={RouterLink}
							to='/messenger'
							sx={{ textTransform: 'none', mt: '8px' }}
						>
							See All in Messenger
						</Button>
					</Paper>
				</ClickAwayListener>
			</Popper>
		</Stack>
	)
}

const ChatsListItemSkeleton = () => (
	<ListItemButton>
		<ListItemAvatar>
			<Skeleton variant='circular' width={40} height={40} />
		</ListItemAvatar>
		<ListItemText
			primary={<Skeleton variant='text' height={24} width={180} />}
			secondary={<Skeleton variant='text' height={24} width={220} />}
		/>
	</ListItemButton>
)

const ChatsListItem = ({ friend }: { friend: TUiUser }) => {
	const { data: conversation } = useGetConversation(friend.id)
	const { onOpen } = useChatBox(friend)
	const lastMessage = conversation
		? conversation[conversation.length - 1]
		: undefined

	return (
		<ListItemButton onClick={onOpen}>
			<ListItemAvatar>
				<Avatar src={friend.avatar} alt={friend.userName} />
			</ListItemAvatar>
			<ListItemText
				primary={friend.userName}
				secondary={lastMessage?.text}
			/>
		</ListItemButton>
	)
}

export default RightSection
