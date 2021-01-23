'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const eventemitter3_1 = require('eventemitter3')
const state_1 = require('./state')
const atemSocket_1 = require('./lib/atemSocket')
const Commands = require('./commands')
const DataTransferCommands = require('./commands/DataTransfer')
const DT = require('./dataTransfer')
const Util = require('./lib/atemUtil')
const Enums = require('./enums')
const tally_1 = require('./lib/tally')
const atemUtil_1 = require('./lib/atemUtil')
const bigInt = require('big-integer')
var AtemConnectionStatus
;(function(AtemConnectionStatus) {
	AtemConnectionStatus[(AtemConnectionStatus['CLOSED'] = 0)] = 'CLOSED'
	AtemConnectionStatus[(AtemConnectionStatus['CONNECTING'] = 1)] = 'CONNECTING'
	AtemConnectionStatus[(AtemConnectionStatus['CONNECTED'] = 2)] = 'CONNECTED'
})((AtemConnectionStatus = exports.AtemConnectionStatus || (exports.AtemConnectionStatus = {})))
exports.DEFAULT_PORT = 9910
class BasicAtem extends eventemitter3_1.EventEmitter {
	constructor(options) {
		super()
		this._sentQueue = {}
		this._state = state_1.AtemStateUtil.Create()
		this._status = AtemConnectionStatus.CLOSED
		this.socket = new atemSocket_1.AtemSocket({
			debugBuffers: (options || {}).debugBuffers || false,
			address: (options || {}).address || '',
			port: (options || {}).port || exports.DEFAULT_PORT,
			disableMultithreaded: (options || {}).disableMultithreaded || false,
			childProcessTimeout: (options || {}).childProcessTimeout || 600
		})
		this.dataTransferManager = new DT.DataTransferManager()
		this.socket.on('commandsReceived', commands => {
			this.emit('receivedCommands', commands)
			this._mutateState(commands)
		})
		this.socket.on('commandsAck', trackingIds => this._resolveCommands(trackingIds))
		this.socket.on('info', msg => this.emit('info', msg))
		this.socket.on('debug', msg => this.emit('debug', msg))
		this.socket.on('error', e => this.emit('error', e))
		this.socket.on('disconnect', () => {
			this._status = AtemConnectionStatus.CLOSED
			this.dataTransferManager.stopCommandSending()
			this._rejectAllCommands()
			this.emit('disconnected')
			this._state = undefined
		})
	}
	_onInitComplete() {
		this.dataTransferManager.startCommandSending(cmds => this.sendCommands(cmds))
		this.emit('connected')
	}
	get status() {
		return this._status
	}
	get state() {
		return this._state
	}
	connect(address, port) {
		return this.socket.connect(address, port)
	}
	disconnect() {
		return this.socket.disconnect()
	}
	destroy() {
		return this.socket.destroy()
	}
	sendCommands(commands) {
		const commands2 = commands.map(cmd => ({
			rawCommand: cmd,
			trackingId: this.socket.nextCommandTrackingId
		}))
		const sendPromise = this.socket.sendCommands(commands2)
		return commands2.map(cmd =>
			tslib_1.__awaiter(this, void 0, void 0, function*() {
				yield sendPromise
				return new Promise((resolve, reject) => {
					this._sentQueue[cmd.trackingId] = {
						command: cmd.rawCommand,
						resolve,
						reject
					}
				})
			})
		)
	}
	sendCommand(command) {
		return this.sendCommands([command])[0]
	}
	_mutateState(commands) {
		// Is this the start of a new connection?
		if (commands.find(cmd => cmd.constructor.name === Commands.VersionCommand.name)) {
			// On start of connection, create a new state object
			this._state = state_1.AtemStateUtil.Create()
			this._status = AtemConnectionStatus.CONNECTING
		}
		const allChangedPaths = []
		const state = this._state
		commands.forEach(command => {
			if (state) {
				try {
					const changePaths = command.applyToState(state)
					if (!Array.isArray(changePaths)) {
						allChangedPaths.push(changePaths)
					} else {
						allChangedPaths.push(...changePaths)
					}
				} catch (e) {
					if (e instanceof state_1.InvalidIdError) {
						this.emit(
							'debug',
							`Invalid command id: ${e}. Command: ${
								command.constructor.name
							} ${atemUtil_1.commandStringify(command)}`
						)
					} else {
						this.emit(
							'error',
							`MutateState failed: ${e}. Command: ${
								command.constructor.name
							} ${atemUtil_1.commandStringify(command)}`
						)
					}
				}
			}
			for (const commandName in DataTransferCommands) {
				if (command.constructor.name === commandName) {
					this.dataTransferManager.handleCommand(command)
				}
			}
		})
		const initComplete = commands.find(cmd => cmd.constructor.name === Commands.InitCompleteCommand.name)
		if (initComplete) {
			this._status = AtemConnectionStatus.CONNECTED
			this._onInitComplete()
		} else if (state && this._status === AtemConnectionStatus.CONNECTED && allChangedPaths.length > 0) {
			this.emit('stateChanged', state, allChangedPaths)
		}
	}
	_resolveCommands(trackingIds) {
		trackingIds.forEach(trackingId => {
			const sent = this._sentQueue[trackingId]
			if (sent) {
				sent.resolve()
				delete this._sentQueue[trackingId]
			}
		})
	}
	_rejectAllCommands() {
		// Take a copy in case the promises cause more mutations
		const sentQueue = this._sentQueue
		this._sentQueue = {}
		Object.values(sentQueue).forEach(sent => sent.reject())
	}
}
exports.BasicAtem = BasicAtem
class Atem extends BasicAtem {
	constructor(options) {
		super(options)
	}
	changeProgramInput(input, me = 0) {
		const command = new Commands.ProgramInputCommand(me, input)
		return this.sendCommand(command)
	}
	changePreviewInput(input, me = 0) {
		const command = new Commands.PreviewInputCommand(me, input)
		return this.sendCommand(command)
	}
	cut(me = 0) {
		const command = new Commands.CutCommand(me)
		return this.sendCommand(command)
	}
	autoTransition(me = 0) {
		const command = new Commands.AutoTransitionCommand(me)
		return this.sendCommand(command)
	}
	fadeToBlack(me = 0) {
		const command = new Commands.FadeToBlackAutoCommand(me)
		return this.sendCommand(command)
	}
	setFadeToBlackRate(rate, me = 0) {
		const command = new Commands.FadeToBlackRateCommand(me, rate)
		return this.sendCommand(command)
	}
	autoDownstreamKey(key = 0, isTowardsOnAir) {
		const command = new Commands.DownstreamKeyAutoCommand(key)
		command.updateProps({ isTowardsOnAir })
		return this.sendCommand(command)
	}
	setDipTransitionSettings(newProps, me = 0) {
		const command = new Commands.TransitionDipCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setDVETransitionSettings(newProps, me = 0) {
		const command = new Commands.TransitionDVECommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setMixTransitionSettings(newProps, me = 0) {
		const command = new Commands.TransitionMixCommand(me, newProps.rate)
		return this.sendCommand(command)
	}
	setTransitionPosition(position, me = 0) {
		const command = new Commands.TransitionPositionCommand(me, position)
		return this.sendCommand(command)
	}
	previewTransition(on, me = 0) {
		const command = new Commands.PreviewTransitionCommand(me, on)
		return this.sendCommand(command)
	}
	setTransitionStyle(newProps, me = 0) {
		const command = new Commands.TransitionPropertiesCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setStingerTransitionSettings(newProps, me = 0) {
		const command = new Commands.TransitionStingerCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setWipeTransitionSettings(newProps, me = 0) {
		const command = new Commands.TransitionWipeCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setAuxSource(source, bus = 0) {
		const command = new Commands.AuxSourceCommand(bus, source)
		return this.sendCommand(command)
	}
	setDownstreamKeyTie(tie, key = 0) {
		const command = new Commands.DownstreamKeyTieCommand(key, tie)
		return this.sendCommand(command)
	}
	setDownstreamKeyOnAir(onAir, key = 0) {
		const command = new Commands.DownstreamKeyOnAirCommand(key, onAir)
		return this.sendCommand(command)
	}
	setDownstreamKeyCutSource(input, key = 0) {
		const command = new Commands.DownstreamKeyCutSourceCommand(key, input)
		return this.sendCommand(command)
	}
	setDownstreamKeyFillSource(input, key = 0) {
		const command = new Commands.DownstreamKeyFillSourceCommand(key, input)
		return this.sendCommand(command)
	}
	setDownstreamKeyGeneralProperties(props, key = 0) {
		const command = new Commands.DownstreamKeyGeneralCommand(key)
		command.updateProps(props)
		return this.sendCommand(command)
	}
	setDownstreamKeyMaskSettings(props, key = 0) {
		const command = new Commands.DownstreamKeyMaskCommand(key)
		command.updateProps(props)
		return this.sendCommand(command)
	}
	setDownstreamKeyRate(rate, key = 0) {
		const command = new Commands.DownstreamKeyRateCommand(key, rate)
		return this.sendCommand(command)
	}
	setTime(hour, minute, second, frame) {
		const command = new Commands.TimeCommand({ hour, minute, second, frame })
		return this.sendCommand(command)
	}
	requestTime() {
		const command = new Commands.TimeRequestCommand()
		return this.sendCommand(command)
	}
	macroContinue() {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.Continue)
		return this.sendCommand(command)
	}
	macroDelete(index = 0) {
		const command = new Commands.MacroActionCommand(index, Enums.MacroAction.Delete)
		return this.sendCommand(command)
	}
	macroInsertUserWait() {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.InsertUserWait)
		return this.sendCommand(command)
	}
	macroInsertTimedWait(frames) {
		const command = new Commands.MacroAddTimedPauseCommand(frames)
		return this.sendCommand(command)
	}
	macroRun(index = 0) {
		const command = new Commands.MacroActionCommand(index, Enums.MacroAction.Run)
		return this.sendCommand(command)
	}
	macroStop() {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.Stop)
		return this.sendCommand(command)
	}
	macroStartRecord(index, name, description) {
		const command = new Commands.MacroRecordCommand(index, name, description)
		return this.sendCommand(command)
	}
	macroStopRecord() {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.StopRecord)
		return this.sendCommand(command)
	}
	macroUpdateProperties(props, index = 0) {
		const command = new Commands.MacroPropertiesCommand(index)
		command.updateProps(props)
		return this.sendCommand(command)
	}
	macroSetLoop(loop) {
		const command = new Commands.MacroRunStatusCommand()
		command.updateProps({ loop })
		return this.sendCommand(command)
	}
	setMultiViewerSource(newProps, mv = 0) {
		const command = new Commands.MultiViewerSourceCommand(mv, newProps.windowIndex, newProps.source)
		return this.sendCommand(command)
	}
	setMediaPlayerSettings(newProps, player = 0) {
		const command = new Commands.MediaPlayerStatusCommand(player)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setMediaPlayerSource(newProps, player = 0) {
		const command = new Commands.MediaPlayerSourceCommand(player)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setMediaClip(index, name, frames = 1) {
		const command = new Commands.MediaPoolSetClipCommand({ index, name, frames })
		return this.sendCommand(command)
	}
	clearMediaPoolClip(clipId) {
		const command = new Commands.MediaPoolClearClipCommand(clipId)
		return this.sendCommand(command)
	}
	clearMediaPoolStill(stillId) {
		const command = new Commands.MediaPoolClearStillCommand(stillId)
		return this.sendCommand(command)
	}
	setSuperSourceBoxSettings(newProps, box = 0, ssrcId = 0) {
		const command = new Commands.SuperSourceBoxParametersCommand(ssrcId, box)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setSuperSourceProperties(newProps, ssrcId = 0) {
		if (this.state && this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourcePropertiesV8Command(ssrcId)
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}
	setSuperSourceBorder(newProps, ssrcId = 0) {
		if (this.state && this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourceBorderCommand(ssrcId)
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}
	setInputSettings(newProps, input = 0) {
		const command = new Commands.InputPropertiesCommand(input)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setUpstreamKeyerChromaSettings(newProps, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyChromaCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setUpstreamKeyerCutSource(cutSource, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyCutSourceSetCommand(me, keyer, cutSource)
		return this.sendCommand(command)
	}
	setUpstreamKeyerFillSource(fillSource, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyFillSourceSetCommand(me, keyer, fillSource)
		return this.sendCommand(command)
	}
	setUpstreamKeyerDVESettings(newProps, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyDVECommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setUpstreamKeyerLumaSettings(newProps, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyLumaCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setUpstreamKeyerMaskSettings(newProps, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyMaskSetCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setUpstreamKeyerPatternSettings(newProps, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyPatternCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	setUpstreamKeyerOnAir(onAir, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyOnAirCommand(me, keyer, onAir)
		return this.sendCommand(command)
	}
	setUpstreamKeyerType(newProps, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyTypeSetCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}
	uploadStill(index, data, name, description) {
		if (!this.state) return Promise.reject()
		const resolution = Util.getVideoModeInfo(this.state.settings.videoMode)
		if (!resolution) return Promise.reject()
		return this.dataTransferManager.uploadStill(
			index,
			Util.convertRGBAToYUV422(resolution.width, resolution.height, data),
			name,
			description
		)
	}
	uploadClip(index, frames, name) {
		if (!this.state) return Promise.reject()
		const resolution = Util.getVideoModeInfo(this.state.settings.videoMode)
		if (!resolution) return Promise.reject()
		const data = []
		for (const frame of frames) {
			data.push(Util.convertRGBAToYUV422(resolution.width, resolution.height, frame))
		}
		return this.dataTransferManager.uploadClip(index, data, name)
	}
	uploadAudio(index, data, name) {
		return this.dataTransferManager.uploadAudio(index, Util.convertWAVToRaw(data), name)
	}
	setAudioMixerInputMixOption(index, mixOption) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ mixOption })
		return this.sendCommand(command)
	}
	setAudioMixerInputGain(index, gain) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ gain })
		return this.sendCommand(command)
	}
	setAudioMixerInputBalance(index, balance) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ balance })
		return this.sendCommand(command)
	}
	setAudioMixerInputProps(index, props) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps(props)
		return this.sendCommand(command)
	}
	setAudioMixerMasterGain(gain) {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps({ gain })
		return this.sendCommand(command)
	}
	setAudioMixerMasterProps(props) {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}
	setFairlightAudioMixerInputProps(index, props) {
		if (this.state && this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.FairlightMixerInputV8Command(index)
			command.updateProps(props)
			return this.sendCommand(command)
		} else {
			const command = new Commands.FairlightMixerInputCommand(index)
			command.updateProps(props)
			return this.sendCommand(command)
		}
	}
	setFairlightAudioMixerSourceProps(index, source, props) {
		const command = new Commands.FairlightMixerSourceCommand(index, bigInt(source))
		command.updateProps(props)
		return this.sendCommand(command)
	}
	startStreaming() {
		const command = new Commands.StreamingStatusCommand(true)
		return this.sendCommand(command)
	}
	stopStreaming() {
		const command = new Commands.StreamingStatusCommand(false)
		return this.sendCommand(command)
	}
	requestStreamingDuration() {
		const command = new Commands.StreamingRequestDurationCommand()
		return this.sendCommand(command)
	}
	setStreamingService(props) {
		const command = new Commands.StreamingServiceCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}
	startRecording() {
		const command = new Commands.RecordingStatusCommand(true)
		return this.sendCommand(command)
	}
	stopRecording() {
		const command = new Commands.RecordingStatusCommand(false)
		return this.sendCommand(command)
	}
	requestRecordingDuration() {
		const command = new Commands.RecordingRequestDurationCommand()
		return this.sendCommand(command)
	}
	switchRecordingDisk() {
		const command = new Commands.RecordingRequestSwitchDiskCommand()
		return this.sendCommand(command)
	}
	setRecordingSettings(props) {
		const command = new Commands.RecordingSettingsCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}
	listVisibleInputs(mode, me = 0) {
		if (this.state) {
			return tally_1.listVisibleInputs(mode, this.state, me)
		} else {
			return []
		}
	}
}
exports.Atem = Atem
//# sourceMappingURL=atem.js.map
