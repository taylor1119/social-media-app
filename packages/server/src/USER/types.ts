import { IUserBase } from './interfaces';

export type TUserDB = Omit<IUserBase, '_id' | 'createdAt' | 'updatedAt'>;
export type TUpdateUser = Omit<
	IUserBase,
	'_id' | 'createdAt' | 'updatedAt' | 'isAdmin'
>;
export type TJwtUser = Omit<IUserBase & { iat: string }, 'password'>;
export type TCurrentUser = Omit<IUserBase, 'password'>;
export type TLoginInput = Pick<IUserBase, 'password' | 'username'>;
export type TSignUpInput = Pick<
	IUserBase,
	'password' | 'username' | 'profilePicture'
>;
