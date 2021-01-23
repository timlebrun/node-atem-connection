import * as Enum from '../../enums';
export interface UpstreamKeyerBase extends UpstreamKeyerTypeSettings {
    readonly upstreamKeyerId: number;
    readonly canFlyKey: boolean;
    fillSource: number;
    cutSource: number;
}
export interface UpstreamKeyerTypeSettings {
    mixEffectKeyType: Enum.MixEffectKeyType;
    flyEnabled: boolean;
}
export interface UpstreamKeyerMaskSettings {
    maskEnabled: boolean;
    maskTop: number;
    maskBottom: number;
    maskLeft: number;
    maskRight: number;
}
export interface UpstreamKeyerDVEBase extends UpstreamKeyerMaskSettings {
    sizeX: number;
    sizeY: number;
    positionX: number;
    positionY: number;
    rotation: number;
    borderOuterWidth: number;
    borderInnerWidth: number;
    borderOuterSoftness: number;
    borderInnerSoftness: number;
    borderBevelSoftness: number;
    borderBevelPosition: number;
    borderOpacity: number;
    borderHue: number;
    borderSaturation: number;
    borderLuma: number;
    lightSourceDirection: number;
    lightSourceAltitude: number;
}
export interface UpstreamKeyerDVESettings extends UpstreamKeyerDVEBase {
    borderEnabled: boolean;
    shadowEnabled: boolean;
    borderBevel: Enum.BorderBevel;
    rate: number;
}
export interface UpstreamKeyerFlyKeyframe extends Omit<UpstreamKeyerDVEBase, 'maskEnabled'> {
    readonly keyFrameId: number;
}
export interface UpstreamKeyerChromaSettings {
    hue: number;
    gain: number;
    ySuppress: number;
    lift: number;
    narrow: boolean;
}
export interface UpstreamKeyerLumaSettings {
    preMultiplied: boolean;
    clip: number;
    gain: number;
    invert: boolean;
}
export interface UpstreamKeyerPatternSettings {
    style: Enum.Pattern;
    size: number;
    symmetry: number;
    softness: number;
    positionX: number;
    positionY: number;
    invert: boolean;
}
export interface UpstreamKeyerFlySettings {
    readonly isASet: boolean;
    readonly isBSet: boolean;
    readonly isAtKeyFrame: Enum.IsAtKeyFrame;
    readonly runToInfiniteIndex: number;
}
export interface UpstreamKeyer extends UpstreamKeyerBase {
    dveSettings?: UpstreamKeyerDVESettings;
    chromaSettings?: UpstreamKeyerChromaSettings;
    lumaSettings?: UpstreamKeyerLumaSettings;
    patternSettings?: UpstreamKeyerPatternSettings;
    flyKeyframes: [UpstreamKeyerFlyKeyframe | undefined, UpstreamKeyerFlyKeyframe | undefined];
    flyProperties?: UpstreamKeyerFlySettings;
    maskSettings: UpstreamKeyerMaskSettings;
    onAir: boolean;
}
