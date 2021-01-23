'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const exitHook = require('exit-hook')
const __1 = require('..')
const dataLock_1 = require('./dataLock')
const dataTransferFrame_1 = require('./dataTransferFrame')
const dataTransferStill_1 = require('./dataTransferStill')
const dataTransferClip_1 = require('./dataTransferClip')
const dataTransferAudio_1 = require('./dataTransferAudio')
const MAX_PACKETS_TO_SEND_PER_TICK = 10
const MAX_TRANSFER_INDEX = (1 << 16) - 1 // Inclusive maximum
class DataTransferManager {
	constructor() {
		this.commandQueue = []
		this.stillsLock = new dataLock_1.default(0, cmd => this.commandQueue.push(cmd))
		this.clipLocks = [
			new dataLock_1.default(1, cmd => this.commandQueue.push(cmd)),
			new dataLock_1.default(2, cmd => this.commandQueue.push(cmd))
		]
		this.transferIndex = 0
	}
	startCommandSending(sendCommands) {
		if (!this.interval) {
			// New connection means a new queue
			this.commandQueue.splice(0, this.commandQueue.length)
			this.interval = setInterval(() => {
				if (this.commandQueue.length <= 0) {
					return
				}
				const commandsToSend = this.commandQueue.splice(0, MAX_PACKETS_TO_SEND_PER_TICK)
				// The only way commands are rejected is if the connection dies, so if any reject then we fail
				Promise.all(sendCommands(commandsToSend)).catch(e => {
					// TODO - handle this better. it should kill/restart the upload. and should also be logged in some way
					console.log(`Transfer send error: ${e}`)
				})
			}, 0)
		}
		if (!this.exitUnsubscribe) {
			this.exitUnsubscribe = exitHook(() => {
				this.stopCommandSending()
			})
		}
	}
	stopCommandSending() {
		if (this.exitUnsubscribe) {
			this.exitUnsubscribe()
			this.exitUnsubscribe = undefined
		}
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = undefined
		}
	}
	handleCommand(command) {
		const allLocks = [this.stillsLock, ...this.clipLocks]
		// try to establish the associated DataLock:
		let lock
		if (
			command.constructor.name === __1.Commands.LockObtainedCommand.name ||
			command.constructor.name === __1.Commands.LockStateUpdateCommand.name
		) {
			lock = allLocks[command.properties.index]
		} else if (typeof command.properties.storeId === 'number') {
			lock = allLocks[command.properties.storeId]
		} else if (command.properties.transferId !== undefined || command.properties.transferIndex !== undefined) {
			for (const _lock of allLocks) {
				if (
					_lock.activeTransfer &&
					(_lock.activeTransfer.transferId === command.properties.transferId ||
						_lock.activeTransfer.transferId === command.properties.transferIndex)
				) {
					lock = _lock
				}
			}
		} else {
			// debugging:
			console.log('UNKNOWN COMMAND:', command)
			return
		}
		// console.log('CMD', command.constructor.name)
		if (!lock) return
		// handle actual command
		if (command.constructor.name === __1.Commands.LockObtainedCommand.name) {
			lock.lockObtained()
		}
		if (command.constructor.name === __1.Commands.LockStateUpdateCommand.name) {
			const transferFinished =
				lock.activeTransfer && lock.activeTransfer.state === __1.Enums.TransferState.Finished
			if (!command.properties.locked || transferFinished) {
				lock.lostLock()
			} else {
				lock.updateLock(command.properties.locked)
			}
		}
		if (command.constructor.name === __1.Commands.DataTransferErrorCommand.name) {
			lock.transferErrored(command.properties.errorCode)
		}
		if (lock.activeTransfer) {
			lock.activeTransfer.handleCommand(command).forEach(cmd => this.commandQueue.push(cmd))
			if (lock.activeTransfer.state === __1.Enums.TransferState.Finished) {
				lock.transferFinished()
			}
		}
	}
	uploadStill(index, data, name, description) {
		const transfer = new dataTransferStill_1.default(this.nextTransferIndex, index, data, name, description)
		return this.stillsLock.enqueue(transfer)
	}
	uploadClip(index, data, name) {
		const frames = data.map(
			(frame, id) => new dataTransferFrame_1.default(this.nextTransferIndex, 1 + index, id, frame)
		)
		const transfer = new dataTransferClip_1.default(index, name, frames)
		const lock = this.getClipLock(index)
		return lock.enqueue(transfer)
	}
	uploadAudio(index, data, name) {
		const transfer = new dataTransferAudio_1.default(this.nextTransferIndex, 1 + index, data, name)
		const lock = this.getClipLock(index)
		return lock.enqueue(transfer)
	}
	get nextTransferIndex() {
		const index = this.transferIndex++
		if (this.transferIndex > MAX_TRANSFER_INDEX) this.transferIndex = 0
		return index
	}
	getClipLock(index) {
		const lock = this.clipLocks[index]
		if (lock) {
			return lock
		} else {
			throw new Error('Invalid clip id')
		}
	}
}
exports.DataTransferManager = DataTransferManager
//# sourceMappingURL=index.js.map
