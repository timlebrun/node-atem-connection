'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../../CommandBase')
const state_1 = require('../../../state')
class MixEffectKeyFlyKeyframeGetCommand extends CommandBase_1.DeserializedCommand {
	constructor(mixEffect, upstreamKeyerId, keyFrameId, properties) {
		super(properties)
		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.keyFrameId = keyFrameId
	}
	static deserialize(rawCommand) {
		const mixEffect = rawCommand.readUInt8(0)
		const upstreamKeyerId = rawCommand.readUInt8(1)
		const keyFrameId = rawCommand.readUInt8(2)
		const properties = {
			keyFrameId: keyFrameId,
			sizeX: rawCommand.readUInt32BE(4),
			sizeY: rawCommand.readUInt32BE(8),
			positionX: rawCommand.readInt32BE(12),
			positionY: rawCommand.readInt32BE(16),
			rotation: rawCommand.readInt32BE(20),
			borderOuterWidth: rawCommand.readUInt16BE(24),
			borderInnerWidth: rawCommand.readUInt16BE(26),
			borderOuterSoftness: rawCommand.readUInt8(28),
			borderInnerSoftness: rawCommand.readUInt8(29),
			borderBevelSoftness: rawCommand.readUInt8(30),
			borderBevelPosition: rawCommand.readUInt8(31),
			borderOpacity: rawCommand.readUInt8(32),
			borderHue: rawCommand.readUInt16BE(34),
			borderSaturation: rawCommand.readUInt16BE(36),
			borderLuma: rawCommand.readUInt16BE(38),
			lightSourceDirection: rawCommand.readUInt16BE(40),
			lightSourceAltitude: rawCommand.readUInt8(42),
			// maskEnabled: rawCommand.readUInt8(43) === 1,
			maskTop: rawCommand.readInt16BE(44),
			maskBottom: rawCommand.readInt16BE(46),
			maskLeft: rawCommand.readInt16BE(48),
			maskRight: rawCommand.readInt16BE(50)
		}
		return new MixEffectKeyFlyKeyframeGetCommand(mixEffect, upstreamKeyerId, keyFrameId, properties)
	}
	applyToState(state) {
		const meInfo = state.info.mixEffects[this.mixEffect]
		if (!meInfo || this.upstreamKeyerId >= meInfo.keyCount) {
			throw new state_1.InvalidIdError('UpstreamKeyer', this.mixEffect, this.upstreamKeyerId)
		} else if (this.keyFrameId <= 0 || this.keyFrameId > 2) {
			throw new state_1.InvalidIdError('FlyKeyFrame', this.keyFrameId)
		}
		const mixEffect = state_1.AtemStateUtil.getMixEffect(state, this.mixEffect)
		const upstreamKeyer = state_1.AtemStateUtil.getUpstreamKeyer(mixEffect, this.upstreamKeyerId)
		upstreamKeyer.flyKeyframes[this.properties.keyFrameId] = Object.assign({}, this.properties)
		return `video.mixEffects.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.flyKeyframes.${this.properties.keyFrameId}`
	}
}
exports.MixEffectKeyFlyKeyframeGetCommand = MixEffectKeyFlyKeyframeGetCommand
MixEffectKeyFlyKeyframeGetCommand.rawName = 'KKFP'
//# sourceMappingURL=MixEffectKeyFlyKeyframeGetCommand.js.map
