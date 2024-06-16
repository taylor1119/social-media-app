import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { IUser } from 'shared'
import UsersModel from '../DATA_SOURCES/USER/model'

const genUsers = async (usersNumber: number) => {
	console.log(chalk.yellow('Creating Users...'))
	const users: Omit<IUser, 'id'>[] = []
	for (let idx = 0; idx < usersNumber; idx++) {
		users.push({
			email: faker.internet.email(),
			password: 'password',
			userName: faker.internet.userName(),
			avatar: faker.image.avatarGitHub(),
			cover: faker.image.urlLoremFlickr({
				category: 'abstract',
				width: 1280,
				height: 720,
			}),
			friends: [],
			dislikedPosts: [],
			likedPosts: [],
			createdAt: faker.date.between({ from: '2015', to: '2023' }),
			updatedAt: faker.date.between({ from: '2015', to: '2023' }),
			intro: {
				address: faker.location.streetAddress(),
				bio: faker.lorem.paragraph(),
				from: faker.location.city(),
				relationshipStatus: 'Single',
				studiedAt: faker.company.name(),
				studiesAt: faker.company.name(),
				work: faker.company.name(),
			},
		})
	}

	return await UsersModel.create(users)
}

export default genUsers
