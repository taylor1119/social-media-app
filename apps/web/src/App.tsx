import {
	createTheme,
	CssBaseline,
	PaletteMode,
	Theme,
	ThemeProvider,
	useMediaQuery,
} from '@mui/material'
import { Suspense, useEffect, useMemo } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RouterProvider } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import RecoilDebugButton from './components/Debug/RecoilDebugButton'
import Loading from './components/Loading'
import router from './components/router'
import { useWebSocketInit } from './hooks/useWebSocketInit'
import { themeState } from './recoil/atoms'

const IS_DEV = import.meta.env.MODE === 'development'

const getTheme = (mode: PaletteMode): Theme =>
	createTheme({
		palette: {
			mode,
			background: {
				default: mode === 'light' ? '#F0F2F5' : '#18191A',
			},
		},
		components: {
			MuiListItemButton: {
				styleOverrides: {
					root: {
						borderRadius: '8px',
						':hover': {
							borderRadius: '8px',
						},
					},
				},
			},
			MuiAvatar: {
				defaultProps: {
					imgProps: { crossOrigin: 'anonymous', loading: 'lazy' },
				},
			},
		},
	})

function App() {
	const [theme, setTheme] = useRecoilState(themeState)

	const prefThemeMode = useMediaQuery('(prefers-color-scheme: dark)')
		? 'dark'
		: 'light'

	const muiTheme = useMemo(
		() => getTheme(theme.isUserPicked ? theme.mode : prefThemeMode),
		[prefThemeMode, theme]
	)

	useEffect(() => {
		if (theme.isUserPicked) return

		setTheme({
			isUserPicked: false,
			mode: prefThemeMode,
		})
	}, [prefThemeMode, setTheme, theme.isUserPicked])

	useWebSocketInit()

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline />
			<Suspense fallback={<Loading />}>
				<RouterProvider router={router} />
			</Suspense>
			{IS_DEV && (
				<>
					<ReactQueryDevtools initialIsOpen={false} />
					{/* <RecoilTimeTravelObserver /> */}
					<RecoilDebugButton />
				</>
			)}
		</ThemeProvider>
	)
}

export default App
