import { Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '../../recoil/atoms'
import LoginForm from './LoginForm'

const LoginSignUp = () => {
	const currentUser = useRecoilValue(currentUserState)

	if (currentUser) return <Navigate to='/' replace />

	return <LoginForm />
}

export default LoginSignUp
