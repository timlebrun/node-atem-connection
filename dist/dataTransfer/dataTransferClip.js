'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const __1 = require('..')
const dataTransfer_1 = require('./dataTransfer')
class DataTransferClip extends dataTransfer_1.default {
	constructor(clipIndex, name, frames) {
		super(0, 1 + clipIndex)
		this.curFrame = 0
		this.clipIndex = clipIndex
		this.name = name
		this.frames = frames
	}
	start() {
		const commands = []
		commands.push(new __1.Commands.MediaPoolClearClipCommand(this.clipIndex))
		this.frames[this.curFrame].state = __1.Enums.TransferState.Locked
		commands.push(...this.frames[this.curFrame].start())
		return commands
	}
	handleCommand(command) {
		const commands = []
		commands.push(...this.frames[this.curFrame].handleCommand(command))
		if (this.state !== __1.Enums.TransferState.Transferring) this.state = __1.Enums.TransferState.Transferring
		if (this.frames[this.curFrame].state === __1.Enums.TransferState.Finished) {
			this.curFrame++
			if (this.curFrame < this.frames.length) {
				this.frames[this.curFrame].state = __1.Enums.TransferState.Locked
				commands.push(...this.frames[this.curFrame].start())
			} else {
				const command = new __1.Commands.MediaPoolSetClipCommand({
					index: this.clipIndex,
					name: this.name,
					frames: this.frames.length
				})
				commands.push(command)
				this.state = __1.Enums.TransferState.Finished
			}
		}
		return commands
	}
	get transferId() {
		return this.frames[this.curFrame].transferId
	}
	gotLock() {
		this.state = __1.Enums.TransferState.Locked
		return this.start()
	}
}
exports.default = DataTransferClip
//# sourceMappingURL=dataTransferClip.js.map
