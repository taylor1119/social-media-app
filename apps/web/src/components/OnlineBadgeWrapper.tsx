import { Badge, styled } from '@mui/material'

const OnlineBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		width: '0.75rem',
		height: '0.75rem',
		borderRadius: '50%',
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: 'ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.0)',
			opacity: 0,
		},
	},
}))

const OnlineBadgeWrapper = ({ children }: { children?: React.ReactNode }) => (
	<OnlineBadge
		overlap='circular'
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		variant='dot'
	>
		{children}
	</OnlineBadge>
)

export default OnlineBadgeWrapper
