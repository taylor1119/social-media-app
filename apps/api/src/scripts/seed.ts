import { clearDB, connectDB, setMongoosePlugin } from '../config/db'
setMongoosePlugin()

import chalk from 'chalk'
import addFriendsAndGenMsgs from './addFriendsAndGenMsgs'
import genPosts from './genPosts'
import genUsers from './genUsers'

const main = async () => {
	await connectDB()
	await clearDB()
	const usersDocs = await genUsers(25)
	await addFriendsAndGenMsgs(usersDocs, 25)
	await genPosts(usersDocs, 10)
	console.log(chalk.green('DONE !!'))
	process.exit(0)
}

main()
