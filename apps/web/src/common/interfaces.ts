import { PaletteMode } from '@mui/material'

export interface ITheme {
	mode: PaletteMode
	isUserPicked: boolean
}

export interface IntersectionObserverArgs {
	onIntersection: () => void
	enable: boolean
}
