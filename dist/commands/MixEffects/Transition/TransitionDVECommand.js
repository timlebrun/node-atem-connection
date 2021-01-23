'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../../CommandBase')
const state_1 = require('../../../state')
class TransitionDVECommand extends CommandBase_1.WritableCommand {
	constructor(mixEffect) {
		super()
		this.mixEffect = mixEffect
	}
	serialize() {
		const buffer = Buffer.alloc(20, 0)
		buffer.writeUInt16BE(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 2)
		buffer.writeUInt8(this.properties.rate || 0, 3)
		buffer.writeUInt8(this.properties.logoRate || 0, 4)
		buffer.writeUInt8(this.properties.style || 0, 5)
		buffer.writeUInt16BE(this.properties.fillSource || 0, 6)
		buffer.writeUInt16BE(this.properties.keySource || 0, 8)
		buffer.writeUInt8(this.properties.enableKey ? 1 : 0, 10)
		buffer.writeUInt8(this.properties.preMultiplied ? 1 : 0, 11)
		buffer.writeUInt16BE(this.properties.clip || 0, 12)
		buffer.writeUInt16BE(this.properties.gain || 0, 14)
		buffer.writeUInt8(this.properties.invertKey ? 1 : 0, 16)
		buffer.writeUInt8(this.properties.reverse ? 1 : 0, 17)
		buffer.writeUInt8(this.properties.flipFlop ? 1 : 0, 18)
		return buffer
	}
}
exports.TransitionDVECommand = TransitionDVECommand
TransitionDVECommand.MaskFlags = {
	rate: 1 << 0,
	logoRate: 1 << 1,
	style: 1 << 2,
	fillSource: 1 << 3,
	keySource: 1 << 4,
	enableKey: 1 << 5,
	preMultiplied: 1 << 6,
	clip: 1 << 7,
	gain: 1 << 8,
	invertKey: 1 << 9,
	reverse: 1 << 10,
	flipFlop: 1 << 11
}
TransitionDVECommand.rawName = 'CTDv'
class TransitionDVEUpdateCommand extends CommandBase_1.DeserializedCommand {
	constructor(mixEffect, properties) {
		super(properties)
		this.mixEffect = mixEffect
	}
	static deserialize(rawCommand) {
		const mixEffect = rawCommand.readUInt8(0)
		const properties = {
			rate: rawCommand.readUInt8(1),
			logoRate: rawCommand.readUInt8(2),
			style: rawCommand.readUInt8(3),
			fillSource: (rawCommand.readUInt8(4) << 8) | (rawCommand.readUInt8(5) & 0xff),
			keySource: (rawCommand.readUInt8(6) << 8) | (rawCommand.readUInt8(7) & 0xff),
			enableKey: rawCommand.readUInt8(8) === 1,
			preMultiplied: rawCommand.readUInt8(9) === 1,
			clip: rawCommand.readUInt16BE(10),
			gain: rawCommand.readUInt16BE(12),
			invertKey: rawCommand.readUInt8(14) === 1,
			reverse: rawCommand.readUInt8(15) === 1,
			flipFlop: rawCommand.readUInt8(16) === 1
		}
		return new TransitionDVEUpdateCommand(mixEffect, properties)
	}
	applyToState(state) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects) {
			throw new state_1.InvalidIdError('MixEffect', this.mixEffect)
		} else if (!state.info.capabilities.DVEs) {
			throw new state_1.InvalidIdError(`DVE is not supported`)
		}
		const mixEffect = state_1.AtemStateUtil.getMixEffect(state, this.mixEffect)
		mixEffect.transitionSettings.DVE = Object.assign({}, this.properties)
		return `video.mixEffects.${this.mixEffect}.transitionSettings.DVE`
	}
}
exports.TransitionDVEUpdateCommand = TransitionDVEUpdateCommand
TransitionDVEUpdateCommand.rawName = 'TDvP'
//# sourceMappingURL=TransitionDVECommand.js.map
