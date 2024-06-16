import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import queryKeys from '../constants/reactQueryKeys'
import { getConversationQuery } from '../queries/messages'
import { currentUserState } from '../recoil/atoms'

const useGetConversation = (friendId?: string) => {
	const currentUserId = useRecoilValue(currentUserState)?.id
	const conversationMembers =
		friendId && currentUserId ? [friendId, currentUserId] : []

	return useQuery(
		queryKeys.conversation(friendId),
		() => getConversationQuery(conversationMembers),
		{ enabled: Boolean(friendId && currentUserId) }
	)
}

export default useGetConversation
