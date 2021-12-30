import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import React from 'react';
import TopBar from './components/TopBar';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

function App() {
	return (
		<ThemeProvider theme={darkTheme}>
			<div className='App'>
				<TopBar />
			</div>
		</ThemeProvider>
	);
}

export default App;
