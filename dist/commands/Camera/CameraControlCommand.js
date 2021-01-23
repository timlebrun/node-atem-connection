'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const CommandBase_1 = require('../CommandBase')
class CameraControlCommand extends CommandBase_1.BasicWritableCommand {
	constructor(multiviewerId, windowIndex, source) {
		super({ windowIndex, source })
		this.multiViewerId = multiviewerId
	}
	serialize() {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.multiViewerId, 0)
		buffer.writeUInt8(this.properties.windowIndex || 0, 1)
		buffer.writeUInt16BE(this.properties.source || 0, 2)
		return buffer
	}
}
exports.CameraControlCommand = CameraControlCommand
CameraControlCommand.rawName = 'CCdP'
class CameraControlUpdateCommand extends CommandBase_1.DeserializedCommand {
	constructor(cameraId, adjustmentDomain, properties) {
		super(properties)
		this.cameraId = cameraId
		this.adjustmentDomain = adjustmentDomain
	}
	static parseColorComponents(rawCommand) {
		return {
			red: rawCommand.readInt16BE(16),
			green: rawCommand.readInt16BE(18),
			blue: rawCommand.readInt16BE(20),
			yellow: rawCommand.readInt16BE(22)
		}
	}
	static deepMerge(target, source) {
		for (const key of Object.keys(source)) {
			if (source[key] instanceof Object)
				Object.assign(source[key], CameraControlUpdateCommand.deepMerge(target[key], source[key]))
		}
		Object.assign(target || {}, source)
		return target
	}
	static deserializeLensProperties(rawCommand) {
		const properties = {}
		const adjustmentFeature = rawCommand.readUInt8(2)
		if (adjustmentFeature === CameraControlLensAdjustment.Zoom)
			properties.lens = { zoomSpeed: rawCommand.readInt16BE(16) }
		if (adjustmentFeature === CameraControlLensAdjustment.Iris)
			properties.lens = { iris: rawCommand.readInt16BE(16) }
		if (adjustmentFeature === CameraControlLensAdjustment.Focus)
			properties.lens = { focus: rawCommand.readInt16BE(16) }
		// if (adjustmentFeature === CameraControlLensAdjustment.AutoFocus) // not sure about that one
		//   properties.lens?.autoFocus = rawCommand.readInt16BE(16);
		return properties
	}
	static deserializeCameraProperties(rawCommand) {
		const properties = {}
		const adjustmentFeature = rawCommand.readUInt8(2)
		if (adjustmentFeature === CameraControlCameraAdjustment.Gain)
			properties.camera = { gain: rawCommand.readInt16BE(16) }
		if (adjustmentFeature === CameraControlCameraAdjustment.Shutter)
			properties.camera = { shutter: rawCommand.readInt16BE(18) } // Uhm ok ?
		if (adjustmentFeature === CameraControlCameraAdjustment.WhiteBalance)
			properties.camera = { whiteBalance: rawCommand.readInt16BE(16) }
		return properties
	}
	static deserializeChipProperties(rawCommand) {
		const properties = {}
		const adjustmentFeature = rawCommand.readUInt8(2)
		if (adjustmentFeature === CameraControlChipAdjustment.Gain)
			properties.chip = { gain: CameraControlUpdateCommand.parseColorComponents(rawCommand) }
		if (adjustmentFeature === CameraControlChipAdjustment.Gamma)
			properties.chip = { gamma: CameraControlUpdateCommand.parseColorComponents(rawCommand) }
		if (adjustmentFeature === CameraControlChipAdjustment.Lift)
			properties.chip = { lift: CameraControlUpdateCommand.parseColorComponents(rawCommand) }
		if (adjustmentFeature === CameraControlChipAdjustment.HueSaturation)
			properties.chip = { hue: rawCommand.readInt16BE(16), saturation: rawCommand.readInt16BE(18) }
		if (adjustmentFeature === CameraControlChipAdjustment.Lum) properties.chip = { lum: rawCommand.readInt16BE(16) }
		if (adjustmentFeature === CameraControlChipAdjustment.Aperture)
			properties.chip = { aperture: rawCommand.readInt16BE(16) }
		if (adjustmentFeature === CameraControlChipAdjustment.Contrast)
			properties.chip = { contrast: rawCommand.readInt16BE(16) }
		return properties
	}
	static deserialize(rawCommand) {
		const cameraId = rawCommand.readUInt8(0)
		const adjustmentDomain = rawCommand.readUInt8(1)
		const relative = rawCommand.readUInt8(3)
		// Lets not handle relative for now
		if (relative) new CameraControlUpdateCommand(cameraId, adjustmentDomain, {})
		let properties = {}
		if (adjustmentDomain == CameraControlAdjustmentDomain.Lens)
			properties = CameraControlUpdateCommand.deserializeLensProperties(rawCommand)
		if (adjustmentDomain == CameraControlAdjustmentDomain.Camera)
			properties = CameraControlUpdateCommand.deserializeCameraProperties(rawCommand)
		if (adjustmentDomain == CameraControlAdjustmentDomain.Chip)
			properties = CameraControlUpdateCommand.deserializeChipProperties(rawCommand)
		return new CameraControlUpdateCommand(cameraId, adjustmentDomain, properties)
	}
	applyToState(state) {
		if (!state.cameras) state.cameras = {}
		if (!state.cameras[this.cameraId]) state.cameras[this.cameraId] = { camera: {}, chip: {}, lens: {} }
		if (this.adjustmentDomain == CameraControlAdjustmentDomain.Camera)
			// @ts-ignore
			CameraControlUpdateCommand.deepMerge(state.cameras[this.cameraId].camera, this.properties.camera)
		if (this.adjustmentDomain == CameraControlAdjustmentDomain.Chip)
			// @ts-ignore
			CameraControlUpdateCommand.deepMerge(state.cameras[this.cameraId].chip, this.properties.chip)
		if (this.adjustmentDomain == CameraControlAdjustmentDomain.Lens)
			// @ts-ignore
			CameraControlUpdateCommand.deepMerge(state.cameras[this.cameraId].lens, this.properties.lens)
		return `cameras.${this.cameraId}.${this.adjustmentDomain}`
	}
}
exports.CameraControlUpdateCommand = CameraControlUpdateCommand
CameraControlUpdateCommand.rawName = 'CCmd'
var CameraControlAdjustmentDomain
;(function(CameraControlAdjustmentDomain) {
	CameraControlAdjustmentDomain[(CameraControlAdjustmentDomain['Lens'] = 0)] = 'Lens'
	CameraControlAdjustmentDomain[(CameraControlAdjustmentDomain['Camera'] = 1)] = 'Camera'
	CameraControlAdjustmentDomain[(CameraControlAdjustmentDomain['Chip'] = 8)] = 'Chip'
})(
	(CameraControlAdjustmentDomain =
		exports.CameraControlAdjustmentDomain || (exports.CameraControlAdjustmentDomain = {}))
)
var CameraControlLensAdjustment
;(function(CameraControlLensAdjustment) {
	CameraControlLensAdjustment[(CameraControlLensAdjustment['Focus'] = 0)] = 'Focus'
	CameraControlLensAdjustment[(CameraControlLensAdjustment['AutoFocus'] = 1)] = 'AutoFocus'
	CameraControlLensAdjustment[(CameraControlLensAdjustment['Iris'] = 3)] = 'Iris'
	CameraControlLensAdjustment[(CameraControlLensAdjustment['Zoom'] = 9)] = 'Zoom'
})((CameraControlLensAdjustment = exports.CameraControlLensAdjustment || (exports.CameraControlLensAdjustment = {})))
var CameraControlCameraAdjustment
;(function(CameraControlCameraAdjustment) {
	CameraControlCameraAdjustment[(CameraControlCameraAdjustment['Gain'] = 1)] = 'Gain'
	CameraControlCameraAdjustment[(CameraControlCameraAdjustment['WhiteBalance'] = 2)] = 'WhiteBalance'
	CameraControlCameraAdjustment[(CameraControlCameraAdjustment['Shutter'] = 5)] = 'Shutter'
})(
	(CameraControlCameraAdjustment =
		exports.CameraControlCameraAdjustment || (exports.CameraControlCameraAdjustment = {}))
)
var CameraControlChipAdjustment
;(function(CameraControlChipAdjustment) {
	CameraControlChipAdjustment[(CameraControlChipAdjustment['Lift'] = 0)] = 'Lift'
	CameraControlChipAdjustment[(CameraControlChipAdjustment['Gamma'] = 1)] = 'Gamma'
	CameraControlChipAdjustment[(CameraControlChipAdjustment['Gain'] = 2)] = 'Gain'
	CameraControlChipAdjustment[(CameraControlChipAdjustment['Aperture'] = 3)] = 'Aperture'
	CameraControlChipAdjustment[(CameraControlChipAdjustment['Contrast'] = 4)] = 'Contrast'
	CameraControlChipAdjustment[(CameraControlChipAdjustment['Lum'] = 5)] = 'Lum'
	CameraControlChipAdjustment[(CameraControlChipAdjustment['HueSaturation'] = 6)] = 'HueSaturation'
})((CameraControlChipAdjustment = exports.CameraControlChipAdjustment || (exports.CameraControlChipAdjustment = {})))
//# sourceMappingURL=CameraControlCommand.js.map
