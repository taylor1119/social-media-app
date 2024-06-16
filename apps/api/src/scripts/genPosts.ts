import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { IPost, IPostComment } from 'shared'
import PostModel from '../DATA_SOURCES/POST/model'
import PostCommentModel from '../DATA_SOURCES/POST_COMMENT/model'
import { TUserDocument } from '../common/types'

const genPosts = async (usersDocs: TUserDocument[], postsNumber: number) => {
	console.log(chalk.yellow('Creating Posts...'))
	const postBodies: Omit<IPost, 'id'>[] = []
	usersDocs.forEach((author) => {
		for (let index = 0; index < postsNumber; index++) {
			postBodies.push({
				author: {
					id: author.id,
					avatar: author.avatar,
					userName: author.userName,
				},
				description: faker.lorem.paragraphs(
					faker.number.int({ min: 1, max: 9 })
				),
				img: faker.image.urlLoremFlickr({
					category: 'nature',
					width: 1280,
					height: 720,
				}),
				dislikes: [],
				likes: [],
				comments: [],
				createdAt: faker.date.between({ from: '2015', to: '2023' }),
				updatedAt: faker.date.between({ from: '2015', to: '2023' }),
			})
		}
	})

	console.log(chalk.yellow('Creating Comments...'))
	const savePromises: Promise<unknown>[] = []
	for (const postBody of postBodies) {
		const post = await PostModel.create(postBody)

		const commentBodies: Omit<IPostComment, 'id'>[] = []
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
				createdAt: faker.date.between({ from: '2015', to: '2023' }),
				updatedAt: faker.date.between({ from: '2015', to: '2023' }),
			})
		})

		const postComments = await PostCommentModel.create(commentBodies)
		post.comments = postComments.map((comment) => comment.id)
		savePromises.push(post.save())
	}

	await Promise.all(savePromises)
}

export default genPosts
