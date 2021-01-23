'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class DownstreamKeyMaskCommand extends CommandBase_1.WritableCommand {
	constructor(downstreamKeyerId) {
		super()
		this.downstreamKeyerId = downstreamKeyerId
	}
	serialize() {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.downstreamKeyerId, 1)
		buffer.writeUInt8(this.properties.enabled ? 1 : 0, 2)
		buffer.writeInt16BE(this.properties.top || 0, 4)
		buffer.writeInt16BE(this.properties.bottom || 0, 6)
		buffer.writeInt16BE(this.properties.left || 0, 8)
		buffer.writeInt16BE(this.properties.right || 0, 10)
		return buffer
	}
}
exports.DownstreamKeyMaskCommand = DownstreamKeyMaskCommand
DownstreamKeyMaskCommand.MaskFlags = {
	enabled: 1 << 0,
	top: 1 << 1,
	bottom: 1 << 2,
	left: 1 << 3,
	right: 1 << 4
}
DownstreamKeyMaskCommand.rawName = 'CDsM'
//# sourceMappingURL=DownstreamKeyMaskCommand.js.map
