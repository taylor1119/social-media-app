import { AtomEffect } from 'recoil'
import { ITheme } from '../common/interfaces'
import { TUiUser } from '../common/types'
import { axiosInstance } from '../services/axios'

export const themePersistEffect: AtomEffect<ITheme> = ({ setSelf, onSet }) => {
	const savedValue = localStorage.getItem('themeState')
	if (savedValue != null) {
		setSelf(JSON.parse(savedValue))
	}

	onSet((newValue, _, isReset) => {
		isReset
			? localStorage.removeItem('themeState')
			: localStorage.setItem('themeState', JSON.stringify(newValue))
	})
}

export const currentUserPersistEffect: AtomEffect<TUiUser | null> = ({
	setSelf,
	onSet,
}) => {
	const savedValue = localStorage.getItem('currentUserState')
	if (savedValue != null) {
		setSelf(JSON.parse(savedValue))
		axiosInstance.defaults.headers.common['csrf-token'] =
			JSON.parse(savedValue).csrfToken
	}

	onSet((newValue, _, isReset) => {
		isReset
			? localStorage.removeItem('currentUserState')
			: localStorage.setItem('currentUserState', JSON.stringify(newValue))
	})
}
