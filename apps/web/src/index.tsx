import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

export const queryClient = new QueryClient({
	defaultOptions: { queries: { suspense: true, useErrorBoundary: false } },
})

export default function MainApp() {
	return (
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</QueryClientProvider>
		</RecoilRoot>
	)
}
