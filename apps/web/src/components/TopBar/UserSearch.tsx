import { ArrowBack } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import {
	Avatar,
	IconButton,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Stack,
} from '@mui/material'
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import InputBase from '@mui/material/InputBase'
import Popper from '@mui/material/Popper'
import { alpha, styled } from '@mui/material/styles'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchUsersByUserName } from '../../hooks/usersHooks'

interface PopperComponentProps {
	anchorEl?: unknown
	disablePortal?: boolean
	open: boolean
}

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
	[`& .${autocompleteClasses.paper}`]: {
		textAlign: 'center',
		boxShadow: 'none',
		marginLeft: '-16px',
		marginRight: '-16px',
		background: theme.palette.mode === 'light' ? '#fff' : '#272727',

		[`& .${autocompleteClasses.listbox}`]: {
			backgroundColor:
				theme.palette.mode === 'light' ? '#fff' : '#272727',
		},
	},
}))

const PopperComponent = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	disablePortal,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	anchorEl,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	open,
	...other
}: PopperComponentProps) => <StyledAutocompletePopper {...other} />

const StyledPopper = styled(Popper)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
	boxShadow: theme.shadows[2],
	borderRadius: 6,
	width: '345px',
	zIndex: theme.zIndex.modal,
	backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#272727',
}))

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: '50px',
	width: '250px',
	backgroundColor: alpha(theme.palette.action.active, 0.1),
	'&:hover': {
		backgroundColor: alpha(theme.palette.action.active, 0.15),
	},
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
	},
}))

const UserSearch = () => {
	const [open, setOpen] = useState(false)

	const handleClose = () => setOpen(false)
	const handleClick = () => setOpen((prev) => !prev)

	const id = open ? 'search-users' : undefined

	const [searchTerm, setSearchTerm] = useState('')
	const [delayedSearchTerm, setDelayedSearchTerm] = useState(searchTerm)

	const debounceSearch = debounce(
		() => setDelayedSearchTerm(searchTerm),
		1000,
		{ leading: false, trailing: true }
	)

	useEffect(() => {
		debounceSearch()
		return () => debounceSearch.cancel()
	}, [debounceSearch, searchTerm])

	const { data: searchResults, isLoading } =
		useSearchUsersByUserName(delayedSearchTerm)

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
		setSearchTerm(e.target.value)

	return (
		<>
			<Search sx={{ display: { xs: 'none', lg: 'inline' } }}>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					aria-describedby={id}
					value=''
					onClick={handleClick}
					placeholder='Search…'
				/>
			</Search>

			<IconButton
				aria-describedby={id}
				onClick={handleClick}
				sx={{ display: { lg: 'none' }, p: 0 }}
			>
				<Avatar>
					<SearchIcon />
				</Avatar>
			</IconButton>

			<StyledPopper id={id} open={open} placement='top-start'>
				<ClickAwayListener onClickAway={handleClose}>
					<Autocomplete
						open
						loading={isLoading}
						onClose={(event, reason) => {
							if (reason === 'escape') {
								handleClose()
							}
						}}
						PopperComponent={PopperComponent}
						noOptionsText='No recent searches'
						options={searchResults ?? []}
						getOptionLabel={(user) => user.userName}
						filterOptions={(users) => users}
						renderInput={(params) => (
							<Stack
								sx={{
									height: '64px',
									backgroundColor: 'transparent',
								}}
								direction='row'
								alignItems='center'
								ref={params.InputProps.ref}
								spacing={1}
							>
								<IconButton onClick={handleClose}>
									<ArrowBack />
								</IconButton>
								<Search>
									<SearchIconWrapper>
										<SearchIcon />
									</SearchIconWrapper>
									<StyledInputBase
										autoFocus
										placeholder='Search…'
										inputProps={{ ...params.inputProps }}
										value={searchTerm}
										onChange={onChange}
									/>
								</Search>
							</Stack>
						)}
						renderOption={(params, user) => (
							<ListItemButton
								key={user.id}
								component={Link}
								to={`/profile/${user.id}`}
								onClick={() => setSearchTerm('')}
							>
								<ListItemAvatar>
									<Avatar
										src={user.avatar}
										alt={user.userName}
									/>
								</ListItemAvatar>
								<ListItemText primary={user.userName} />
							</ListItemButton>
						)}
					/>
				</ClickAwayListener>
			</StyledPopper>
		</>
	)
}

export default UserSearch
