'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const __1 = require('..')
const dataTransferFrame_1 = require('./dataTransferFrame')
class DataTransferStill extends dataTransferFrame_1.default {
	constructor(transferId, frameId, data, name, description) {
		super(transferId, 0, frameId, data)
		this.name = name
		this.description = description
	}
	sendDescription() {
		return new __1.Commands.DataTransferFileDescriptionCommand({
			description: this.description,
			name: this.name,
			fileHash: this.hash,
			transferId: this.transferId
		})
	}
}
exports.default = DataTransferStill
//# sourceMappingURL=dataTransferStill.js.map
