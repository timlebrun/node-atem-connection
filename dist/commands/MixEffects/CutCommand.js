'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class CutCommand extends CommandBase_1.BasicWritableCommand {
	constructor(mixEffect) {
		super(null)
		this.mixEffect = mixEffect
	}
	serialize() {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		return buffer
	}
}
exports.CutCommand = CutCommand
CutCommand.rawName = 'DCut'
//# sourceMappingURL=CutCommand.js.map
