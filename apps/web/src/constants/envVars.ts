const getEnvVar = (varName: string) => {
	const varValue = import.meta.env[varName]
	if (!varValue) throw new Error('missing env var')
	return varValue
}

export const API_ORIGIN = getEnvVar('VITE_API_ORIGIN')

export const WS_ORIGIN = getEnvVar('VITE_WS_ORIGIN')

export const STATIC_ORIGIN = getEnvVar('VITE_STATIC_ORIGIN')

export const POSTS_PAGE_SIZE = 5
