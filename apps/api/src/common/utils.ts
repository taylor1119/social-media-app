import chalk from 'chalk'
import { MongoServerError } from 'mongodb'

export const logError = (message: string) => console.error(chalk.red(message))

export const isUniqueInArray = (
	element: unknown,
	index: number,
	array: unknown[]
) => {
	return array.indexOf(element) === index
}

export const isMongoServerError = (error: Error): error is MongoServerError =>
	error.name === 'MongoServerError'
