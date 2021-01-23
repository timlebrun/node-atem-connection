'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var Model
;(function(Model) {
	Model[(Model['Unknown'] = 0)] = 'Unknown'
	Model[(Model['TVS'] = 1)] = 'TVS'
	Model[(Model['OneME'] = 2)] = 'OneME'
	Model[(Model['TwoME'] = 3)] = 'TwoME'
	Model[(Model['PS4K'] = 4)] = 'PS4K'
	Model[(Model['OneME4K'] = 5)] = 'OneME4K'
	Model[(Model['TwoME4K'] = 6)] = 'TwoME4K'
	Model[(Model['TwoMEBS4K'] = 7)] = 'TwoMEBS4K'
	Model[(Model['TVSHD'] = 8)] = 'TVSHD'
	Model[(Model['TVSProHD'] = 9)] = 'TVSProHD'
	Model[(Model['TVSPro4K'] = 10)] = 'TVSPro4K'
	Model[(Model['Constellation'] = 11)] = 'Constellation'
	Model[(Model['Constellation8K'] = 12)] = 'Constellation8K'
	Model[(Model['Mini'] = 13)] = 'Mini'
	Model[(Model['MiniPro'] = 14)] = 'MiniPro'
	Model[(Model['MiniProISO'] = 15)] = 'MiniProISO'
})((Model = exports.Model || (exports.Model = {})))
var ProtocolVersion
;(function(ProtocolVersion) {
	ProtocolVersion[(ProtocolVersion['V7_2'] = 131094)] = 'V7_2'
	ProtocolVersion[(ProtocolVersion['V7_5_2'] = 131099)] = 'V7_5_2'
	ProtocolVersion[(ProtocolVersion['V8_0'] = 131100)] = 'V8_0'
	ProtocolVersion[(ProtocolVersion['V8_0_1'] = 131101)] = 'V8_0_1'
	ProtocolVersion[(ProtocolVersion['V8_1_1'] = 131102)] = 'V8_1_1' // 2.30
})((ProtocolVersion = exports.ProtocolVersion || (exports.ProtocolVersion = {})))
var TransitionStyle
;(function(TransitionStyle) {
	TransitionStyle[(TransitionStyle['MIX'] = 0)] = 'MIX'
	TransitionStyle[(TransitionStyle['DIP'] = 1)] = 'DIP'
	TransitionStyle[(TransitionStyle['WIPE'] = 2)] = 'WIPE'
	TransitionStyle[(TransitionStyle['DVE'] = 3)] = 'DVE'
	TransitionStyle[(TransitionStyle['STING'] = 4)] = 'STING'
})((TransitionStyle = exports.TransitionStyle || (exports.TransitionStyle = {})))
var DVEEffect
;(function(DVEEffect) {
	DVEEffect[(DVEEffect['SwooshTopLeft'] = 0)] = 'SwooshTopLeft'
	DVEEffect[(DVEEffect['SwooshTop'] = 1)] = 'SwooshTop'
	DVEEffect[(DVEEffect['SwooshTopRight'] = 2)] = 'SwooshTopRight'
	DVEEffect[(DVEEffect['SwooshLeft'] = 3)] = 'SwooshLeft'
	DVEEffect[(DVEEffect['SwooshRight'] = 4)] = 'SwooshRight'
	DVEEffect[(DVEEffect['SwooshBottomLeft'] = 5)] = 'SwooshBottomLeft'
	DVEEffect[(DVEEffect['SwooshBottom'] = 6)] = 'SwooshBottom'
	DVEEffect[(DVEEffect['SwooshBottomRight'] = 7)] = 'SwooshBottomRight'
	DVEEffect[(DVEEffect['SpinCCWTopRight'] = 13)] = 'SpinCCWTopRight'
	DVEEffect[(DVEEffect['SpinCWTopLeft'] = 8)] = 'SpinCWTopLeft'
	DVEEffect[(DVEEffect['SpinCCWBottomRight'] = 15)] = 'SpinCCWBottomRight'
	DVEEffect[(DVEEffect['SpinCWBottomLeft'] = 10)] = 'SpinCWBottomLeft'
	DVEEffect[(DVEEffect['SpinCWTopRight'] = 9)] = 'SpinCWTopRight'
	DVEEffect[(DVEEffect['SpinCCWTopLeft'] = 12)] = 'SpinCCWTopLeft'
	DVEEffect[(DVEEffect['SpinCWBottomRight'] = 11)] = 'SpinCWBottomRight'
	DVEEffect[(DVEEffect['SpinCCWBottomLeft'] = 14)] = 'SpinCCWBottomLeft'
	DVEEffect[(DVEEffect['SqueezeTopLeft'] = 16)] = 'SqueezeTopLeft'
	DVEEffect[(DVEEffect['SqueezeTop'] = 17)] = 'SqueezeTop'
	DVEEffect[(DVEEffect['SqueezeTopRight'] = 18)] = 'SqueezeTopRight'
	DVEEffect[(DVEEffect['SqueezeLeft'] = 19)] = 'SqueezeLeft'
	DVEEffect[(DVEEffect['SqueezeRight'] = 20)] = 'SqueezeRight'
	DVEEffect[(DVEEffect['SqueezeBottomLeft'] = 21)] = 'SqueezeBottomLeft'
	DVEEffect[(DVEEffect['SqueezeBottom'] = 22)] = 'SqueezeBottom'
	DVEEffect[(DVEEffect['SqueezeBottomRight'] = 23)] = 'SqueezeBottomRight'
	DVEEffect[(DVEEffect['PushTopLeft'] = 24)] = 'PushTopLeft'
	DVEEffect[(DVEEffect['PushTop'] = 25)] = 'PushTop'
	DVEEffect[(DVEEffect['PushTopRight'] = 26)] = 'PushTopRight'
	DVEEffect[(DVEEffect['PushLeft'] = 27)] = 'PushLeft'
	DVEEffect[(DVEEffect['PushRight'] = 28)] = 'PushRight'
	DVEEffect[(DVEEffect['PushBottomLeft'] = 29)] = 'PushBottomLeft'
	DVEEffect[(DVEEffect['PushBottom'] = 30)] = 'PushBottom'
	DVEEffect[(DVEEffect['PushBottomRight'] = 31)] = 'PushBottomRight'
	DVEEffect[(DVEEffect['GraphicCWSpin'] = 32)] = 'GraphicCWSpin'
	DVEEffect[(DVEEffect['GraphicCCWSpin'] = 33)] = 'GraphicCCWSpin'
	DVEEffect[(DVEEffect['GraphicLogoWipe'] = 34)] = 'GraphicLogoWipe'
})((DVEEffect = exports.DVEEffect || (exports.DVEEffect = {})))
var MacroAction
;(function(MacroAction) {
	MacroAction[(MacroAction['Run'] = 0)] = 'Run'
	MacroAction[(MacroAction['Stop'] = 1)] = 'Stop'
	MacroAction[(MacroAction['StopRecord'] = 2)] = 'StopRecord'
	MacroAction[(MacroAction['InsertUserWait'] = 3)] = 'InsertUserWait'
	MacroAction[(MacroAction['Continue'] = 4)] = 'Continue'
	MacroAction[(MacroAction['Delete'] = 5)] = 'Delete'
})((MacroAction = exports.MacroAction || (exports.MacroAction = {})))
var ExternalPortType
;(function(ExternalPortType) {
	ExternalPortType[(ExternalPortType['Unknown'] = 0)] = 'Unknown'
	ExternalPortType[(ExternalPortType['SDI'] = 1)] = 'SDI'
	ExternalPortType[(ExternalPortType['HDMI'] = 2)] = 'HDMI'
	ExternalPortType[(ExternalPortType['Component'] = 4)] = 'Component'
	ExternalPortType[(ExternalPortType['Composite'] = 8)] = 'Composite'
	ExternalPortType[(ExternalPortType['SVideo'] = 16)] = 'SVideo'
	ExternalPortType[(ExternalPortType['XLR'] = 32)] = 'XLR'
	ExternalPortType[(ExternalPortType['AESEBU'] = 64)] = 'AESEBU'
	ExternalPortType[(ExternalPortType['RCA'] = 128)] = 'RCA'
	ExternalPortType[(ExternalPortType['Internal'] = 256)] = 'Internal'
	ExternalPortType[(ExternalPortType['TSJack'] = 512)] = 'TSJack'
	ExternalPortType[(ExternalPortType['MADI'] = 1024)] = 'MADI'
	ExternalPortType[(ExternalPortType['TRSJack'] = 2048)] = 'TRSJack'
})((ExternalPortType = exports.ExternalPortType || (exports.ExternalPortType = {})))
var InternalPortType
;(function(InternalPortType) {
	InternalPortType[(InternalPortType['External'] = 0)] = 'External'
	InternalPortType[(InternalPortType['Black'] = 1)] = 'Black'
	InternalPortType[(InternalPortType['ColorBars'] = 2)] = 'ColorBars'
	InternalPortType[(InternalPortType['ColorGenerator'] = 3)] = 'ColorGenerator'
	InternalPortType[(InternalPortType['MediaPlayerFill'] = 4)] = 'MediaPlayerFill'
	InternalPortType[(InternalPortType['MediaPlayerKey'] = 5)] = 'MediaPlayerKey'
	InternalPortType[(InternalPortType['SuperSource'] = 6)] = 'SuperSource'
	// Since V8_1_1
	InternalPortType[(InternalPortType['ExternalDirect'] = 7)] = 'ExternalDirect'
	InternalPortType[(InternalPortType['MEOutput'] = 128)] = 'MEOutput'
	InternalPortType[(InternalPortType['Auxiliary'] = 129)] = 'Auxiliary'
	InternalPortType[(InternalPortType['Mask'] = 130)] = 'Mask'
	// Since V8_1_1
	InternalPortType[(InternalPortType['MultiViewer'] = 131)] = 'MultiViewer'
})((InternalPortType = exports.InternalPortType || (exports.InternalPortType = {})))
var SourceAvailability
;(function(SourceAvailability) {
	SourceAvailability[(SourceAvailability['None'] = 0)] = 'None'
	SourceAvailability[(SourceAvailability['Auxiliary'] = 1)] = 'Auxiliary'
	SourceAvailability[(SourceAvailability['Multiviewer'] = 2)] = 'Multiviewer'
	SourceAvailability[(SourceAvailability['SuperSourceArt'] = 4)] = 'SuperSourceArt'
	SourceAvailability[(SourceAvailability['SuperSourceBox'] = 8)] = 'SuperSourceBox'
	SourceAvailability[(SourceAvailability['KeySource'] = 16)] = 'KeySource'
	SourceAvailability[(SourceAvailability['All'] = 31)] = 'All'
})((SourceAvailability = exports.SourceAvailability || (exports.SourceAvailability = {})))
var MeAvailability
;(function(MeAvailability) {
	MeAvailability[(MeAvailability['None'] = 0)] = 'None'
	MeAvailability[(MeAvailability['Me1'] = 1)] = 'Me1'
	MeAvailability[(MeAvailability['Me2'] = 2)] = 'Me2'
	MeAvailability[(MeAvailability['Me3'] = 4)] = 'Me3'
	MeAvailability[(MeAvailability['Me4'] = 8)] = 'Me4'
	MeAvailability[(MeAvailability['All'] = 15)] = 'All'
})((MeAvailability = exports.MeAvailability || (exports.MeAvailability = {})))
var BorderBevel
;(function(BorderBevel) {
	BorderBevel[(BorderBevel['None'] = 0)] = 'None'
	BorderBevel[(BorderBevel['InOut'] = 1)] = 'InOut'
	BorderBevel[(BorderBevel['In'] = 2)] = 'In'
	BorderBevel[(BorderBevel['Out'] = 3)] = 'Out'
})((BorderBevel = exports.BorderBevel || (exports.BorderBevel = {})))
var IsAtKeyFrame
;(function(IsAtKeyFrame) {
	IsAtKeyFrame[(IsAtKeyFrame['None'] = 0)] = 'None'
	IsAtKeyFrame[(IsAtKeyFrame['A'] = 1)] = 'A'
	IsAtKeyFrame[(IsAtKeyFrame['B'] = 2)] = 'B'
	IsAtKeyFrame[(IsAtKeyFrame['RunToInfinite'] = 4)] = 'RunToInfinite'
})((IsAtKeyFrame = exports.IsAtKeyFrame || (exports.IsAtKeyFrame = {})))
var Pattern
;(function(Pattern) {
	Pattern[(Pattern['LeftToRightBar'] = 0)] = 'LeftToRightBar'
	Pattern[(Pattern['TopToBottomBar'] = 1)] = 'TopToBottomBar'
	Pattern[(Pattern['HorizontalBarnDoor'] = 2)] = 'HorizontalBarnDoor'
	Pattern[(Pattern['VerticalBarnDoor'] = 3)] = 'VerticalBarnDoor'
	Pattern[(Pattern['CornersInFourBox'] = 4)] = 'CornersInFourBox'
	Pattern[(Pattern['RectangleIris'] = 5)] = 'RectangleIris'
	Pattern[(Pattern['DiamondIris'] = 6)] = 'DiamondIris'
	Pattern[(Pattern['CircleIris'] = 7)] = 'CircleIris'
	Pattern[(Pattern['TopLeftBox'] = 8)] = 'TopLeftBox'
	Pattern[(Pattern['TopRightBox'] = 9)] = 'TopRightBox'
	Pattern[(Pattern['BottomRightBox'] = 10)] = 'BottomRightBox'
	Pattern[(Pattern['BottomLeftBox'] = 11)] = 'BottomLeftBox'
	Pattern[(Pattern['TopCentreBox'] = 12)] = 'TopCentreBox'
	Pattern[(Pattern['RightCentreBox'] = 13)] = 'RightCentreBox'
	Pattern[(Pattern['BottomCentreBox'] = 14)] = 'BottomCentreBox'
	Pattern[(Pattern['LeftCentreBox'] = 15)] = 'LeftCentreBox'
	Pattern[(Pattern['TopLeftDiagonal'] = 16)] = 'TopLeftDiagonal'
	Pattern[(Pattern['TopRightDiagonal'] = 17)] = 'TopRightDiagonal'
})((Pattern = exports.Pattern || (exports.Pattern = {})))
var MixEffectKeyType
;(function(MixEffectKeyType) {
	MixEffectKeyType[(MixEffectKeyType['Luma'] = 0)] = 'Luma'
	MixEffectKeyType[(MixEffectKeyType['Chroma'] = 1)] = 'Chroma'
	MixEffectKeyType[(MixEffectKeyType['Pattern'] = 2)] = 'Pattern'
	MixEffectKeyType[(MixEffectKeyType['DVE'] = 3)] = 'DVE'
})((MixEffectKeyType = exports.MixEffectKeyType || (exports.MixEffectKeyType = {})))
var SuperSourceArtOption
;(function(SuperSourceArtOption) {
	SuperSourceArtOption[(SuperSourceArtOption['Background'] = 0)] = 'Background'
	SuperSourceArtOption[(SuperSourceArtOption['Foreground'] = 1)] = 'Foreground'
})((SuperSourceArtOption = exports.SuperSourceArtOption || (exports.SuperSourceArtOption = {})))
var TransferMode
;(function(TransferMode) {
	TransferMode[(TransferMode['NoOp'] = 0)] = 'NoOp'
	TransferMode[(TransferMode['Write'] = 1)] = 'Write'
	TransferMode[(TransferMode['Clear'] = 2)] = 'Clear'
	TransferMode[(TransferMode['WriteAudio'] = 256)] = 'WriteAudio'
})((TransferMode = exports.TransferMode || (exports.TransferMode = {})))
var VideoMode
;(function(VideoMode) {
	VideoMode[(VideoMode['N525i5994NTSC'] = 0)] = 'N525i5994NTSC'
	VideoMode[(VideoMode['P625i50PAL'] = 1)] = 'P625i50PAL'
	VideoMode[(VideoMode['N525i5994169'] = 2)] = 'N525i5994169'
	VideoMode[(VideoMode['P625i50169'] = 3)] = 'P625i50169'
	VideoMode[(VideoMode['P720p50'] = 4)] = 'P720p50'
	VideoMode[(VideoMode['N720p5994'] = 5)] = 'N720p5994'
	VideoMode[(VideoMode['P1080i50'] = 6)] = 'P1080i50'
	VideoMode[(VideoMode['N1080i5994'] = 7)] = 'N1080i5994'
	VideoMode[(VideoMode['N1080p2398'] = 8)] = 'N1080p2398'
	VideoMode[(VideoMode['N1080p24'] = 9)] = 'N1080p24'
	VideoMode[(VideoMode['P1080p25'] = 10)] = 'P1080p25'
	VideoMode[(VideoMode['N1080p2997'] = 11)] = 'N1080p2997'
	VideoMode[(VideoMode['P1080p50'] = 12)] = 'P1080p50'
	VideoMode[(VideoMode['N1080p5994'] = 13)] = 'N1080p5994'
	VideoMode[(VideoMode['N4KHDp2398'] = 14)] = 'N4KHDp2398'
	VideoMode[(VideoMode['N4KHDp24'] = 15)] = 'N4KHDp24'
	VideoMode[(VideoMode['P4KHDp25'] = 16)] = 'P4KHDp25'
	VideoMode[(VideoMode['N4KHDp2997'] = 17)] = 'N4KHDp2997'
	VideoMode[(VideoMode['P4KHDp5000'] = 18)] = 'P4KHDp5000'
	VideoMode[(VideoMode['N4KHDp5994'] = 19)] = 'N4KHDp5994'
	VideoMode[(VideoMode['N8KHDp2398'] = 20)] = 'N8KHDp2398'
	VideoMode[(VideoMode['N8KHDp24'] = 21)] = 'N8KHDp24'
	VideoMode[(VideoMode['P8KHDp25'] = 22)] = 'P8KHDp25'
	VideoMode[(VideoMode['N8KHDp2997'] = 23)] = 'N8KHDp2997'
	VideoMode[(VideoMode['P8KHDp50'] = 24)] = 'P8KHDp50'
	VideoMode[(VideoMode['N8KHDp5994'] = 25)] = 'N8KHDp5994'
	VideoMode[(VideoMode['N1080p30'] = 26)] = 'N1080p30'
	VideoMode[(VideoMode['N1080p60'] = 27)] = 'N1080p60'
})((VideoMode = exports.VideoMode || (exports.VideoMode = {})))
var TransferState
;(function(TransferState) {
	TransferState[(TransferState['Queued'] = 0)] = 'Queued'
	TransferState[(TransferState['Locked'] = 1)] = 'Locked'
	TransferState[(TransferState['Transferring'] = 2)] = 'Transferring'
	TransferState[(TransferState['Finished'] = 3)] = 'Finished'
})((TransferState = exports.TransferState || (exports.TransferState = {})))
var MediaSourceType
;(function(MediaSourceType) {
	MediaSourceType[(MediaSourceType['Still'] = 1)] = 'Still'
	MediaSourceType[(MediaSourceType['Clip'] = 2)] = 'Clip'
})((MediaSourceType = exports.MediaSourceType || (exports.MediaSourceType = {})))
var AudioMixOption
;(function(AudioMixOption) {
	AudioMixOption[(AudioMixOption['Off'] = 0)] = 'Off'
	AudioMixOption[(AudioMixOption['On'] = 1)] = 'On'
	AudioMixOption[(AudioMixOption['AudioFollowVideo'] = 2)] = 'AudioFollowVideo'
})((AudioMixOption = exports.AudioMixOption || (exports.AudioMixOption = {})))
var AudioSourceType
;(function(AudioSourceType) {
	AudioSourceType[(AudioSourceType['ExternalVideo'] = 0)] = 'ExternalVideo'
	AudioSourceType[(AudioSourceType['MediaPlayer'] = 1)] = 'MediaPlayer'
	AudioSourceType[(AudioSourceType['ExternalAudio'] = 2)] = 'ExternalAudio'
})((AudioSourceType = exports.AudioSourceType || (exports.AudioSourceType = {})))
var StreamingError
;(function(StreamingError) {
	StreamingError[(StreamingError['None'] = 0)] = 'None'
	StreamingError[(StreamingError['InvalidState'] = 16)] = 'InvalidState'
	StreamingError[(StreamingError['Unknown'] = 32768)] = 'Unknown'
})((StreamingError = exports.StreamingError || (exports.StreamingError = {})))
var StreamingStatus
;(function(StreamingStatus) {
	StreamingStatus[(StreamingStatus['Idle'] = 1)] = 'Idle'
	StreamingStatus[(StreamingStatus['Connecting'] = 2)] = 'Connecting'
	StreamingStatus[(StreamingStatus['Streaming'] = 4)] = 'Streaming'
	StreamingStatus[(StreamingStatus['Stopping'] = 32)] = 'Stopping' // + Streaming
})((StreamingStatus = exports.StreamingStatus || (exports.StreamingStatus = {})))
var RecordingError
;(function(RecordingError) {
	RecordingError[(RecordingError['None'] = 2)] = 'None'
	RecordingError[(RecordingError['NoMedia'] = 0)] = 'NoMedia'
	RecordingError[(RecordingError['MediaFull'] = 4)] = 'MediaFull'
	RecordingError[(RecordingError['MediaError'] = 8)] = 'MediaError'
	RecordingError[(RecordingError['MediaUnformatted'] = 16)] = 'MediaUnformatted'
	RecordingError[(RecordingError['DroppingFrames'] = 32)] = 'DroppingFrames'
	RecordingError[(RecordingError['Unknown'] = 32768)] = 'Unknown'
})((RecordingError = exports.RecordingError || (exports.RecordingError = {})))
var RecordingStatus
;(function(RecordingStatus) {
	RecordingStatus[(RecordingStatus['Idle'] = 0)] = 'Idle'
	RecordingStatus[(RecordingStatus['Recording'] = 1)] = 'Recording'
	RecordingStatus[(RecordingStatus['Stopping'] = 128)] = 'Stopping'
})((RecordingStatus = exports.RecordingStatus || (exports.RecordingStatus = {})))
var RecordingDiskStatus
;(function(RecordingDiskStatus) {
	RecordingDiskStatus[(RecordingDiskStatus['Idle'] = 1)] = 'Idle'
	RecordingDiskStatus[(RecordingDiskStatus['Unformatted'] = 2)] = 'Unformatted'
	RecordingDiskStatus[(RecordingDiskStatus['Active'] = 4)] = 'Active'
	RecordingDiskStatus[(RecordingDiskStatus['Recording'] = 8)] = 'Recording'
	RecordingDiskStatus[(RecordingDiskStatus['Removed'] = 32)] = 'Removed'
})((RecordingDiskStatus = exports.RecordingDiskStatus || (exports.RecordingDiskStatus = {})))
var FairlightAudioMixOption
;(function(FairlightAudioMixOption) {
	FairlightAudioMixOption[(FairlightAudioMixOption['Off'] = 1)] = 'Off'
	FairlightAudioMixOption[(FairlightAudioMixOption['On'] = 2)] = 'On'
	FairlightAudioMixOption[(FairlightAudioMixOption['AudioFollowVideo'] = 4)] = 'AudioFollowVideo'
})((FairlightAudioMixOption = exports.FairlightAudioMixOption || (exports.FairlightAudioMixOption = {})))
var FairlightInputConfiguration
;(function(FairlightInputConfiguration) {
	FairlightInputConfiguration[(FairlightInputConfiguration['Mono'] = 1)] = 'Mono'
	FairlightInputConfiguration[(FairlightInputConfiguration['Stereo'] = 2)] = 'Stereo'
	FairlightInputConfiguration[(FairlightInputConfiguration['DualMono'] = 4)] = 'DualMono'
})((FairlightInputConfiguration = exports.FairlightInputConfiguration || (exports.FairlightInputConfiguration = {})))
var FairlightAnalogInputLevel
;(function(FairlightAnalogInputLevel) {
	FairlightAnalogInputLevel[(FairlightAnalogInputLevel['Microphone'] = 1)] = 'Microphone'
	FairlightAnalogInputLevel[(FairlightAnalogInputLevel['ConsumerLine'] = 2)] = 'ConsumerLine'
	// [Since(ProtocolVersion.V8_1_1)]
	FairlightAnalogInputLevel[(FairlightAnalogInputLevel['ProLine'] = 4)] = 'ProLine'
})((FairlightAnalogInputLevel = exports.FairlightAnalogInputLevel || (exports.FairlightAnalogInputLevel = {})))
var FairlightAudioSourceType
;(function(FairlightAudioSourceType) {
	FairlightAudioSourceType[(FairlightAudioSourceType['Mono'] = 0)] = 'Mono'
	FairlightAudioSourceType[(FairlightAudioSourceType['Stereo'] = 1)] = 'Stereo'
})((FairlightAudioSourceType = exports.FairlightAudioSourceType || (exports.FairlightAudioSourceType = {})))
var FairlightInputType
;(function(FairlightInputType) {
	FairlightInputType[(FairlightInputType['EmbeddedWithVideo'] = 0)] = 'EmbeddedWithVideo'
	FairlightInputType[(FairlightInputType['MediaPlayer'] = 1)] = 'MediaPlayer'
	FairlightInputType[(FairlightInputType['AudioIn'] = 2)] = 'AudioIn'
	FairlightInputType[(FairlightInputType['MADI'] = 4)] = 'MADI'
})((FairlightInputType = exports.FairlightInputType || (exports.FairlightInputType = {})))
//# sourceMappingURL=index.js.map
