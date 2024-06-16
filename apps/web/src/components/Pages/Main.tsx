import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Loading from '../Loading'
import TopBar from '../TopBar'

const Chat = lazy(() => import('../Chat'))

const Main = () => (
	<>
		<TopBar />
		<Suspense fallback={<Loading mt='64px' />}>
			<Outlet />
		</Suspense>
		<Chat />
	</>
)

export default Main
