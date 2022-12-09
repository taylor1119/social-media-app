const getEnvVar = (varName: string) => {
	const varValue = process.env[varName];
	if (!varValue) throw new Error('missing env var');
	return varValue;
};

export const API_ORIGIN = getEnvVar('REACT_APP_API_ORIGIN');

export const WS_ORIGIN = getEnvVar('REACT_APP_WS_ORIGIN');

export const STATIC_ORIGIN = getEnvVar('REACT_APP_STATIC_ORIGIN');

export const POSTS_PAGE_SIZE = 5;
