'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class LockObtainedCommand extends CommandBase_1.DeserializedCommand {
	constructor(index) {
		super({ index })
	}
	static deserialize(rawCommand) {
		const index = rawCommand.readUInt16BE(0)
		return new LockObtainedCommand(index)
	}
	applyToState() {
		// nothing to do
		return []
	}
}
exports.LockObtainedCommand = LockObtainedCommand
LockObtainedCommand.rawName = 'LKOB'
//# sourceMappingURL=LockObtainedCommand.js.map
