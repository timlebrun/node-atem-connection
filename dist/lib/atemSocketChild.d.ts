/// <reference types="node" />
export declare enum ConnectionState {
    Closed = 0,
    SynSent = 1,
    Established = 2
}
export declare enum PacketFlag {
    AckRequest = 1,
    NewSessionId = 2,
    IsRetransmit = 4,
    RetransmitRequest = 8,
    AckReply = 16
}
export declare class AtemSocketChild {
    private readonly _debugBuffers;
    private _connectionState;
    private _reconnectTimer;
    private _retransmitTimer;
    private _nextSendPacketId;
    private _sessionId;
    private _address;
    private _port;
    private _socket;
    private _lastReceivedAt;
    private _lastReceivedPacketId;
    private _inFlight;
    private readonly _ackTimer;
    private _ackTimerRunning;
    private _receivedWithoutAck;
    private readonly onDisconnect;
    private readonly onLog;
    private readonly onCommandsReceived;
    private readonly onCommandsAcknowledged;
    constructor(options: {
        address: string;
        port: number;
        debugBuffers: boolean;
    }, onDisconnect: () => Promise<void>, onLog: (message: string) => Promise<void>, onCommandReceived: (payload: Buffer, packetId: number) => Promise<void>, onCommandAcknowledged: (ids: Array<{
        packetId: number;
        trackingId: number;
    }>) => Promise<void>);
    private startTimers;
    connect(address: string, port: number): Promise<void>;
    disconnect(): Promise<void>;
    private restartConnection;
    private log;
    sendCommands(commands: Array<{
        payload: number[];
        rawName: string;
        trackingId: number;
    }>): void;
    private sendCommand;
    private _createSocket;
    private _isPacketCoveredByAck;
    private _receivePacket;
    private _sendPacket;
    private _sendOrQueueAck;
    private _sendAck;
    private _retransmitFrom;
    private _checkForRetransmit;
}
