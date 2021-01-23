'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const __1 = require('..')
class DataTransfer {
	constructor(transferId, storeId) {
		this.state = __1.Enums.TransferState.Queued
		this._transferId = transferId
		this.storeId = storeId
		// Make typescript happy
		this.resolvePromise = () => {
			// Ignore
		}
		this.rejectPromise = () => {
			// Ignore
		}
		this.completionPromise = new Promise((resolve, reject) => {
			this.resolvePromise = resolve
			this.rejectPromise = reject
		})
	}
	get transferId() {
		return this._transferId
	}
	get promise() {
		return this.completionPromise
	}
}
exports.default = DataTransfer
//# sourceMappingURL=dataTransfer.js.map
