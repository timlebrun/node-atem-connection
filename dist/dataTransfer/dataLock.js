"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const dataTransferClip_1 = require("./dataTransferClip");
class DataLock {
    constructor(storeId, commandQueue) {
        this.queue = [];
        this.commandQueue = [];
        this.storeId = storeId;
        this.commandQueue = commandQueue;
    }
    enqueue(transfer) {
        this.queue.push(transfer);
        if (!this.transfer) {
            this.dequeueAndRun();
        }
    }
    dequeueAndRun() {
        if (this.transfer === undefined && this.queue.length > 0) {
            this.transfer = this.queue.shift();
            if (this.state === 1) {
                this.lockObtained();
            }
            else {
                // obtain lock
                const command = new __1.Commands.LockStateCommand();
                command.updateProps({
                    index: this.storeId,
                    locked: true
                });
                this.commandQueue.push(command);
            }
        }
        else if (this.transfer) {
            this.transfer.fail(new Error('Tried to run next transfer, but one was still in-progress'));
        }
    }
    lockObtained() {
        this.state = 1;
        if (this.transfer && this.transfer.state === __1.Enums.TransferState.Queued) {
            this.transfer.gotLock();
        }
    }
    lostLock() {
        this.state = 0;
        if (this.transfer && this.transfer.state === __1.Enums.TransferState.Finished) {
            this.transfer.finish(this.transfer);
        }
        else if (this.transfer) {
            // @todo: dequeue any old commands
            this.transfer.fail(new Error('Lost lock mid-transfer'));
        }
        this.transfer = undefined;
        this.dequeueAndRun();
    }
    updateLock(locked) {
        this.state = locked ? 1 : 0;
    }
    transferFinished() {
        if (this.queue.length > 0) {
            this.dequeueAndRun();
        }
        else { // unlock
            const command = new __1.Commands.LockStateCommand();
            command.updateProps({
                index: this.storeId,
                locked: false
            });
            this.commandQueue.push(command);
        }
    }
    transferErrored(code) {
        if (this.transfer) {
            if (code === 1) {
                if (this.transfer instanceof dataTransferClip_1.default) {
                    // Retry the last frame.
                    this.transfer.frames[this.transfer.curFrame].start();
                }
                else {
                    // Retry the entire transfer.
                    this.transfer.start();
                }
            }
            else {
                // Abort the transfer.
                // @todo: dequeue any old commands
                this.transfer.fail(new Error(`Code ${code}`));
                this.transfer = undefined;
                this.dequeueAndRun();
            }
        }
        else {
            this.transfer = undefined;
            this.dequeueAndRun();
        }
    }
}
exports.default = DataLock;
//# sourceMappingURL=dataLock.js.map