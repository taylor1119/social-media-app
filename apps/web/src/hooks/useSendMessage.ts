import { yupResolver } from '@hookform/resolvers/yup'
import { IChatMessage } from 'shared'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { queryClient } from '..'
import { chatMessageSchema } from '../common/validation'
import queryKeys from '../constants/reactQueryKeys'
import { sendChatMessagesQuery } from '../queries/messages'
import { currentUserState } from '../recoil/atoms'

const useSendMessage = (targetId?: string) => {
	const queryKey = queryKeys.conversation(targetId)

	const useMutationResult = useMutation(sendChatMessagesQuery, {
		// When mutate is called:
		onMutate: async (newMessageInput) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)

			await queryClient.cancelQueries(queryKey)

			// Snapshot the previous value

			const previousConversation =
				queryClient.getQueryData<IChatMessage[]>(queryKey)

			// Optimistically update to the new value

			const date = new Date()
			const newMessage: IChatMessage = {
				...newMessageInput,
				id: Math.random().toString(),
				status: 'pending',
				createdAt: date,
				updatedAt: date,
			}

			queryClient.setQueryData<IChatMessage[]>(queryKey, (old) =>
				old ? old.concat(newMessage) : [newMessage]
			)

			// Return a context object with the snapshot value

			return { previousConversation }
		},

		// If the mutation fails, use the context returned from onMutate to roll back

		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.previousConversation)
		},

		// Always refetch after error or success:

		onSettled: () => {
			queryClient.invalidateQueries(queryKey)
		},
	})

	const sender = useRecoilValue(currentUserState)
	const { register, handleSubmit, reset } = useForm({
		resolver: yupResolver(chatMessageSchema),
	})

	const onSubmit = handleSubmit(({ text }) => {
		useMutationResult.mutate({
			senderId: sender?.id ?? '',
			targetId: targetId ?? '',
			text,
		})
		reset()
	})

	return { register, onSubmit }
}

export default useSendMessage
