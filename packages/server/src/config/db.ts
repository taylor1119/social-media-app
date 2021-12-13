import mongoose from 'mongoose';
import { MONGODB_URI } from './secrets';

export default async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Connected To DB ');
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	}
};
