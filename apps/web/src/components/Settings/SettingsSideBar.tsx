import {
	Article as ArticleIcon,
	Person as PersonIcon,
} from '@mui/icons-material'
import { ListItemButton } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { leftSideBarOpenState } from '../../recoil/atoms'

const SettingsSideBar = () => {
	const [sideBarOpen, setSideBarOpen] = useRecoilState(leftSideBarOpenState)

	const handleDrawerToggle = () => {
		setSideBarOpen(!sideBarOpen)
	}

	const { pathname } = useLocation()

	const drawer = (
		<List sx={{ mx: '8px', mt: '76px' }}>
			<ListItemButton
				component={RouterLink}
				to='/setting/account'
				selected={pathname === '/setting/account'}
			>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText>Account</ListItemText>
			</ListItemButton>
			<ListItemButton
				component={RouterLink}
				to='/setting/intro'
				selected={pathname === '/setting/intro'}
			>
				<ListItemIcon>
					<ArticleIcon />
				</ListItemIcon>
				<ListItemText>Intro</ListItemText>
			</ListItemButton>
		</List>
	)

	return (
		<>
			<Drawer
				variant='temporary'
				open={sideBarOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', lg: 'none' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: 300,
					},
				}}
			>
				{drawer}
			</Drawer>

			<Drawer
				variant='permanent'
				sx={{
					display: { xs: 'none', lg: 'block' },
					width: 330,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: 330,
						boxSizing: 'border-box',
						borderRight: 'none',
					},
				}}
			>
				{drawer}
			</Drawer>
		</>
	)
}

export default SettingsSideBar
