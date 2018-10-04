/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class AtemSocketChild extends EventEmitter {
    private _connectionState;
    private _debug;
    private _reconnectTimer;
    private _retransmitTimer;
    private _localPacketId;
    private _maxPacketID;
    private _sessionId;
    private _address;
    private _port;
    private _socket;
    private _reconnectInterval;
    private _inFlightTimeout;
    private _maxRetries;
    private _lastReceivedAt;
    private _inFlight;
    constructor(options?: {
        address?: string;
        port?: number;
    });
    connect(address?: string, port?: number): void;
    disconnect(): Promise<{}>;
    log(...args: any[]): void;
    readonly nextPacketId: number;
    _sendCommand(serializedCommand: Buffer, trackingId: number): void;
    private _createSocket();
    private _receivePacket(packet, rinfo);
    private _sendPacket(packet);
    private _sendAck(packetId);
    private _checkForRetransmit();
}
