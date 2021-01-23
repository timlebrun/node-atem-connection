'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const __1 = require('..')
const crypto = require('crypto')
const dataTransfer_1 = require('./dataTransfer')
class DataTransferFrame extends dataTransfer_1.default {
	constructor(transferId, storeId, frameId, data) {
		super(transferId, storeId)
		this._sent = 0
		this.frameId = frameId
		this.data = data
		this.hash = this.data
			? crypto
					.createHash('md5')
					.update(this.data)
					.digest()
					.toString()
			: ''
	}
	start() {
		const command = new __1.Commands.DataTransferUploadRequestCommand({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: this.frameId,
			size: this.data.length,
			mode: __1.Enums.TransferMode.Write
		})
		return [command]
	}
	sendDescription() {
		return new __1.Commands.DataTransferFileDescriptionCommand({ fileHash: this.hash, transferId: this.transferId })
	}
	handleCommand(command) {
		const commands = []
		if (command.constructor.name === __1.Commands.DataTransferUploadContinueCommand.name) {
			if (this.state === __1.Enums.TransferState.Locked) {
				this.state = __1.Enums.TransferState.Transferring
				commands.push(this.sendDescription())
			}
			commands.push(...this.queueCommand(command.properties.chunkCount, command.properties.chunkSize))
		} else if (command.constructor.name === __1.Commands.DataTransferCompleteCommand.name) {
			if (this.state === __1.Enums.TransferState.Transferring) {
				this.state = __1.Enums.TransferState.Finished
			}
		}
		return commands
	}
	gotLock() {
		this.state = __1.Enums.TransferState.Locked
		return this.start()
	}
	queueCommand(chunkCount, chunkSize) {
		const commands = []
		chunkSize += -4
		for (let i = 0; i < chunkCount; i++) {
			if (this._sent > this.data.length) break
			const command = new __1.Commands.DataTransferDataCommand({
				transferId: this.transferId,
				body: this.data.slice(this._sent, this._sent + chunkSize)
			})
			commands.push(command)
			this._sent += chunkSize
		}
		return commands
	}
}
exports.default = DataTransferFrame
//# sourceMappingURL=dataTransferFrame.js.map
