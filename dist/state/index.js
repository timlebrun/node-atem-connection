'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const AtemStateUtil = require('./util')
exports.AtemStateUtil = AtemStateUtil
class InvalidIdError extends Error {
	constructor(message, ...ids) {
		super(InvalidIdError.BuildErrorString(message, ids))
		Object.setPrototypeOf(this, new.target.prototype)
	}
	static BuildErrorString(message, ids) {
		if (ids && ids.length > 0) {
			return `${message} ${ids.join('-')} is not valid`
		} else {
			return message
		}
	}
}
exports.InvalidIdError = InvalidIdError
//# sourceMappingURL=index.js.map
