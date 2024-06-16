import { atom } from 'recoil'
import { ITheme } from '../common/interfaces'
import { TUiUser } from '../common/types'
import { currentUserPersistEffect, themePersistEffect } from './effects'

export const themeState = atom<ITheme>({
	key: 'themeState',
	default: {
		mode: 'light',
		isUserPicked: false,
	},
	effects: [themePersistEffect],
})

export const currentUserState = atom<TUiUser | null>({
	key: 'currentUserState',
	default: null,
	effects: [currentUserPersistEffect],
})

export const leftSideBarOpenState = atom({
	key: 'leftSideBarOpenState',
	default: false,
})

export const friendDetailsOpenState = atom({
	key: 'friendDetailsOpenStateState',
	default: false,
})

export const webSocketState = atom<WebSocket | null>({
	key: 'webSocketState',
	default: null,
})

export const typingIndicatorMapState = atom<Map<string, boolean>>({
	key: 'typingIndicatorMapState',
	default: new Map(),
})

export const chatBoxesState = atom({
	key: 'chatBoxesState',
	default: {
		minimized: new Map<string, TUiUser>(),
		open: new Map<string, TUiUser>(),
	},
})

export const selectedFriendState = atom<TUiUser | null>({
	key: 'selectedFriendState',
	default: null,
})
