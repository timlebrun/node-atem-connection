'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
const enums_1 = require('../../enums')
class TopologyCommand extends CommandBase_1.DeserializedCommand {
	static deserialize(rawCommand, version) {
		const v230offset = version > enums_1.ProtocolVersion.V8_0_1 ? 1 : 0
		const properties = {
			mixEffects: rawCommand.readUInt8(0),
			sources: rawCommand.readUInt8(1),
			downstreamKeyers: rawCommand.readUInt8(2),
			auxilliaries: rawCommand.readUInt8(3),
			mixMinusOutputs: rawCommand.readUInt8(4),
			mediaPlayers: rawCommand.readUInt8(5),
			multiviewers: v230offset > 0 ? rawCommand.readUInt8(6) : -1,
			serialPorts: rawCommand.readUInt8(6 + v230offset),
			maxHyperdecks: rawCommand.readUInt8(7 + v230offset),
			DVEs: rawCommand.readUInt8(8 + v230offset),
			stingers: rawCommand.readUInt8(9 + v230offset),
			superSources: rawCommand.readUInt8(10 + v230offset),
			talkbackChannels: rawCommand.readUInt8(12 + v230offset),
			cameraControl: rawCommand.readUInt8(17 + v230offset) === 1,
			// Note: these are defined below as they can overflow in older firmwares
			advancedChromaKeyers: false,
			onlyConfigurableOutputs: false
		}
		// in 7.4?
		if (rawCommand.length > 20) {
			properties.advancedChromaKeyers = rawCommand.readUInt8(21 + v230offset) === 1
			properties.onlyConfigurableOutputs = rawCommand.readUInt8(22 + v230offset) === 1
		}
		return new TopologyCommand(properties)
	}
	applyToState(state) {
		state.info.capabilities = Object.assign(Object.assign({}, state.info.capabilities), this.properties)
		if (this.properties.multiviewers > 0) {
			state.info.multiviewer = Object.assign(Object.assign({ windowCount: 10 }, state.info.multiviewer), {
				count: this.properties.multiviewers
			})
		}
		return `info.capabilities`
	}
}
exports.TopologyCommand = TopologyCommand
TopologyCommand.rawName = '_top'
//# sourceMappingURL=topologyCommand.js.map
