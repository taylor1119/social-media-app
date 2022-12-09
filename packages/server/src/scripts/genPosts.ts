import { faker } from '@faker-js/faker';
import { IPost, IPostComment } from '@social-media-app/shared';
import chalk from 'chalk';
import { TUserDocument } from '../common/types';
import PostModel from '../DATA_SOURCES/POST/model';
import PostCommentModel from '../DATA_SOURCES/POST_COMMENT/model';

const genPosts = async (usersDocs: TUserDocument[], postsNumber: number) => {
	console.log(chalk.yellow('Creating Posts...'));
	const postBodies: Omit<IPost, 'id'>[] = [];
	usersDocs.forEach((author) => {
		for (let index = 0; index < postsNumber; index++) {
			postBodies.push({
				author: {
					id: author.id,
					avatar: author.avatar,
					userName: author.userName,
				},
				description: faker.lorem.paragraphs(
					faker.datatype.number({ min: 1, max: 9 })
				),
				img: faker.image.business(640, 480, true),
				dislikes: [],
				likes: [],
				comments: [],
				createdAt: faker.date.between('2015', '2022'),
				updatedAt: faker.date.between('2015', '2022'),
			});
		}
	});

	console.log(chalk.yellow('Creating Comments...'));
	const savePromises: Promise<unknown>[] = [];
	for (const postBody of postBodies) {
		const post = await PostModel.create(postBody);

		const commentBodies: Omit<IPostComment, 'id'>[] = [];
		usersDocs.forEach((author) => {
			commentBodies.push({
				postId: post.id,
				author: {
					id: author.id,
					userName: author.userName,
					avatar: author.avatar,
				},
				dislikes: [],
				likes: [],
				text: faker.lorem.sentence(),
				createdAt: faker.date.between('2015', '2022'),
				updatedAt: faker.date.between('2015', '2022'),
			});
		});

		const postComments = await PostCommentModel.create(commentBodies);
		post.comments = postComments.map((comment) => comment.id);
		savePromises.push(post.save());
	}

	await Promise.all(savePromises);
};

export default genPosts;
