import { ArrowUpward } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useEffect, useState } from 'react'
const JumpToTopButton = () => {
	const [showButton, setShowButton] = useState(false)

	const scrollToTop = () =>
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})

	useEffect(() => {
		window.addEventListener('scroll', () =>
			window.pageYOffset > 1080 * 2
				? setShowButton(true)
				: setShowButton(false)
		)
	}, [])

	return (
		<IconButton
			sx={{
				display: showButton ? 'initial' : 'none',
				position: 'fixed',
				cursor: 'pointer',
				right: 12,
				bottom: 12,
				zIndex: 9999,
			}}
			onClick={scrollToTop}
		>
			<Avatar sx={{ bgcolor: blue[500] }}>
				<ArrowUpward />
			</Avatar>
		</IconButton>
	)
}

export default JumpToTopButton
