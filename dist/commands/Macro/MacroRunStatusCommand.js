"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
class MacroRunStatusCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'MRPr';
    }
    deserialize(rawCommand) {
        this.properties = {
            isRunning: Boolean(rawCommand[0] & 1 << 0),
            isWaiting: Boolean(rawCommand[0] & 1 << 1),
            loop: Boolean(rawCommand[1] & 1 << 0),
            macroIndex: rawCommand.readUInt16BE(2)
        };
    }
    applyToState(state) {
        state.macroPlayer = Object.assign({}, state.macroPlayer, this.properties);
    }
}
exports.MacroRunStatusCommand = MacroRunStatusCommand;
//# sourceMappingURL=MacroRunStatusCommand.js.map