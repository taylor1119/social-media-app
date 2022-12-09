import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

export const queryClient = new QueryClient({
	defaultOptions: { queries: { suspense: true, useErrorBoundary: false } },
});

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</QueryClientProvider>
		</RecoilRoot>
	</React.StrictMode>
);
