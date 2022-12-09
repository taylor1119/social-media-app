import { faker } from '@faker-js/faker';
import { IUser } from '@social-media-app/shared';
import chalk from 'chalk';
import UsersModel from '../DATA_SOURCES/USER/model';

const getMail = (idx: number) => {
	if (idx === 0) return 'test1@gmail.com';
	else if (idx === 1) return 'test2@gmail.com';
	return faker.internet.email();
};

const genUsers = async (usersNumber: number) => {
	console.log(chalk.yellow('Creating Users...'));
	const users: Omit<IUser, 'id'>[] = [];
	for (let idx = 0; idx < usersNumber; idx++) {
		users.push({
			email: getMail(idx),
			password: 'password',
			userName: faker.internet.userName(),
			avatar: faker.internet.avatar(),
			cover: faker.image.business(640, 480, true),
			friends: [],
			dislikedPosts: [],
			likedPosts: [],
			createdAt: faker.date.between('2015', '2022'),
			updatedAt: faker.date.between('2015', '2022'),
			intro: {
				address: faker.address.city(),
				bio: faker.lorem.paragraph(),
				from: faker.address.city(),
				relationshipStatus: 'Single',
				studiedAt: faker.company.name(),
				studiesAt: faker.company.name(),
				work: faker.company.name(),
			},
		});
	}

	return await UsersModel.create(users);
};

export default genUsers;
