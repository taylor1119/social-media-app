export interface IUserBase {
	_id: string;
	username: string;
	password: string;
	profilePicture: string;
	followers: string[];
	followings: string[];
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}
