'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class DeserializedCommand {
	constructor(properties) {
		this.properties = properties
	}
}
exports.DeserializedCommand = DeserializedCommand
class BasicWritableCommand {
	constructor(properties) {
		this._properties = properties
	}
	get properties() {
		return this._properties
	}
}
exports.BasicWritableCommand = BasicWritableCommand
class WritableCommand extends BasicWritableCommand {
	constructor() {
		super({})
		this.flag = 0
	}
	updateProps(newProps) {
		return this._updateProps(newProps)
	}
	_updateProps(newProps) {
		const maskFlags = this.constructor.MaskFlags
		let hasChanges = false
		if (maskFlags) {
			for (const key in newProps) {
				const key2 = key
				const val = newProps[key]
				if (key in maskFlags && val !== undefined) {
					this.flag = this.flag | maskFlags[key]
					this._properties[key2] = val
					hasChanges = true
				}
			}
		}
		return hasChanges
	}
}
exports.WritableCommand = WritableCommand
class SymmetricalCommand extends DeserializedCommand {}
exports.SymmetricalCommand = SymmetricalCommand
//# sourceMappingURL=CommandBase.js.map
