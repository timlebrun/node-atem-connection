/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
export declare class MacroRunStatusCommand extends AbstractCommand {
    rawName: string;
    properties: {
        isRunning: boolean;
        isWaiting: boolean;
        loop: boolean;
        macroIndex: number;
    };
    deserialize(rawCommand: Buffer): void;
    applyToState(state: AtemState): void;
}
