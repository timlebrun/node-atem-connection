'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class DataTransferErrorCommand extends CommandBase_1.DeserializedCommand {
	static deserialize(rawCommand) {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			errorCode: rawCommand.readUInt8(2)
		}
		return new DataTransferErrorCommand(properties)
	}
	applyToState() {
		// Nothing to do
		return []
	}
}
exports.DataTransferErrorCommand = DataTransferErrorCommand
DataTransferErrorCommand.rawName = 'FTDE'
//# sourceMappingURL=DataTransferErrorCommand.js.map
