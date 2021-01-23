/// <reference types="node" />
import * as Enums from '../enums';
import * as bigInt from 'big-integer';
export declare function bufToBase64String(buffer: Buffer, start: number, length: number): string;
export declare function bufToNullTerminatedString(buffer: Buffer, start: number, length: number): string;
export declare function bufToBigInt(buffer: Buffer, start: number): bigInt.BigInteger;
export declare function bigIntToBuf(buffer: Buffer, val: bigInt.BigInteger, start: number): void;
export declare const COMMAND_CONNECT_HELLO: Buffer;
/**
 * @todo: BALTE - 2018-5-24:
 * Create util functions that handle proper colour spaces in UHD.
 */
export declare function convertRGBAToYUV422(width: number, height: number, data: Buffer): Buffer;
export interface VideoModeInfo {
    width: number;
    height: number;
}
export declare function getVideoModeInfo(videoMode: Enums.VideoMode): VideoModeInfo | undefined;
export declare function convertWAVToRaw(inputBuffer: Buffer): Buffer;
export declare function UInt16BEToDecibel(input: number): number;
export declare function DecibelToUInt16BE(input: number): number;
export declare function IntToBalance(input: number): number;
export declare function BalanceToInt(input: number): number;
export declare function padToMultiple4(val: number): number;
export declare function getComponents(val: number): number[];
export declare function commandStringify(command: any): string;
