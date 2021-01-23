/// <reference types="node" />
import { EventEmitter } from 'eventemitter3';
import { AtemState } from './state';
import { ISerializableCommand, IDeserializedCommand } from './commands/CommandBase';
import * as Commands from './commands';
import { MediaPlayer, MediaPlayerSource } from './state/media';
import { MultiViewerSourceState } from './state/settings';
import { DipTransitionSettings, DVETransitionSettings, MixTransitionSettings, StingerTransitionSettings, SuperSource, TransitionProperties, WipeTransitionSettings } from './state/video';
import * as USK from './state/video/upstreamKeyers';
import { InputChannel } from './state/input';
import { DownstreamKeyerGeneral, DownstreamKeyerMask } from './state/video/downstreamKeyers';
import * as DT from './dataTransfer';
import * as Enums from './enums';
import { AudioChannel, AudioMasterChannel } from './state/audio';
import DataTransfer from './dataTransfer/dataTransfer';
import { RecordingStateProperties } from './state/recording';
import { OmitReadonly } from './lib/types';
import { StreamingServiceProperties } from './state/streaming';
export interface AtemOptions {
    address?: string;
    port?: number;
    debugBuffers?: boolean;
    disableMultithreaded?: boolean;
    childProcessTimeout?: number;
}
export declare type AtemEvents = {
    error: [string];
    info: [string];
    debug: [string];
    connected: [];
    disconnected: [];
    stateChanged: [AtemState, string[]];
    receivedCommands: [IDeserializedCommand[]];
};
export declare enum AtemConnectionStatus {
    CLOSED = 0,
    CONNECTING = 1,
    CONNECTED = 2
}
export declare const DEFAULT_PORT = 9910;
export declare class BasicAtem extends EventEmitter<AtemEvents> {
    private readonly socket;
    protected readonly dataTransferManager: DT.DataTransferManager;
    private _state;
    private _sentQueue;
    private _status;
    constructor(options?: AtemOptions);
    private _onInitComplete;
    readonly status: AtemConnectionStatus;
    readonly state: Readonly<AtemState> | undefined;
    connect(address: string, port?: number): Promise<void>;
    disconnect(): Promise<void>;
    destroy(): Promise<void>;
    private sendCommands;
    sendCommand(command: ISerializableCommand): Promise<void>;
    private _mutateState;
    private _resolveCommands;
    private _rejectAllCommands;
}
export declare class Atem extends BasicAtem {
    constructor(options?: AtemOptions);
    changeProgramInput(input: number, me?: number): Promise<void>;
    changePreviewInput(input: number, me?: number): Promise<void>;
    cut(me?: number): Promise<void>;
    autoTransition(me?: number): Promise<void>;
    fadeToBlack(me?: number): Promise<void>;
    setFadeToBlackRate(rate: number, me?: number): Promise<void>;
    autoDownstreamKey(key?: number, isTowardsOnAir?: boolean): Promise<void>;
    setDipTransitionSettings(newProps: Partial<DipTransitionSettings>, me?: number): Promise<void>;
    setDVETransitionSettings(newProps: Partial<DVETransitionSettings>, me?: number): Promise<void>;
    setMixTransitionSettings(newProps: Pick<MixTransitionSettings, 'rate'>, me?: number): Promise<void>;
    setTransitionPosition(position: number, me?: number): Promise<void>;
    previewTransition(on: boolean, me?: number): Promise<void>;
    setTransitionStyle(newProps: Partial<OmitReadonly<TransitionProperties>>, me?: number): Promise<void>;
    setStingerTransitionSettings(newProps: Partial<StingerTransitionSettings>, me?: number): Promise<void>;
    setWipeTransitionSettings(newProps: Partial<WipeTransitionSettings>, me?: number): Promise<void>;
    setAuxSource(source: number, bus?: number): Promise<void>;
    setDownstreamKeyTie(tie: boolean, key?: number): Promise<void>;
    setDownstreamKeyOnAir(onAir: boolean, key?: number): Promise<void>;
    setDownstreamKeyCutSource(input: number, key?: number): Promise<void>;
    setDownstreamKeyFillSource(input: number, key?: number): Promise<void>;
    setDownstreamKeyGeneralProperties(props: Partial<DownstreamKeyerGeneral>, key?: number): Promise<void>;
    setDownstreamKeyMaskSettings(props: Partial<DownstreamKeyerMask>, key?: number): Promise<void>;
    setDownstreamKeyRate(rate: number, key?: number): Promise<void>;
    setTime(hour: number, minute: number, second: number, frame: number): Promise<void>;
    requestTime(): Promise<void>;
    macroContinue(): Promise<void>;
    macroDelete(index?: number): Promise<void>;
    macroInsertUserWait(): Promise<void>;
    macroInsertTimedWait(frames: number): Promise<void>;
    macroRun(index?: number): Promise<void>;
    macroStop(): Promise<void>;
    macroStartRecord(index: number, name: string, description: string): Promise<void>;
    macroStopRecord(): Promise<void>;
    macroUpdateProperties(props: Commands.MacroPropertiesCommand['properties'], index?: number): Promise<void>;
    macroSetLoop(loop: boolean): Promise<void>;
    setMultiViewerSource(newProps: OmitReadonly<MultiViewerSourceState>, mv?: number): Promise<void>;
    setMediaPlayerSettings(newProps: Partial<MediaPlayer>, player?: number): Promise<void>;
    setMediaPlayerSource(newProps: Partial<MediaPlayerSource>, player?: number): Promise<void>;
    setMediaClip(index: number, name: string, frames?: number): Promise<void>;
    clearMediaPoolClip(clipId: number): Promise<void>;
    clearMediaPoolStill(stillId: number): Promise<void>;
    setSuperSourceBoxSettings(newProps: Partial<SuperSource.SuperSourceBox>, box?: number, ssrcId?: number): Promise<void>;
    setSuperSourceProperties(newProps: Partial<SuperSource.SuperSourceProperties>, ssrcId?: number): Promise<void>;
    setSuperSourceBorder(newProps: Partial<SuperSource.SuperSourceBorder>, ssrcId?: number): Promise<void>;
    setInputSettings(newProps: Partial<OmitReadonly<InputChannel>>, input?: number): Promise<void>;
    setUpstreamKeyerChromaSettings(newProps: Partial<USK.UpstreamKeyerChromaSettings>, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerCutSource(cutSource: number, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerFillSource(fillSource: number, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerDVESettings(newProps: Partial<USK.UpstreamKeyerDVESettings>, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerLumaSettings(newProps: Partial<USK.UpstreamKeyerLumaSettings>, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerMaskSettings(newProps: Partial<USK.UpstreamKeyerMaskSettings>, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerPatternSettings(newProps: Partial<USK.UpstreamKeyerPatternSettings>, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerOnAir(onAir: boolean, me?: number, keyer?: number): Promise<void>;
    setUpstreamKeyerType(newProps: Partial<USK.UpstreamKeyerTypeSettings>, me?: number, keyer?: number): Promise<void>;
    uploadStill(index: number, data: Buffer, name: string, description: string): Promise<DataTransfer>;
    uploadClip(index: number, frames: Array<Buffer>, name: string): Promise<DataTransfer>;
    uploadAudio(index: number, data: Buffer, name: string): Promise<DataTransfer>;
    setAudioMixerInputMixOption(index: number, mixOption: Enums.AudioMixOption): Promise<void>;
    setAudioMixerInputGain(index: number, gain: number): Promise<void>;
    setAudioMixerInputBalance(index: number, balance: number): Promise<void>;
    setAudioMixerInputProps(index: number, props: Partial<OmitReadonly<AudioChannel>>): Promise<void>;
    setAudioMixerMasterGain(gain: number): Promise<void>;
    setAudioMixerMasterProps(props: Partial<AudioMasterChannel>): Promise<void>;
    setFairlightAudioMixerInputProps(index: number, props: Commands.FairlightMixerInputCommand['properties']): Promise<void>;
    setFairlightAudioMixerSourceProps(index: number, source: string, props: Commands.FairlightMixerSourceCommand['properties']): Promise<void>;
    startStreaming(): Promise<void>;
    stopStreaming(): Promise<void>;
    requestStreamingDuration(): Promise<void>;
    setStreamingService(props: Partial<StreamingServiceProperties>): Promise<void>;
    startRecording(): Promise<void>;
    stopRecording(): Promise<void>;
    requestRecordingDuration(): Promise<void>;
    switchRecordingDisk(): Promise<void>;
    setRecordingSettings(props: Partial<RecordingStateProperties>): Promise<void>;
    listVisibleInputs(mode: 'program' | 'preview', me?: number): number[];
}
