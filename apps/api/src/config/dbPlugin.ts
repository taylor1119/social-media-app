import mongoose from 'mongoose'

mongoose.plugin((schema) => {
	const toObjectOption: mongoose.ToObjectOptions = {
		versionKey: false,
		virtuals: true,
		transform(doc, ret) {
			delete ret._id
		},
	}

	schema.set('timestamps', true)
	schema.set('toJSON', toObjectOption)
	schema.set('toObject', toObjectOption)
})
