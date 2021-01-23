'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class MediaPoolClearClipCommand extends CommandBase_1.BasicWritableCommand {
	constructor(index) {
		super({ index })
	}
	serialize() {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.index, 0)
		return buffer
	}
}
exports.MediaPoolClearClipCommand = MediaPoolClearClipCommand
MediaPoolClearClipCommand.rawName = 'CMPC'
//# sourceMappingURL=MediaPoolClearClipCommand.js.map
