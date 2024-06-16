import { Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'
import SettingsSideBar from '../Settings/SettingsSideBar'

const Settings = () => (
	<Stack justifyContent='center' sx={{ mt: '78px' }} direction='row'>
		<SettingsSideBar />
		<Outlet />
	</Stack>
)

export default Settings
