import { PersonRemove as PersonRemoveIcon } from '@mui/icons-material'
import ChatIcon from '@mui/icons-material/Chat'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { TUiUser } from '../../common/types'
import {
	useAcceptFriendRequest,
	useGetReceivedFriendRequests,
	useGetSentFriendRequests,
	useSendFriendRequest,
} from '../../hooks/friendRequestsHooks'
import useChatBox from '../../hooks/useChatBox'
import {
	useGetCurrentUserFriendsIds,
	useGetUserById,
	useUnfriend,
} from '../../hooks/usersHooks'
import { currentUserState } from '../../recoil/atoms'

const StyledBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
}))

const AvatarBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	border: `4px solid ${theme.palette.background.paper}`,
}))

const coverStyle: React.CSSProperties = {
	width: '100%',
	overflow: 'hidden',
	display: 'flex',
	justifyContent: 'center',
	objectFit: 'cover',
	height: '350px',
	borderRadius: '0 0 8px 8px',
}

const CoverDiv = styled('div')(({ theme }) => ({
	...coverStyle,
	backgroundColor: theme.palette.background.default,
}))

const UpperSection = () => {
	const { userId } = useParams()
	const { data: user } = useGetUserById(userId)
	const currentUser = useRecoilValue(currentUserState)
	const isCurrentUser = user?.id === currentUser?.id

	if (!user) return <h1>User Not Found</h1>

	return (
		<StyledBox sx={{ width: '100%' }}>
			<Box
				sx={{
					px: { xs: 0, md: '20px' },
					pb: '20px',
					width: { xs: '100%', md: '980px' },
					mx: 'auto',
				}}
			>
				{user.cover ? (
					<img
						src={user.cover}
						alt='cover'
						style={coverStyle}
						crossOrigin='anonymous'
						loading='lazy'
					/>
				) : (
					<CoverDiv />
				)}
				<Stack
					direction={{ xs: 'column', md: 'row' }}
					justifyContent={{ xs: 'center', md: 'space-between' }}
				>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						alignItems={{ xs: 'center', md: 'flex-start' }}
					>
						<AvatarBox
							sx={{
								width: '150px',
								height: '150px',
								mt: '-40px',
								mx: '40px',
								borderRadius: '50%',
							}}
						>
							<Avatar
								alt={user?.userName}
								src={user?.avatar}
								sx={{
									width: '100%',
									height: '100%',
								}}
							/>
						</AvatarBox>

						<Typography
							sx={{
								mt: '20px',
								fontWeight: 'bold',
							}}
							variant='h4'
							color='#1976d2'
							gutterBottom
						>
							{user?.userName}
						</Typography>
					</Stack>
					{user && !isCurrentUser && (
						<UpperSectionActions user={user} />
					)}
				</Stack>
			</Box>
		</StyledBox>
	)
}

const UpperSectionActions = ({ user }: { user: TUiUser }) => {
	const { data: friendsIds } = useGetCurrentUserFriendsIds()
	const isFriend = Boolean(friendsIds?.includes(user.id))

	const sentFriendRequest = useGetSentFriendRequests().data?.find(
		(request) => request.recipient === user.id
	)

	const receivedFriendRequest = useGetReceivedFriendRequests().data?.find(
		(request) => request.requester === user.id
	)

	const useSendFriendRequestResults = useSendFriendRequest(user)
	const useAcceptFriendRequestResults = useAcceptFriendRequest(user)
	const useUnfriendResults = useUnfriend()

	const handleLeftButtonClick = () => {
		if (isFriend) return useUnfriendResults.mutate(user.id)
		else if (receivedFriendRequest)
			return useAcceptFriendRequestResults.mutate(
				receivedFriendRequest.id
			)
		else return useSendFriendRequestResults.mutate()
	}

	const LeftButtonDisabled =
		useUnfriendResults.isLoading ||
		useSendFriendRequestResults.isLoading ||
		useAcceptFriendRequestResults.isLoading ||
		Boolean(sentFriendRequest)

	const leftButtonText = () => {
		if (isFriend) return 'unfriend'
		else if (receivedFriendRequest) return 'Accept friend request'
		else if (sentFriendRequest) return 'Friend request sent'
		else return 'Send friend request'
	}

	const { onOpen } = useChatBox(user)

	return (
		<Stack
			alignSelf={{ xs: 'center', md: 'flex-end' }}
			direction={{ xs: 'column', sm: 'row' }}
			spacing={2}
		>
			<Button
				startIcon={isFriend ? <PersonRemoveIcon /> : <PersonAddIcon />}
				variant={isFriend ? 'outlined' : 'contained'}
				color={isFriend ? 'error' : 'primary'}
				onClick={handleLeftButtonClick}
				disabled={LeftButtonDisabled}
			>
				{leftButtonText()}
			</Button>
			<Button
				startIcon={<ChatIcon />}
				variant={isFriend ? 'contained' : 'outlined'}
				disabled={!isFriend}
				onClick={onOpen}
			>
				Message
			</Button>
		</Stack>
	)
}

export default UpperSection
