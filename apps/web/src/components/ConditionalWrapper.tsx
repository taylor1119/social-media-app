import { FC, ReactNode } from 'react'

interface IConditionalWrapperProps {
	condition: boolean
	wrapper: FC<{ children?: ReactNode }>
	children: JSX.Element
}

const ConditionalWrapper = ({
	condition,
	wrapper,
	children,
}: IConditionalWrapperProps) => (condition ? wrapper({ children }) : children)

export default ConditionalWrapper
