import {
	Drawer,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Skeleton,
} from '@mui/material'

const FriendsListSkeleton = () => (
	<Drawer
		variant='permanent'
		anchor='right'
		sx={{
			display: { xs: 'none', md: 'block' },
			width: 330,
			[`& .MuiDrawer-paper`]: {
				width: 330,
				border: 'none',
			},
		}}
	>
		<List
			sx={{
				mt: '76px',
				'& .MuiButtonBase-root': {
					borderRadius: '8px',
					':hover': {
						borderRadius: '8px',
					},
				},
			}}
		>
			{[...Array(15)].map((_, idx) => (
				<ListItem key={idx} button>
					<ListItemAvatar>
						<Skeleton variant='circular' width={40} height={40} />
					</ListItemAvatar>

					<ListItemText>
						<Skeleton
							variant='text'
							height={40}
							width={180}
							sx={{ display: { xs: 'none', md: 'inherit' } }}
						/>
					</ListItemText>
				</ListItem>
			))}
		</List>
	</Drawer>
)

export default FriendsListSkeleton
