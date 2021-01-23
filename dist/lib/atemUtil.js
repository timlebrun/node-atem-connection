'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const Enums = require('../enums')
const WaveFile = require('wavefile')
const bigInt = require('big-integer')
function bufToBase64String(buffer, start, length) {
	return buffer.toString('base64', start, start + length)
}
exports.bufToBase64String = bufToBase64String
function bufToNullTerminatedString(buffer, start, length) {
	const slice = buffer.slice(start, start + length)
	const nullIndex = slice.indexOf('\0')
	return slice.toString('ascii', 0, nullIndex < 0 ? slice.length : nullIndex)
}
exports.bufToNullTerminatedString = bufToNullTerminatedString
const UINT63_MAX = bigInt.one.shiftLeft(63)
const UINT64_MAX = bigInt.one.shiftLeft(64)
function bufToBigInt(buffer, start) {
	const hex = buffer.toString('hex', start, start + 8)
	const rawVal = bigInt(hex, 16)
	if (rawVal.greater(UINT63_MAX)) {
		return UINT64_MAX.subtract(rawVal).negate()
	} else {
		return rawVal
	}
}
exports.bufToBigInt = bufToBigInt
function bigIntToBuf(buffer, val, start) {
	if (val.isNegative()) val = UINT64_MAX.subtract(val.negate())
	const str = val.toString(16).padStart(16, '0')
	buffer.write(str, start, 'hex')
}
exports.bigIntToBuf = bigIntToBuf
exports.COMMAND_CONNECT_HELLO = Buffer.from([
	0x10,
	0x14,
	0x53,
	0xab,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00,
	0x3a,
	0x00,
	0x00,
	0x01,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00
])
/**
 * @todo: BALTE - 2018-5-24:
 * Create util functions that handle proper colour spaces in UHD.
 */
