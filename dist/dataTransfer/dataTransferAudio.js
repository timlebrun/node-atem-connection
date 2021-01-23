'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const __1 = require('..')
const dataTransferFrame_1 = require('./dataTransferFrame')
class DataTransferAudio extends dataTransferFrame_1.default {
	constructor(transferId, storeId, data, name) {
		super(transferId, storeId, 0, data)
		this.name = name
	}
	start() {
		const command = new __1.Commands.DataTransferUploadRequestCommand({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: 0,
			size: this.data.length,
			mode: __1.Enums.TransferMode.WriteAudio
		})
		return [command]
	}
	sendDescription() {
		return new __1.Commands.DataTransferFileDescriptionCommand({
			name: this.name,
			fileHash: this.hash,
			transferId: this.transferId
		})
	}
}
exports.default = DataTransferAudio
//# sourceMappingURL=dataTransferAudio.js.map
