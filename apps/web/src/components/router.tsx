import { Stack } from '@mui/material'
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PostsWithImageViewerSkeleton from './Posts/PostsWithImageViewerSkeleton'
import RequireAuth from './RequireAuth'

const Main = lazy(() => import('./Pages/Main'))
const LoginSignUp = lazy(() => import('./LoginSignUp'))
const Home = lazy(() => import('./Pages/Home'))
const Friends = lazy(() => import('./Pages/Friends'))
const Profile = lazy(() => import('./Pages/Profile'))
const Messenger = lazy(() => import('./Pages/Messenger'))
const Settings = lazy(() => import('./Pages/Settings'))
const IntroUpdateForm = lazy(() => import('./Settings/IntroUpdateForm'))
const UserUpdateForm = lazy(() => import('./Settings/UserUpdateForm'))
const PostsWithImageViewer = lazy(() => import('./Pages/PostsWithImageViewer'))

const PlaceHolderComp = ({ compName }: { compName: string }) => (
	<Stack justifyContent='center' alignItems='center' height='100vh'>
		<h1>{compName}</h1>
	</Stack>
)

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<RequireAuth>
				<Main />
			</RequireAuth>
		),
		children: [
			{ path: '/', element: <Home /> },
			{ path: '/posts/liked', element: <Home /> },
			{ path: 'friends', element: <Friends /> },
			{ path: 'profile/:userId', element: <Profile /> },
			{ path: '/messenger', element: <Messenger /> },
			{
				path: 'setting',
				element: <Settings />,
				children: [
					{ path: 'account', element: <UserUpdateForm /> },
					{ path: 'intro', element: <IntroUpdateForm /> },
				],
			},
		],
	},
	{
		path: '/posts/:type/:authorId',
		element: (
			<Suspense fallback={<PostsWithImageViewerSkeleton />}>
				<PostsWithImageViewer />
			</Suspense>
		),
	},
	{
		path: '/login',
		element: <LoginSignUp />,
	},

	{
		path: '*',
		element: <PlaceHolderComp compName='No Match' />,
	},
])

export default router
