import faker from 'faker';
import { connection, Document, Types } from 'mongoose';
import { TPostDB } from 'src/POST/types';
import db from '../config/db';
import PostModel from '../POST/model';
import UserModel from '../USER/model';
import { TUserDB } from '../USER/types';

const clearDb = async () => {
	const db = connection.db;
	const collections = await db.listCollections().toArray();
	collections
		.map((collection) => collection.name)
		.forEach(async (collectionName) => {
			db.dropCollection(collectionName);
		});
};

//gen users
const genUser = async (usersNumber: number) => {
	const createUsersPromises: Promise<
		Document<unknown, unknown, TUserDB> &
			TUserDB & {
				_id: Types.ObjectId;
			}
	>[] = [];
	for (let index = 0; index < usersNumber; index++) {
		const user: TUserDB = {
			username: 'user' + index, //faker.name.firstName(),
			password: 'password',
			isAdmin: faker.datatype.boolean(),
			profilePicture: faker.internet.avatar(),
			dislikedPosts: [],
			followers: [],
			followings: [],
			likedPosts: [],
		};

		createUsersPromises.push(UserModel.create(user));
	}

	return await Promise.all(createUsersPromises);
};

const genPosts = async (postsNumber: number, usersNumber: number) => {
	const createPostsPromises: Promise<Document<unknown, unknown, TUserDB>>[] =
		[];
	const usersDocs = await genUser(usersNumber);

	usersDocs.forEach((userDoc) => {
		for (let index = 0; index < postsNumber; index++) {
			const post: TPostDB = {
				author: userDoc.id,
				description: faker.commerce.productDescription(),
				img: faker.image.nature(),
				dislikes: [],
				likes: [],
			};

			createPostsPromises.push(PostModel.create(post));
		}
	});

	const followPromises = usersDocs.map((userDoc) => {
		const idx1 = faker.datatype.number(usersDocs.length - 1);
		const idx2 = faker.datatype.number(usersDocs.length - 1);
		const idx3 = faker.datatype.number(usersDocs.length - 1);

		userDoc.followings.push(
			usersDocs[idx1]._id.toString(),
			usersDocs[idx2]._id.toString(),
			usersDocs[idx3]._id.toString()
		);

		return userDoc.save();
	});

	return await Promise.all([...createPostsPromises, ...followPromises]);
};

const main = async () => {
	await db();
	await clearDb();
	await genPosts(15, 5);
	console.log('DONE !!');
	process.exit(0);
};

main();
