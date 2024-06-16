import {
	Avatar,
	Divider,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Modal,
	Paper,
	Typography,
} from '@mui/material'
import { UseMutateFunction, useQuery } from 'react-query'
import { TLoginInput, TMockAccount } from 'shared'
import { getAccountsQuery } from '../../queries/users'
import Loading from '../Loading'

interface IMockAccountsListProps {
	openMockAccountsList: boolean
	handleCloseOpenMockAccountsList: () => void
	mutate: UseMutateFunction<unknown, unknown, TLoginInput>
}

const MockAccountsList = ({
	handleCloseOpenMockAccountsList,
	openMockAccountsList,
	mutate,
}: IMockAccountsListProps) => {
	const { data: accounts, isLoading } = useQuery(
		'accounts',
		getAccountsQuery,
		{
			suspense: false,
		}
	)
	const handleSelectAccount =
		({ email }: TMockAccount) =>
		() => {
			mutate({ email, password: 'password' })
			handleCloseOpenMockAccountsList()
		}

	return (
		<Modal
			open={openMockAccountsList}
			onClose={handleCloseOpenMockAccountsList}
			aria-labelledby='sign-up-form'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Paper
				sx={{
					width: '450px',
					p: '20px',
					display: 'flex',
					flexDirection: 'column',
					height: '80vh',
				}}
			>
				<Typography variant='h4' fontWeight={600} textAlign='center'>
					Mock Accounts List
				</Typography>
				<Divider sx={{ my: '1rem', mx: '-20px' }} />
				{isLoading ? (
					<Loading />
				) : (
					<List sx={{ overflow: 'auto', mr: '-20px' }}>
						{accounts?.map((account) => (
							<ListItemButton
								key={account.id}
								onClick={handleSelectAccount(account)}
							>
								<ListItemAvatar>
									<Avatar
										src={account.avatar}
										alt={account.userName}
									/>
								</ListItemAvatar>
								<ListItemText
									primary={account.userName}
									secondary={account.email}
								/>
							</ListItemButton>
						))}
					</List>
				)}
			</Paper>
		</Modal>
	)
}

export default MockAccountsList
