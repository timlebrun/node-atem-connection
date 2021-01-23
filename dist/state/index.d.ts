import { DeviceInfo } from './info';
import { AtemVideoState } from './video';
import { AtemClassicAudioState } from './audio';
import { MediaState } from './media';
import { InputChannel } from './input';
import { MacroState } from './macro';
import { SettingsState } from './settings';
import { RecordingState } from './recording';
import { StreamingState } from './streaming';
import { AtemFairlightAudioState } from './fairlight';
import * as AtemStateUtil from './util';
import { CameraState } from './camera';
export { AtemStateUtil };
export interface AtemState {
    info: DeviceInfo;
    video: AtemVideoState;
    audio?: AtemClassicAudioState;
    fairlight?: AtemFairlightAudioState;
    media: MediaState;
    inputs: {
        [inputId: number]: InputChannel | undefined;
    };
    cameras?: {
        [inputId: number]: CameraState | undefined;
    };
    macro: MacroState;
    settings: SettingsState;
    recording?: RecordingState;
    streaming?: StreamingState;
}
export declare class InvalidIdError extends Error {
    constructor(message: string, ...ids: number[]);
    private static BuildErrorString;
}
