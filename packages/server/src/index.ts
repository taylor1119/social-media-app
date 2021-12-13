import db from './config/db';
import { IS_PROD, PORT } from './config/secrets';
import app from './app';

const main = async () => {
	await db();

	const serverLogMsg = IS_PROD
		? `Server 🚀 At Port: ${PORT} `
		: `Server 🚀 At: http://localhost:${PORT} `;

	app.listen(PORT, () => {
		console.log(serverLogMsg);
	});
};

main();
