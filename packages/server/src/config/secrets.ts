import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
	console.log('Using .env file to supply config environment variables');
	dotenv.config({ path: '.env' });
} else if (fs.existsSync('.env.example')) {
	console.log('Using .env.example file to supply config environment variables');
	dotenv.config({ path: '.env.example' });
} else {
	console.error('No ENV file was provided');
	process.exit(1);
}

export const IS_PROD = process.env.NODE_ENV === 'production';
export const MONGODB_URI = process.env['MONGODB_URI'] ?? '';
export const PORT = process.env['PORT'] ?? '';
export const JWT_SECRET = process.env['JWT_SECRET'] ?? '';
export const COOKIE_SECRET = process.env['COOKIE_SECRET'] ?? '';

if (!MONGODB_URI) {
	console.error(
		'No mongodb connection string. Set MONGODB_URI environment variable.'
	);
	process.exit(1);
}
if (!PORT) {
	console.error('No server port. Set SERVER_PORT environment variable.');
	process.exit(1);
}
if (!JWT_SECRET) {
	console.error('No jwt secret. Set JWT_SECRET environment variable.');
	process.exit(1);
}
if (!COOKIE_SECRET) {
	console.error(
		'No cookie secret secret. Set COOKIE_SECRET environment variable.'
	);
	process.exit(1);
}
