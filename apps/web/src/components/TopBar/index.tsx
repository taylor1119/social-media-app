import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import LeftSection from './LeftSection'
import MiddleSection from './MiddleSection'
import RightSection from './RightSection'

const TopBar = () => {
	return (
		<AppBar
			id='top-bar'
			position='fixed'
			color='inherit'
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Container maxWidth={false}>
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
					disableGutters
				>
					<LeftSection />
					<MiddleSection />
					<RightSection />
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default TopBar
