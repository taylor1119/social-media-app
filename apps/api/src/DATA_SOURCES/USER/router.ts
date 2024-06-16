import { Router } from 'express'
import {
	authenticate,
	csrfLogin,
	csrfProtection,
	validateInput,
} from '../../common/middlewares'
import { dbDocIdsValidationSchema } from '../../common/validation'
import {
	deleteUser,
	getAccounts,
	getFriendsIds,
	getOnlineUsersIds,
	getUserById,
	getUsersByIds,
	login,
	logout,
	removeFriend,
	searchUsersByUserName,
	signup,
	updateUser,
} from './controllers'
import {
	loginValidationSchema,
	signupValidationSchema,
	updateUserValidationSchema,
} from './validation'

const router = Router()

router.get('/accounts', getAccounts)

router.post(
	'/signup',
	validateInput(signupValidationSchema, 'signupInput'),
	signup
)

router.post(
	'/login',
	validateInput(loginValidationSchema, 'loginInput'),
	csrfLogin,
	login
)

router.delete('/logout', authenticate, logout)

router.get('/online', authenticate, getOnlineUsersIds)

router.use(csrfProtection)

router.post(
	'/list',
	validateInput(dbDocIdsValidationSchema, 'dBDocIds'),
	getUsersByIds
)

router.put(
	'/update',
	authenticate,
	validateInput(updateUserValidationSchema, 'updateUserInput'),
	updateUser
)

router.delete('/delete', authenticate, deleteUser)

router.get('/friends/ids', authenticate, getFriendsIds)

router.get('/search/:username', authenticate, searchUsersByUserName)

router.put('/:friendId/unfriend', authenticate, removeFriend)

router.get('/:userId', getUserById)

router.put(
	'/:id',
	authenticate,
	validateInput(updateUserValidationSchema, 'updateUserInput'),
	updateUser
)

router.delete('/:id', authenticate, deleteUser)

export default router
