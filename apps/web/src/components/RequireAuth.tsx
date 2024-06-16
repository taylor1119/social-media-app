import { Navigate, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '../recoil/atoms'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
	const location = useLocation()
	const currentUser = useRecoilValue(currentUserState)

	if (!currentUser)
		return <Navigate to='/login' state={{ from: location }} replace />

	return children
}

export default RequireAuth
