import { FairlightAudioMixOption, FairlightInputConfiguration, FairlightAnalogInputLevel, FairlightAudioSourceType, ExternalPortType, FairlightInputType } from '../enums';
export interface FairlightAudioSource {
    properties?: FairlightAudioSourceProperties;
}
export interface FairlightAudioSourceProperties {
    readonly sourceType: FairlightAudioSourceType;
    readonly maxFramesDelay: number;
    framesDelay: number;
    gain: number;
    readonly hasStereoSimulation: boolean;
    stereoSimulation: number;
    readonly equalizerBands: number;
    equalizerEnabled: boolean;
    equalizerGain: number;
    makeUpGain: number;
    balance: number;
    faderGain: number;
    readonly supportedMixOptions: FairlightAudioMixOption[];
    mixOption: FairlightAudioMixOption;
}
export interface FairlightAudioInput {
    properties?: FairlightAudioInputProperties;
    sources: {
        [sourceId: string]: FairlightAudioSource | undefined;
    };
}
export interface FairlightAudioInputProperties {
    readonly inputType: FairlightInputType;
    readonly externalPortType: ExternalPortType;
    readonly supportedConfigurations: FairlightInputConfiguration[];
    activeConfiguration: FairlightInputConfiguration;
    readonly supportedInputLevels: FairlightAnalogInputLevel[];
    activeInputLevel: FairlightAnalogInputLevel;
}
export interface AtemFairlightAudioState {
    inputs: {
        [input: number]: FairlightAudioInput | undefined;
    };
}
