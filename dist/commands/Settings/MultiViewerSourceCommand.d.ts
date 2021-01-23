/// <reference types="node" />
import { BasicWritableCommand, DeserializedCommand } from '../CommandBase';
import { AtemState } from '../../state';
import { MultiViewerSourceState } from '../../state/settings';
import { OmitReadonly } from '../../lib/types';
export declare class MultiViewerSourceCommand extends BasicWritableCommand<OmitReadonly<MultiViewerSourceState>> {
    static readonly rawName = "CMvI";
    readonly multiViewerId: number;
    constructor(multiviewerId: number, windowIndex: number, source: number);
    serialize(): Buffer;
}
export declare class MultiViewerSourceUpdateCommand extends DeserializedCommand<MultiViewerSourceState> {
    static readonly rawName = "MvIn";
    readonly multiViewerId: number;
    constructor(multiviewerId: number, properties: MultiViewerSourceState);
    static deserialize(rawCommand: Buffer): MultiViewerSourceUpdateCommand;
    applyToState(state: AtemState): string;
}
