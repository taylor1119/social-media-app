import { Document, Types } from 'mongoose'
import { IUser } from 'shared'

export type TUserDocument = Document<unknown, unknown, IUser> &
	IUser & {
		_id: Types.ObjectId
	}
