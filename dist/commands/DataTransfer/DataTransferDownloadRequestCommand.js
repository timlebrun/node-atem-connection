'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class DataTransferDownloadRequestCommand extends CommandBase_1.BasicWritableCommand {
	serialize() {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer.writeUInt16BE(this.properties.transferStoreId, 2)
		buffer.writeUInt8(this.properties.transferIndex, 7)
		buffer.writeUInt16BE(0x00f9, 8)
		buffer.writeUInt16BE(0x020f, 10)
		return buffer
	}
}
exports.DataTransferDownloadRequestCommand = DataTransferDownloadRequestCommand
DataTransferDownloadRequestCommand.rawName = 'FTSU'
//# sourceMappingURL=DataTransferDownloadRequestCommand.js.map
