"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const atemUtil_1 = require("./lib/atemUtil");
const atemSocketChild_1 = require("./lib/atemSocketChild");
const singleton = new atemSocketChild_1.AtemSocketChild();
process.on('message', message => {
    if (typeof message !== 'object') {
        return;
    }
    if (typeof message.cmd !== 'string' || message.cmd.length <= 0) {
        return;
    }
    const payload = message.payload;
    switch (message.cmd) {
        case enums_1.IPCMessageType.Connect:
            singleton.connect(payload.address, payload.port);
            break;
        case enums_1.IPCMessageType.Disconnect:
            singleton.disconnect().catch(() => { });
            break;
        case enums_1.IPCMessageType.OutboundCommand:
            singleton._sendCommand(Buffer.from(payload.data.data), payload.trackingId);
            break;
    }
});
singleton.on(enums_1.IPCMessageType.Disconnect, () => {
    sendParentMessage({
        cmd: enums_1.IPCMessageType.Disconnect
    });
});
singleton.on(enums_1.IPCMessageType.Log, (message) => {
    sendParentMessage({
        cmd: enums_1.IPCMessageType.Log,
        payload: message
    });
});
singleton.on(enums_1.IPCMessageType.InboundCommand, (packet, remotePacketId) => {
    sendParentMessage({
        cmd: enums_1.IPCMessageType.InboundCommand,
        payload: {
            packet,
            remotePacketId
        }
    });
});
singleton.on(enums_1.IPCMessageType.CommandAcknowledged, (commandId, trackingId) => {
    sendParentMessage({
        cmd: enums_1.IPCMessageType.CommandAcknowledged,
        payload: {
            commandId,
            trackingId
        }
    });
});
function sendParentMessage(message) {
    atemUtil_1.Util.sendIPCMessage(global, 'process', message, singleton.log).catch(() => { });
}
//# sourceMappingURL=socket-child.js.map