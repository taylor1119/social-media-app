import {
	TChatMessageInput,
	TLoginInput,
	TPostCommentInput,
	TPostInput,
	TSignUpInput,
	TUpdateUserInput,
} from '@social-media-app/shared';
import 'express-serve-static-core';
import { DB_DOC_IDS } from '../common/strings';
import { MESSAGE_INPUT } from '../DATA_SOURCES/MESSAGES/strings';
import { POST_INPUT } from '../DATA_SOURCES/POST/strings';
import { POST_COMMENT_INPUT } from '../DATA_SOURCES/POST_COMMENT/strings';
import {
	LOGIN_INPUT,
	SIGNUP_INPUT,
	UPDATE_USER_INPUT,
} from '../DATA_SOURCES/USER/strings';

declare module 'express-serve-static-core' {
	interface Request {
		currentUserId?: string;
		[LOGIN_INPUT]?: TLoginInput;
		[SIGNUP_INPUT]?: TSignUpInput;
		[UPDATE_USER_INPUT]?: TUpdateUserInput;
		[MESSAGE_INPUT]?: TChatMessageInput;
		[POST_INPUT]?: TPostInput;
		[POST_COMMENT_INPUT]?: TPostCommentInput;
		[DB_DOC_IDS]?: string[];
	}
}
