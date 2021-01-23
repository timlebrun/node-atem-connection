'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const dgram_1 = require('dgram')
const Util = require('./atemUtil')
const NanoTimer = require('nanotimer')
const IN_FLIGHT_TIMEOUT = 60 // ms
const CONNECTION_TIMEOUT = 5000 // ms
const CONNECTION_RETRY_INTERVAL = 1000 // ms
const MAX_PACKET_RETRIES = 10
const MAX_PACKET_ID = 1 << 15 // Atem expects 15 not 16 bits before wrapping
const MAX_PACKET_PER_ACK = 16
var ConnectionState
;(function(ConnectionState) {
	ConnectionState[(ConnectionState['Closed'] = 0)] = 'Closed'
	ConnectionState[(ConnectionState['SynSent'] = 1)] = 'SynSent'
	ConnectionState[(ConnectionState['Established'] = 2)] = 'Established'
})((ConnectionState = exports.ConnectionState || (exports.ConnectionState = {})))
var PacketFlag
;(function(PacketFlag) {
	PacketFlag[(PacketFlag['AckRequest'] = 1)] = 'AckRequest'
	PacketFlag[(PacketFlag['NewSessionId'] = 2)] = 'NewSessionId'
	PacketFlag[(PacketFlag['IsRetransmit'] = 4)] = 'IsRetransmit'
	PacketFlag[(PacketFlag['RetransmitRequest'] = 8)] = 'RetransmitRequest'
	PacketFlag[(PacketFlag['AckReply'] = 16)] = 'AckReply'
})((PacketFlag = exports.PacketFlag || (exports.PacketFlag = {})))
class AtemSocketChild {
	constructor(options, onDisconnect, onLog, onCommandReceived, onCommandAcknowledged) {
		this._connectionState = ConnectionState.Closed
		this._nextSendPacketId = 1
		this._sessionId = 0
		this._lastReceivedAt = Date.now()
		this._lastReceivedPacketId = 0
		this._inFlight = []
		this._ackTimer = new NanoTimer()
		this._ackTimerRunning = false
		this._receivedWithoutAck = 0
		this._debugBuffers = options.debugBuffers
		this._address = options.address
		this._port = options.port
		this.onDisconnect = onDisconnect
		this.onLog = onLog
		this.onCommandsReceived = onCommandReceived
		this.onCommandsAcknowledged = onCommandAcknowledged
		this._socket = this._createSocket()
	}
	startTimers() {
		if (!this._reconnectTimer) {
			this._reconnectTimer = setInterval(
				() =>
					tslib_1.__awaiter(this, void 0, void 0, function*() {
						if (this._lastReceivedAt + CONNECTION_TIMEOUT > Date.now()) {
							// We heard from the atem recently
							return
						}
						try {
							yield this.restartConnection()
						} catch (e) {
							this.log(`Reconnect failed: ${e}`)
						}
					}),
				CONNECTION_RETRY_INTERVAL
			)
		}
		// Check for retransmits every 10 milliseconds
		if (!this._retransmitTimer) {
			this._retransmitTimer = setInterval(() => this._checkForRetransmit(), 10)
		}
	}
	connect(address, port) {
		this.startTimers()
		this._address = address
		this._port = port
		return this.restartConnection()
	}
	disconnect() {
		// Stop timers, as they just cause pointless work now.
		if (this._retransmitTimer) {
			clearInterval(this._retransmitTimer)
			this._retransmitTimer = undefined
		}
		if (this._reconnectTimer) {
			clearInterval(this._reconnectTimer)
			this._reconnectTimer = undefined
		}
		return new Promise(resolve => {
			try {
				this._socket.close(() => resolve())
			} catch (e) {
				resolve()
			}
		}).then(() => {
			this._connectionState = ConnectionState.Closed
			this._createSocket()
			return this.onDisconnect()
		})
	}
	restartConnection() {
		return tslib_1.__awaiter(this, void 0, void 0, function*() {
			// This includes a 'disconnect'
			if (this._connectionState === ConnectionState.Established) {
				this._connectionState = ConnectionState.Closed
				this._createSocket()
				yield this.onDisconnect()
			}
			// Reset connection
			this._nextSendPacketId = 1
			this._sessionId = 0
			this._inFlight = []
			this.log('reconnect')
			// Try doing reconnect
			this._sendPacket(Util.COMMAND_CONNECT_HELLO)
			this._connectionState = ConnectionState.SynSent
		})
	}
	log(message) {
		// tslint:disable-next-line: no-floating-promises
		this.onLog(message)
	}
	sendCommands(commands) {
		commands.forEach(cmd => {
			this.sendCommand(cmd.payload, cmd.rawName, cmd.trackingId)
		})
	}
	sendCommand(payload, rawName, trackingId) {
		const packetId = this._nextSendPacketId++
		if (this._nextSendPacketId >= MAX_PACKET_ID) this._nextSendPacketId = 0
		const opcode = PacketFlag.AckRequest << 11
		const buffer = Buffer.alloc(20 + payload.length, 0)
		buffer.writeUInt16BE(opcode | (payload.length + 20), 0) // Opcode & Length
		buffer.writeUInt16BE(this._sessionId, 2)
		buffer.writeUInt16BE(packetId, 10)
		// Command
		buffer.writeUInt16BE(payload.length + 8, 12)
		buffer.write(rawName, 16, 4)
		// Body
		Buffer.from(payload).copy(buffer, 20)
		this._sendPacket(buffer)
		this._inFlight.push({
			packetId,
			trackingId,
			lastSent: Date.now(),
			payload: buffer,
			resent: 0
		})
	}
	_createSocket() {
		this._socket = dgram_1.createSocket('udp4')
		this._socket.bind()
		this._socket.on('message', (packet, rinfo) => this._receivePacket(packet, rinfo))
		this._socket.on('error', err =>
			tslib_1.__awaiter(this, void 0, void 0, function*() {
				this.log(`Connection error: ${err}`)
				if (this._connectionState === ConnectionState.Established) {
					// If connection is open, then restart. Otherwise the reconnectTimer will handle it
					yield this.restartConnection()
				}
			})
		)
		return this._socket
	}
	_isPacketCoveredByAck(ackId, packetId) {
		const tolerance = MAX_PACKET_ID / 2
		const pktIsShortlyBefore = packetId < ackId && packetId + tolerance > ackId
		const pktIsShortlyAfter = packetId > ackId && packetId < ackId + tolerance
		const pktIsBeforeWrap = packetId > ackId + tolerance
		return packetId === ackId || ((pktIsShortlyBefore || pktIsBeforeWrap) && !pktIsShortlyAfter)
	}
	_receivePacket(packet, rinfo) {
		return tslib_1.__awaiter(this, void 0, void 0, function*() {
			if (this._debugBuffers) this.log(`RECV ${packet.toString('hex')}`)
			this._lastReceivedAt = Date.now()
			const length = packet.readUInt16BE(0) & 0x07ff
			if (length !== rinfo.size) return
			const flags = packet.readUInt8(0) >> 3
			this._sessionId = packet.readUInt16BE(2)
			const remotePacketId = packet.readUInt16BE(10)
			// Send hello answer packet when receive connect flags
			if (flags & PacketFlag.NewSessionId) {
				this._connectionState = ConnectionState.Established
				this._lastReceivedPacketId = remotePacketId
				this._sendAck(remotePacketId)
				return
			}
			const ps = []
			if (this._connectionState === ConnectionState.Established) {
				// Device asked for retransmit
				if (flags & PacketFlag.RetransmitRequest) {
					const fromPacketId = packet.readUInt16BE(6)
					this.log(`Retransmit request: ${fromPacketId}`)
					ps.push(this._retransmitFrom(fromPacketId))
				}
				// Got a packet that needs an ack
				if (flags & PacketFlag.AckRequest) {
					// Check if it next in the sequence
					if (remotePacketId === (this._lastReceivedPacketId + 1) % MAX_PACKET_ID) {
						this._lastReceivedPacketId = remotePacketId
						this._sendOrQueueAck()
						// It might have commands
						if (length > 12) {
							ps.push(this.onCommandsReceived(packet.slice(12), remotePacketId))
						}
					} else if (this._isPacketCoveredByAck(this._lastReceivedPacketId, remotePacketId)) {
						// We got a retransmit of something we have already acked, so reack it
						this._sendOrQueueAck()
					}
				}
				// Device ack'ed our packet
				if (flags & PacketFlag.AckReply) {
					const ackPacketId = packet.readUInt16BE(4)
					const ackedCommands = []
					this._inFlight = this._inFlight.filter(pkt => {
						if (this._isPacketCoveredByAck(ackPacketId, pkt.packetId)) {
							ackedCommands.push({
								packetId: pkt.packetId,
								trackingId: pkt.trackingId
							})
							return false
						} else {
							// Not acked yet
							return true
						}
					})
					ps.push(this.onCommandsAcknowledged(ackedCommands))
					// this.log(`${Date.now()} Got ack ${ackPacketId} Remaining=${this._inFlight.length}`)
				}
			}
			yield Promise.all(ps)
		})
	}
	_sendPacket(packet) {
		if (this._debugBuffers) this.log(`SEND ${packet.toString('hex')}`)
		this._socket.send(packet, 0, packet.length, this._port, this._address)
	}
	_sendOrQueueAck() {
		this._receivedWithoutAck++
		if (this._receivedWithoutAck >= MAX_PACKET_PER_ACK) {
			this._receivedWithoutAck = 0
			this._ackTimerRunning = false
			this._ackTimer.clearTimeout()
			this._sendAck(this._lastReceivedPacketId)
		} else if (!this._ackTimerRunning) {
			this._ackTimerRunning = true
			// timeout for 5 ms (syntax for nanotimer says m)
			this._ackTimer.setTimeout(
				() => {
					this._receivedWithoutAck = 0
					this._ackTimerRunning = false
					this._sendAck(this._lastReceivedPacketId)
				},
				[],
				'5m'
			)
		}
	}
	_sendAck(packetId) {
		const opcode = PacketFlag.AckReply << 11
		const length = 12
		const buffer = Buffer.alloc(length, 0)
		buffer.writeUInt16BE(opcode | length, 0)
		buffer.writeUInt16BE(this._sessionId, 2)
		buffer.writeUInt16BE(packetId, 4)
		this._sendPacket(buffer)
	}
	_retransmitFrom(fromId) {
		return tslib_1.__awaiter(this, void 0, void 0, function*() {
			// this.log(`Resending from ${fromId} to ${this._inFlight.length > 0 ? this._inFlight[this._inFlight.length - 1].packetId : '-'}`)
			// The atem will ask for MAX_PACKET_ID to be retransmitted when it really wants 0
			fromId = fromId % MAX_PACKET_ID
			const fromIndex = this._inFlight.findIndex(pkt => pkt.packetId === fromId)
			if (fromIndex === -1) {
				// fromId is not inflight, so we cannot resend. only fix is to abort
				this.log(`Unable to resend: ${fromId}`)
				yield this.restartConnection()
			} else {
				this.log(`Resending from ${fromId} to ${this._inFlight[this._inFlight.length - 1].packetId}`)
				// Resend from the requested
				for (let i = fromIndex; i < this._inFlight.length; i++) {
					const sentPacket = this._inFlight[i]
					if (sentPacket.packetId === fromId || !this._isPacketCoveredByAck(fromId, sentPacket.packetId)) {
						sentPacket.lastSent = Date.now()
						sentPacket.resent++
						// this.log(`${Date.now()} Resending ${sentPacket.packetId} Last=${this._nextSendPacketId - 1}`)
						this._sendPacket(sentPacket.payload)
					}
				}
			}
		})
	}
	_checkForRetransmit() {
		for (const sentPacket of this._inFlight) {
			if (sentPacket.lastSent + IN_FLIGHT_TIMEOUT < Date.now()) {
				if (
					sentPacket.resent <= MAX_PACKET_RETRIES &&
					this._isPacketCoveredByAck(this._nextSendPacketId, sentPacket.packetId)
				) {
					this.log(`Retransmit from timeout: ${sentPacket.packetId}`)
					// Retransmit the packet and anything after it
					return this._retransmitFrom(sentPacket.packetId)
				} else {
					// A command has timed out, so we need to reset to avoid getting stuck
					this.log(`Packet timed out: ${sentPacket.packetId}`)
					return this.restartConnection()
				}
			}
		}
		return Promise.resolve()
	}
}
exports.AtemSocketChild = AtemSocketChild
//# sourceMappingURL=atemSocketChild.js.map
