import FavoriteIcon from '@mui/icons-material/FavoriteRounded'
import HomeIcon from '@mui/icons-material/HomeRounded'
import PeopleIcon from '@mui/icons-material/PeopleRounded'
import { Badge, IconButton, Stack } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useGetReceivedFriendRequests } from '../../hooks/friendRequestsHooks'

const MiddleSection = () => {
	const { pathname } = useLocation()
	const { data: friendRequests } = useGetReceivedFriendRequests()
	return (
		<Stack
			sx={{
				flexGrow: 1,
				display: { xs: 'none', md: 'flex' },
			}}
			justifyContent='center'
			spacing={4}
			direction='row'
		>
			<IconButton
				component={Link}
				to='/'
				color={pathname === '/' ? 'primary' : 'default'}
			>
				<HomeIcon />
			</IconButton>

			<IconButton
				component={Link}
				to='/posts/liked'
				color={pathname === '/posts/liked' ? 'primary' : 'default'}
			>
				<FavoriteIcon />
			</IconButton>

			<Badge
				color='primary'
				overlap='circular'
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				badgeContent={friendRequests?.length}
			>
				<IconButton
					component={Link}
					to='/friends'
					color={pathname === '/friends' ? 'primary' : 'default'}
				>
					<PeopleIcon />
				</IconButton>
			</Badge>
		</Stack>
	)
}
export default MiddleSection
