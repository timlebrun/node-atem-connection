/// <reference types="node" />
import { BasicWritableCommand, DeserializedCommand } from '../CommandBase';
import { MultiViewerSourceState } from '../../state/settings';
import { OmitReadonly } from '../../lib/types';
import { AtemState } from '../../state';
import { CameraColorComponents, CameraState } from '../../state/camera';
export declare class CameraControlCommand extends BasicWritableCommand<OmitReadonly<MultiViewerSourceState>> {
    static readonly rawName = "CCdP";
    readonly multiViewerId: number;
    constructor(multiviewerId: number, windowIndex: number, source: number);
    serialize(): Buffer;
}
export declare class CameraControlUpdateCommand extends DeserializedCommand<Partial<CameraState>> {
    readonly cameraId: number;
    readonly adjustmentDomain: CameraControlAdjustmentDomain;
    static readonly rawName = "CCmd";
    constructor(cameraId: number, adjustmentDomain: CameraControlAdjustmentDomain, properties: Partial<CameraState>);
    static parseColorComponents(rawCommand: Buffer): CameraColorComponents;
    static deepMerge(target: any, source: any): any;
    static deserializeLensProperties(rawCommand: Buffer): Partial<CameraState>;
    static deserializeCameraProperties(rawCommand: Buffer): Partial<CameraState>;
    static deserializeChipProperties(rawCommand: Buffer): Partial<CameraState>;
    static deserialize(rawCommand: Buffer): CameraControlUpdateCommand;
    applyToState(state: AtemState): string;
}
export declare enum CameraControlAdjustmentDomain {
    Lens = 0,
    Camera = 1,
    Chip = 8
}
export declare enum CameraControlLensAdjustment {
    Focus = 0,
    AutoFocus = 1,
    Iris = 3,
    Zoom = 9
}
export declare enum CameraControlCameraAdjustment {
    Gain = 1,
    WhiteBalance = 2,
    Shutter = 5
}
export declare enum CameraControlChipAdjustment {
    Lift = 0,
    Gamma = 1,
    Gain = 2,
    Aperture = 3,
    Contrast = 4,
    Lum = 5,
    HueSaturation = 6
}
