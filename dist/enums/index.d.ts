export declare enum Model {
    Unknown = 0,
    TVS = 1,
    OneME = 2,
    TwoME = 3,
    PS4K = 4,
    OneME4K = 5,
    TwoME4K = 6,
    TwoMEBS4K = 7,
    TVSHD = 8,
    TVSProHD = 9,
    TVSPro4K = 10,
    Constellation = 11,
    Constellation8K = 12,
    Mini = 13,
    MiniPro = 14,
    MiniProISO = 15
}
export declare enum ProtocolVersion {
    V7_2 = 131094,
    V7_5_2 = 131099,
    V8_0 = 131100,
    V8_0_1 = 131101,
    V8_1_1 = 131102
}
export declare enum TransitionStyle {
    MIX = 0,
    DIP = 1,
    WIPE = 2,
    DVE = 3,
    STING = 4
}
export declare enum DVEEffect {
    SwooshTopLeft = 0,
    SwooshTop = 1,
    SwooshTopRight = 2,
    SwooshLeft = 3,
    SwooshRight = 4,
    SwooshBottomLeft = 5,
    SwooshBottom = 6,
    SwooshBottomRight = 7,
    SpinCCWTopRight = 13,
    SpinCWTopLeft = 8,
    SpinCCWBottomRight = 15,
    SpinCWBottomLeft = 10,
    SpinCWTopRight = 9,
    SpinCCWTopLeft = 12,
    SpinCWBottomRight = 11,
    SpinCCWBottomLeft = 14,
    SqueezeTopLeft = 16,
    SqueezeTop = 17,
    SqueezeTopRight = 18,
    SqueezeLeft = 19,
    SqueezeRight = 20,
    SqueezeBottomLeft = 21,
    SqueezeBottom = 22,
    SqueezeBottomRight = 23,
    PushTopLeft = 24,
    PushTop = 25,
    PushTopRight = 26,
    PushLeft = 27,
    PushRight = 28,
    PushBottomLeft = 29,
    PushBottom = 30,
    PushBottomRight = 31,
    GraphicCWSpin = 32,
    GraphicCCWSpin = 33,
    GraphicLogoWipe = 34
}
export declare enum MacroAction {
    Run = 0,
    Stop = 1,
    StopRecord = 2,
    InsertUserWait = 3,
    Continue = 4,
    Delete = 5
}
export declare enum ExternalPortType {
    Unknown = 0,
    SDI = 1,
    HDMI = 2,
    Component = 4,
    Composite = 8,
    SVideo = 16,
    XLR = 32,
    AESEBU = 64,
    RCA = 128,
    Internal = 256,
    TSJack = 512,
    MADI = 1024,
    TRSJack = 2048
}
export declare enum InternalPortType {
    External = 0,
    Black = 1,
    ColorBars = 2,
    ColorGenerator = 3,
    MediaPlayerFill = 4,
    MediaPlayerKey = 5,
    SuperSource = 6,
    ExternalDirect = 7,
    MEOutput = 128,
    Auxiliary = 129,
    Mask = 130,
    MultiViewer = 131
}
export declare enum SourceAvailability {
    None = 0,
    Auxiliary = 1,
    Multiviewer = 2,
    SuperSourceArt = 4,
    SuperSourceBox = 8,
    KeySource = 16,
    All = 31
}
export declare enum MeAvailability {
    None = 0,
    Me1 = 1,
    Me2 = 2,
    Me3 = 4,
    Me4 = 8,
    All = 15
}
export declare enum BorderBevel {
    None = 0,
    InOut = 1,
    In = 2,
    Out = 3
}
export declare enum IsAtKeyFrame {
    None = 0,
    A = 1,
    B = 2,
    RunToInfinite = 4
}
export declare enum Pattern {
    LeftToRightBar = 0,
    TopToBottomBar = 1,
    HorizontalBarnDoor = 2,
    VerticalBarnDoor = 3,
    CornersInFourBox = 4,
    RectangleIris = 5,
    DiamondIris = 6,
    CircleIris = 7,
    TopLeftBox = 8,
    TopRightBox = 9,
    BottomRightBox = 10,
    BottomLeftBox = 11,
    TopCentreBox = 12,
    RightCentreBox = 13,
    BottomCentreBox = 14,
    LeftCentreBox = 15,
    TopLeftDiagonal = 16,
    TopRightDiagonal = 17
}
export declare enum MixEffectKeyType {
    Luma = 0,
    Chroma = 1,
    Pattern = 2,
    DVE = 3
}
export declare enum SuperSourceArtOption {
    Background = 0,
    Foreground = 1
}
export declare enum TransferMode {
    NoOp = 0,
    Write = 1,
    Clear = 2,
    WriteAudio = 256
}
export declare enum VideoMode {
    N525i5994NTSC = 0,
    P625i50PAL = 1,
    N525i5994169 = 2,
    P625i50169 = 3,
    P720p50 = 4,
    N720p5994 = 5,
    P1080i50 = 6,
    N1080i5994 = 7,
    N1080p2398 = 8,
    N1080p24 = 9,
    P1080p25 = 10,
    N1080p2997 = 11,
    P1080p50 = 12,
    N1080p5994 = 13,
    N4KHDp2398 = 14,
    N4KHDp24 = 15,
    P4KHDp25 = 16,
    N4KHDp2997 = 17,
    P4KHDp5000 = 18,
    N4KHDp5994 = 19,
    N8KHDp2398 = 20,
    N8KHDp24 = 21,
    P8KHDp25 = 22,
    N8KHDp2997 = 23,
    P8KHDp50 = 24,
    N8KHDp5994 = 25,
    N1080p30 = 26,
    N1080p60 = 27
}
export declare enum TransferState {
    Queued = 0,
    Locked = 1,
    Transferring = 2,
    Finished = 3
}
export declare enum MediaSourceType {
    Still = 1,
    Clip = 2
}
export declare enum AudioMixOption {
    Off = 0,
    On = 1,
    AudioFollowVideo = 2
}
export declare enum AudioSourceType {
    ExternalVideo = 0,
    MediaPlayer = 1,
    ExternalAudio = 2
}
export declare enum StreamingError {
    None = 0,
    InvalidState = 16,
    Unknown = 32768
}
export declare enum StreamingStatus {
    Idle = 1,
    Connecting = 2,
    Streaming = 4,
    Stopping = 32
}
export declare enum RecordingError {
    None = 2,
    NoMedia = 0,
    MediaFull = 4,
    MediaError = 8,
    MediaUnformatted = 16,
    DroppingFrames = 32,
    Unknown = 32768
}
export declare enum RecordingStatus {
    Idle = 0,
    Recording = 1,
    Stopping = 128
}
export declare enum RecordingDiskStatus {
    Idle = 1,
    Unformatted = 2,
    Active = 4,
    Recording = 8,
    Removed = 32
}
export declare enum FairlightAudioMixOption {
    Off = 1,
    On = 2,
    AudioFollowVideo = 4
}
export declare enum FairlightInputConfiguration {
    Mono = 1,
    Stereo = 2,
    DualMono = 4
}
export declare enum FairlightAnalogInputLevel {
    Microphone = 1,
    ConsumerLine = 2,
    ProLine = 4
}
export declare enum FairlightAudioSourceType {
    Mono = 0,
    Stereo = 1
}
export declare enum FairlightInputType {
    EmbeddedWithVideo = 0,
    MediaPlayer = 1,
    AudioIn = 2,
    MADI = 4
}
