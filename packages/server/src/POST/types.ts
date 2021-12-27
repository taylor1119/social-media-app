import { IPost } from './interfaces';

export type TPostDB = Omit<IPost, '_id' | 'createdAt' | 'updatedAt'>;
export type TPostInput = Omit<TPostDB, 'likes' | 'dislikes' | 'author'>;
