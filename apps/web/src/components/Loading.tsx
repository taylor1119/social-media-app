import { Box, CircularProgress } from '@mui/material'

const Loading = ({ mt }: { mt?: string }) => (
	<Box
		display='flex'
		justifyContent='center'
		alignItems='center'
		height={`calc(100vh - ${mt ?? '0px'})`}
	>
		<CircularProgress size='4rem' />
	</Box>
)

export default Loading
