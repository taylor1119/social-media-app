import { Router } from 'express'
import { csrfProtection } from '../common/middlewares'
import friendRequestsRouter from '../DATA_SOURCES/FRIEND_REQUESTS/router'
import messagesRouter from '../DATA_SOURCES/MESSAGES/router'
import postsRouter from '../DATA_SOURCES/POST/router'
import postsCommentsRouter from '../DATA_SOURCES/POST_COMMENT/router'
import usersRouter from '../DATA_SOURCES/USER/router'

const router = Router()

router.use('/users', usersRouter)
router.use(csrfProtection)
router.use('/posts/comments', postsCommentsRouter)
router.use('/posts', postsRouter)
router.use('/friend-requests', friendRequestsRouter)
router.use('/messages', messagesRouter)

export default router
