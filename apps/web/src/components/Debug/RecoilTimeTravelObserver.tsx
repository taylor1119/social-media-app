import { Avatar, Button, Modal, Paper, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { Snapshot, useGotoRecoilSnapshot, useRecoilSnapshot } from 'recoil'

function RecoilTimeTravelObserver() {
	const [snapshots, setSnapshots] = useState<Snapshot[]>([])
	const snapshot = useRecoilSnapshot()
	const gotoSnapshot = useGotoRecoilSnapshot()
	const release = snapshot.retain()

	useEffect(() => {
		if (snapshots.every((s) => s.getID() !== snapshot.getID())) {
			try {
				setSnapshots((prevSnapshots) => [...prevSnapshots, snapshot])
			} finally {
				release()
			}
		}
	}, [release, snapshot, snapshots])

	const handleGotoSnapshot = (snapshot: Snapshot) => () => {
		try {
			gotoSnapshot(snapshot)
		} finally {
			release()
		}
	}

	const [openSignUpForm, setOpenSignUpForm] = useState(false)
	const handleOpenSignUpForm = () => setOpenSignUpForm(true)
	const handleCloseSignUpForm = () => setOpenSignUpForm(false)

	return (
		<>
			<Tooltip title='Time Travel'>
				<Avatar
					sx={{
						position: 'fixed',
						cursor: 'pointer',
						right: 12,
						bottom: 12,
						zIndex: 9999,
						opacity: 0.5,
					}}
					src='https://recoiljs.org/img/favicon.png'
					onClick={handleOpenSignUpForm}
				/>
			</Tooltip>

			<Modal
				open={openSignUpForm}
				onClose={handleCloseSignUpForm}
				aria-labelledby='sign-up-form'
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Paper
					sx={{
						p: '15px',
						display: 'flex',
						flexDirection: 'column',
						overflowX: 'hidden',
						overflowY: 'auto',
						gap: '5px',
						height: '500px',
						width: '225px',
					}}
				>
					{snapshots.map((snapshot, idx) => (
						<Button
							key={idx}
							variant='contained'
							onClick={handleGotoSnapshot(snapshot)}
						>
							Snapshot {idx}
						</Button>
					))}
				</Paper>
			</Modal>
		</>
	)
}

export default RecoilTimeTravelObserver