function convertRGBAToYUV422(width, height, data) {
	// BT.709 or BT.601
	const KR = height >= 720 ? 0.2126 : 0.299
	const KB = height >= 720 ? 0.0722 : 0.114
	const KG = 1 - KR - KB
	const KRi = 1 - KR
	const KBi = 1 - KB
	const YRange = 219
	const CbCrRange = 224
	const HalfCbCrRange = CbCrRange / 2
	const YOffset = 16 << 8
	const CbCrOffset = 128 << 8
	const KRoKBi = (KR / KBi) * HalfCbCrRange
	const KGoKBi = (KG / KBi) * HalfCbCrRange
	const KBoKRi = (KB / KRi) * HalfCbCrRange
	const KGoKRi = (KG / KRi) * HalfCbCrRange
	const genColor = (rawA, uv16, y16) => {
		const a = ((rawA << 2) * 219) / 255 + (16 << 2)
		const y = Math.round(y16) >> 6
		const uv = Math.round(uv16) >> 6
		return (a << 20) + (uv << 10) + y
	}
	const buffer = Buffer.alloc(width * height * 4)
	for (let i = 0; i < width * height * 4; i += 8) {
		const r1 = data[i + 0]
		const g1 = data[i + 1]
		const b1 = data[i + 2]
		const r2 = data[i + 4]
		const g2 = data[i + 5]
		const b2 = data[i + 6]
		const a1 = data[i + 3]
		const a2 = data[i + 7]
		const y16a = YOffset + KR * YRange * r1 + KG * YRange * g1 + KB * YRange * b1
		const cb16 = CbCrOffset + (-KRoKBi * r1 - KGoKBi * g1 + HalfCbCrRange * b1)
		const y16b = YOffset + KR * YRange * r2 + KG * YRange * g2 + KB * YRange * b2
		const cr16 = CbCrOffset + (HalfCbCrRange * r1 - KGoKRi * g1 - KBoKRi * b1)
		buffer.writeUInt32BE(genColor(a1, cb16, y16a), i)
		buffer.writeUInt32BE(genColor(a2, cr16, y16b), i + 4)
	}
	return buffer
}
exports.convertRGBAToYUV422 = convertRGBAToYUV422
const dimsPAL = { width: 720, height: 576 }
const dimsNTSC = { width: 640, height: 480 }
const dims720p = { width: 1280, height: 720 }
const dims1080p = { width: 1920, height: 1080 }
const dims4k = { width: 3840, height: 2160 }
const dims8k = { width: 7680, height: 4260 }
const VideoModeInfoImpl = {
	[Enums.VideoMode.N525i5994NTSC]: Object.assign({}, dimsNTSC),
	[Enums.VideoMode.P625i50PAL]: Object.assign({}, dimsPAL),
	[Enums.VideoMode.N525i5994169]: Object.assign({}, dimsNTSC),
	[Enums.VideoMode.P625i50169]: Object.assign({}, dimsPAL),
	[Enums.VideoMode.P720p50]: Object.assign({}, dims720p),
	[Enums.VideoMode.N720p5994]: Object.assign({}, dims720p),
	[Enums.VideoMode.P1080i50]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N1080i5994]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N1080p2398]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N1080p24]: Object.assign({}, dims1080p),
	[Enums.VideoMode.P1080p25]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N1080p2997]: Object.assign({}, dims1080p),
	[Enums.VideoMode.P1080p50]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N1080p5994]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N4KHDp2398]: Object.assign({}, dims4k),
	[Enums.VideoMode.N4KHDp24]: Object.assign({}, dims4k),
	[Enums.VideoMode.P4KHDp25]: Object.assign({}, dims4k),
	[Enums.VideoMode.N4KHDp2997]: Object.assign({}, dims4k),
	[Enums.VideoMode.P4KHDp5000]: Object.assign({}, dims4k),
	[Enums.VideoMode.N4KHDp5994]: Object.assign({}, dims4k),
	[Enums.VideoMode.N8KHDp2398]: Object.assign({}, dims8k),
	[Enums.VideoMode.N8KHDp24]: Object.assign({}, dims8k),
	[Enums.VideoMode.P8KHDp25]: Object.assign({}, dims8k),
	[Enums.VideoMode.N8KHDp2997]: Object.assign({}, dims8k),
	[Enums.VideoMode.P8KHDp50]: Object.assign({}, dims8k),
	[Enums.VideoMode.N8KHDp5994]: Object.assign({}, dims8k),
	[Enums.VideoMode.N1080p30]: Object.assign({}, dims1080p),
	[Enums.VideoMode.N1080p60]: Object.assign({}, dims1080p)
}
function getVideoModeInfo(videoMode) {
	return VideoModeInfoImpl[videoMode]
}
exports.getVideoModeInfo = getVideoModeInfo
function convertWAVToRaw(inputBuffer) {
	const wav = new WaveFile(inputBuffer)
	if (wav.fmt.bitsPerSample !== 24) {
		throw new Error(`Invalid wav bit bits per sample: ${wav.fmt.bitsPerSample}`)
	}
	if (wav.fmt.numChannels !== 2) {
		throw new Error(`Invalid number of wav channels: ${wav.fmt.numChannel}`)
	}
	const buffer = Buffer.from(wav.data.samples)
	const buffer2 = Buffer.alloc(buffer.length)
	for (let i = 0; i < buffer.length; i += 3) {
		// 24bit samples, change endian
		buffer2.writeUIntBE(buffer.readUIntLE(i, 3), i, 3)
	}
	return buffer2
}
exports.convertWAVToRaw = convertWAVToRaw
function UInt16BEToDecibel(input) {
	// 0 = -inf, 32768 = 0, 65381 = +6db
	return Math.round(Math.log10(input / 32768) * 20 * 100) / 100
}
exports.UInt16BEToDecibel = UInt16BEToDecibel
function DecibelToUInt16BE(input) {
	return Math.floor(Math.pow(10, input / 20) * 32768)
}
exports.DecibelToUInt16BE = DecibelToUInt16BE
function IntToBalance(input) {
	// -100000 = -50, 0x0000 = 0, 0x2710 = +50
	return Math.round(input / 200)
}
exports.IntToBalance = IntToBalance
function BalanceToInt(input) {
	return Math.round(input * 200)
}
exports.BalanceToInt = BalanceToInt
function padToMultiple4(val) {
	const r = val % 4
	if (r === 0) {
		return val
	} else {
		return val + (4 - r)
	}
}
exports.padToMultiple4 = padToMultiple4
function getComponents(val) {
	const res = []
	for (let next = 1; next <= val; next = next << 1) {
		if ((val & next) > 0) {
			res.push(next)
		}
	}
	return res
}
exports.getComponents = getComponents
function commandStringify(command) {
	return JSON.stringify(command, (_key, value) =>
		typeof value === 'bigint' || bigInt.isInstance(value) ? value.toString() : value
	)
}
exports.commandStringify = commandStringify
//# sourceMappingURL=atemUtil.js.map
