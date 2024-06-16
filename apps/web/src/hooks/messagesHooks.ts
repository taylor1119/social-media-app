import { useQuery } from 'react-query'
import queryKeys from '../constants/reactQueryKeys'
import { getUnreadMessagesQuery } from '../queries/messages'

export const useGetUnreadMessages = () =>
	useQuery(queryKeys.unreadMessages, getUnreadMessagesQuery)
