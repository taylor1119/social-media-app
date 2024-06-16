import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Stack,
	Tooltip,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { TUiUser } from '../../common/types'
import {
	useAcceptFriendRequest,
	useRejectFriendRequest,
	useSendFriendRequest,
} from '../../hooks/friendRequestsHooks'
import { useUnfriend } from '../../hooks/usersHooks'

interface IReceivedRequestCardProps {
	cardType: 'received-request'
	user: TUiUser
	requestId: string
}

interface ISentRequestCardProps {
	cardType: 'sent-request'
	user: TUiUser
}

interface ISendRequestProps {
	cardType: 'send-request'
	user: TUiUser
}

interface IFriendProps {
	cardType: 'friend'
	user: TUiUser
}

type TUserCardProps =
	| IReceivedRequestCardProps
	| ISentRequestCardProps
	| ISendRequestProps
	| IFriendProps

const UserCard = (props: TUserCardProps) => {
	const { user } = props

	const { mutate: sendFriendRequest } = useSendFriendRequest(props.user)
	const { mutate: rejectFriendRequest } = useRejectFriendRequest()
	const { mutate: acceptFriendRequest } = useAcceptFriendRequest(props.user)
	const { mutate: unfriend } = useUnfriend()

	return (
		<Card sx={{ width: 200 }}>
			<Link to={`/profile/${user.id}`}>
				<CardMedia
					crossOrigin='anonymous'
					loading='lazy'
					component='img'
					height='194'
					image={user.avatar}
					alt='user picture'
				/>
			</Link>

			<CardContent>
				<Tooltip
					title={user.userName}
					disableHoverListener={user.userName.length < 10}
				>
					<Typography
						gutterBottom
						variant='h5'
						component='div'
						noWrap
					>
						{user.userName}
					</Typography>
				</Tooltip>
			</CardContent>
			<CardActions sx={{ flexDirection: 'column' }}>
				{(() => {
					switch (props.cardType) {
						case 'friend':
							return (
								<Button
									variant='outlined'
									color='error'
									fullWidth
									onClick={() => unfriend(user.id)}
								>
									unfriend
								</Button>
							)
						case 'send-request':
							return (
								<Button
									variant='outlined'
									fullWidth
									onClick={() => sendFriendRequest()}
								>
									add friend
								</Button>
							)
						case 'sent-request':
							return (
								<Button
									disabled={true}
									variant='outlined'
									fullWidth
								>
									request sent
								</Button>
							)
						case 'received-request':
							return (
								<Stack sx={{ width: '100%' }} spacing={1}>
									<Button
										disabled={false}
										variant='contained'
										fullWidth
										onClick={() =>
											acceptFriendRequest(props.requestId)
										}
									>
										Accept Request
									</Button>
									<Button
										disabled={false}
										variant='contained'
										color='error'
										fullWidth
										onClick={() =>
											rejectFriendRequest(props.requestId)
										}
									>
										Reject Request
									</Button>
								</Stack>
							)
						default:
							return <h1>Error</h1>
					}
				})()}
			</CardActions>
		</Card>
	)
}

export default UserCard
