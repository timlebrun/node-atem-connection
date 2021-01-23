'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class DataTransferAckCommand extends CommandBase_1.DeserializedCommand {
	static deserialize(rawCommand) {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			transferIndex: rawCommand.readUInt8(2)
		}
		return new DataTransferAckCommand(properties)
	}
	applyToState() {
		// Nothing to do
		return []
	}
}
exports.DataTransferAckCommand = DataTransferAckCommand
DataTransferAckCommand.rawName = 'FTUA'
//# sourceMappingURL=DataTransferAckCommand.js.map
