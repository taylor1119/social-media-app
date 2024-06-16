import MenuIcon from '@mui/icons-material/MenuRounded'
import { Stack } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { leftSideBarOpenState } from '../../recoil/atoms'
import UserSearch from './UserSearch'

const LeftSection = () => {
	const setLeftSideBarOpen = useSetRecoilState(leftSideBarOpenState)
	const handleOpenSideBar = () => setLeftSideBarOpen((prev) => !prev)

	return (
		<Stack direction='row' alignItems='center' spacing={1} width='300px'>
			<Link style={{ marginBottom: '-6.4px' }} to='/'>
				<img
					src='/logo.png'
					alt='Logo'
					style={{ width: '40px', height: '40px' }}
					crossOrigin='anonymous'
					loading='lazy'
				/>
			</Link>

			<UserSearch />

			<IconButton
				sx={{ display: { lg: 'none' } }}
				onClick={handleOpenSideBar}
			>
				<Avatar>
					<MenuIcon />
				</Avatar>
			</IconButton>
		</Stack>
	)
}

export default LeftSection
