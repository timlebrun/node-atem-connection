import { BasicWritableCommand, DeserializedCommand } from '../CommandBase'
import { MultiViewerSourceState } from '../../state/settings'
import { OmitReadonly } from '../../lib/types'
import { AtemState } from '../../state'

import { CameraColorComponents, CameraState } from '../../state/camera'

export class CameraControlCommand extends BasicWritableCommand<OmitReadonly<MultiViewerSourceState>> {
	public static readonly rawName = 'CCdP'

	public readonly multiViewerId: number

	constructor(multiviewerId: number, windowIndex: number, source: number) {
		super({ windowIndex, source })

		this.multiViewerId = multiviewerId
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.multiViewerId, 0)
		buffer.writeUInt8(this.properties.windowIndex || 0, 1)
		buffer.writeUInt16BE(this.properties.source || 0, 2)
		return buffer
	}
}

export class CameraControlUpdateCommand extends DeserializedCommand<Partial<CameraState>> {
	public static readonly rawName = 'CCmd'

	constructor(
    public readonly cameraId: number,
    public readonly adjustmentDomain: CameraControlAdjustmentDomain,
    properties: Partial<CameraState>,
  ) {
		super(properties)
	}

  public static parseColorComponents(rawCommand: Buffer): CameraColorComponents {
    return {
      red: rawCommand.readInt16BE(16),
      green: rawCommand.readInt16BE(18),
      blue: rawCommand.readInt16BE(20),
      yellow: rawCommand.readInt16BE(22),
    }
  }

  public static deepMerge(target: any, source: any) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object)
        Object.assign(
          source[key],
          CameraControlUpdateCommand.deepMerge(target[key], source[key])
        )
    }

    Object.assign(target || {}, source)
    return target
  }

  public static deserializeLensProperties(rawCommand: Buffer) {
    const properties: Partial<CameraState> = {};
    const adjustmentFeature = rawCommand.readUInt8(2) as CameraControlLensAdjustment;

    if (adjustmentFeature === CameraControlLensAdjustment.Zoom)
      properties.lens = { zoomSpeed: rawCommand.readInt16BE(16) };

    if (adjustmentFeature === CameraControlLensAdjustment.Iris)
      properties.lens = { iris: rawCommand.readInt16BE(16) };

    if (adjustmentFeature === CameraControlLensAdjustment.Focus)
      properties.lens = { focus: rawCommand.readInt16BE(16) };

    // if (adjustmentFeature === CameraControlLensAdjustment.AutoFocus) // not sure about that one
    //   properties.lens?.autoFocus = rawCommand.readInt16BE(16);

    return properties;
  }

  public static deserializeCameraProperties(rawCommand: Buffer) {
    const properties: Partial<CameraState> = {};
    const adjustmentFeature = rawCommand.readUInt8(2) as CameraControlCameraAdjustment;

    if (adjustmentFeature === CameraControlCameraAdjustment.Gain)
      properties.camera = { gain: rawCommand.readInt16BE(16) };

    if (adjustmentFeature === CameraControlCameraAdjustment.Shutter)
      properties.camera = { shutter: rawCommand.readInt16BE(18) } // Uhm ok ?

    if (adjustmentFeature === CameraControlCameraAdjustment.WhiteBalance)
      properties.camera = { whiteBalance: rawCommand.readInt16BE(16) };

    return properties;
  }

  public static deserializeChipProperties(rawCommand: Buffer) {
    const properties: Partial<CameraState> = {};
    const adjustmentFeature = rawCommand.readUInt8(2) as CameraControlChipAdjustment;

    if (adjustmentFeature === CameraControlChipAdjustment.Gain)
      properties.chip = { gain: CameraControlUpdateCommand.parseColorComponents(rawCommand) };

    if (adjustmentFeature === CameraControlChipAdjustment.Gamma)
      properties.chip = { gamma: CameraControlUpdateCommand.parseColorComponents(rawCommand) };

    if (adjustmentFeature === CameraControlChipAdjustment.Lift)
      properties.chip = { lift: CameraControlUpdateCommand.parseColorComponents(rawCommand) };
    
    if (adjustmentFeature === CameraControlChipAdjustment.HueSaturation)
      properties.chip = { hue: rawCommand.readInt16BE(16), saturation: rawCommand.readInt16BE(18) };

    if (adjustmentFeature === CameraControlChipAdjustment.Lum)
      properties.chip = { lum: rawCommand.readInt16BE(16) };

    if (adjustmentFeature === CameraControlChipAdjustment.Aperture)
      properties.chip = { aperture: rawCommand.readInt16BE(16) };

    if (adjustmentFeature === CameraControlChipAdjustment.Contrast)
      properties.chip = { contrast: rawCommand.readInt16BE(16) };

    return properties;
  }

	public static deserialize(rawCommand: Buffer): CameraControlUpdateCommand {
		const cameraId = rawCommand.readUInt8(0);
    const adjustmentDomain = rawCommand.readUInt8(1) as CameraControlAdjustmentDomain;
    const relative = rawCommand.readUInt8(3);

    // Lets not handle relative for now
    if (relative) new CameraControlUpdateCommand(cameraId, adjustmentDomain, {});

    let properties: Partial<CameraState> = {};

    if (adjustmentDomain == CameraControlAdjustmentDomain.Lens)
      properties = CameraControlUpdateCommand.deserializeLensProperties(rawCommand);

    if (adjustmentDomain == CameraControlAdjustmentDomain.Camera)
      properties = CameraControlUpdateCommand.deserializeCameraProperties(rawCommand);

    if (adjustmentDomain == CameraControlAdjustmentDomain.Chip)
      properties = CameraControlUpdateCommand.deserializeChipProperties(rawCommand);

		return new CameraControlUpdateCommand(cameraId, adjustmentDomain, properties);
	}

	public applyToState(state: AtemState): string {
    if (!state.cameras) state.cameras = {};
    if (!state.cameras[this.cameraId]) state.cameras[this.cameraId] = { camera: {}, chip: {}, lens: {} };

    if (this.adjustmentDomain == CameraControlAdjustmentDomain.Camera)
      // @ts-ignore
      CameraControlUpdateCommand.deepMerge(state.cameras[this.cameraId].camera, this.properties.camera);

    if (this.adjustmentDomain == CameraControlAdjustmentDomain.Chip)
      // @ts-ignore
      CameraControlUpdateCommand.deepMerge(state.cameras[this.cameraId].chip, this.properties.chip);

    if (this.adjustmentDomain == CameraControlAdjustmentDomain.Lens)
      // @ts-ignore
      CameraControlUpdateCommand.deepMerge(state.cameras[this.cameraId].lens, this.properties.lens);
    
		return `cameras.${this.cameraId}.${this.adjustmentDomain}`
	}
}

export enum CameraControlAdjustmentDomain {
  Lens = 0,
  Camera = 1,
  Chip = 8,
}

export enum CameraControlLensAdjustment {
  Focus = 0,
  AutoFocus = 1,
  Iris = 3,
  Zoom = 9,
}

export enum CameraControlCameraAdjustment {
  Gain = 1,
  WhiteBalance = 2,
  Shutter = 5,
}

export enum CameraControlChipAdjustment {
  Lift = 0,
  Gamma = 1,
  Gain = 2,
  Aperture = 3,
  Contrast = 4,
  Lum = 5,
  HueSaturation = 6,
}

