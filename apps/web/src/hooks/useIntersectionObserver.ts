import { useCallback, useRef } from 'react'
import { IntersectionObserverArgs } from '../common/interfaces'

const useIntersectionObserver = <T extends Element>({
	onIntersection,
	enable,
}: IntersectionObserverArgs) => {
	const observer = useRef<IntersectionObserver>()

	const intersectionItemRef = useCallback(
		(node: T) => {
			if (!enable) return

			if (observer.current) observer.current.disconnect()

			observer.current = new IntersectionObserver((entries) => {
				if (!entries[0].isIntersecting) return
				onIntersection()
			})

			if (node) observer.current.observe(node)
		},
		[enable, onIntersection]
	)

	return intersectionItemRef
}

export default useIntersectionObserver
