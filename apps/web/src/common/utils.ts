type MapDateToString<PropType> = PropType extends Date ? string : PropType

export type MapDatesToString<T> = {
	[PropKey in keyof T]: MapDateToString<T[PropKey]>
}
