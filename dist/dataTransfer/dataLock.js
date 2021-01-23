'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const __1 = require('..')
const dataTransferClip_1 = require('./dataTransferClip')
class DataLock {
	constructor(storeId, queueCommand) {
		this.taskQueue = []
		this.storeId = storeId
		this.queueCommand = queueCommand
		this.isLocked = false
	}
	enqueue(transfer) {
		this.taskQueue.push(transfer)
		if (!this.activeTransfer) {
			this.dequeueAndRun()
		}
		return transfer.promise
	}
	dequeueAndRun() {
		if (
			(this.activeTransfer === undefined || this.activeTransfer.state === __1.Enums.TransferState.Finished) &&
			this.taskQueue.length > 0
		) {
			this.activeTransfer = this.taskQueue.shift()
			if (this.isLocked) {
				// TODO - this flow should never be hit
				this.lockObtained()
			} else {
				this.queueCommand(new __1.Commands.LockStateCommand(this.storeId, true))
			}
		}
	}
	lockObtained() {
		this.isLocked = true
		if (this.activeTransfer && this.activeTransfer.state === __1.Enums.TransferState.Queued) {
			this.activeTransfer.gotLock().forEach(cmd => this.queueCommand(cmd))
		}
	}
	lostLock() {
		this.isLocked = false
		if (this.activeTransfer) {
			if (this.activeTransfer.state === __1.Enums.TransferState.Finished) {
				this.activeTransfer.resolvePromise(this.activeTransfer)
			} else {
				// @todo: dequeue any old commands
				this.activeTransfer.rejectPromise(new Error('Lost lock mid-transfer'))
			}
		}
		this.activeTransfer = undefined
		this.dequeueAndRun()
	}
	updateLock(locked) {
		this.isLocked = locked
	}
	transferFinished() {
		this.queueCommand(new __1.Commands.LockStateCommand(this.storeId, false))
	}
	transferErrored(code) {
		if (this.activeTransfer) {
			switch (code) {
				case 1: // Probably means "retry".
					if (this.activeTransfer instanceof dataTransferClip_1.default) {
						// Retry the last frame.
						this.activeTransfer.frames[this.activeTransfer.curFrame]
							.start()
							.forEach(cmd => this.queueCommand(cmd))
					} else {
						// Retry the entire transfer.
						this.activeTransfer.start().forEach(cmd => this.queueCommand(cmd))
					}
					break
				case 2: // Unknown.
				case 3: // Unknown.
				case 4: // Unknown.
				case 5: // Might mean "You don't have the lock"?
				default:
					// Abort the transfer.
					// @todo: dequeue any old commands
					this.activeTransfer.rejectPromise(new Error(`Code ${code}`))
					this.activeTransfer = undefined
					this.dequeueAndRun()
			}
		} else {
			this.activeTransfer = undefined
			this.dequeueAndRun()
		}
	}
}
exports.default = DataLock
//# sourceMappingURL=dataLock.js.map
