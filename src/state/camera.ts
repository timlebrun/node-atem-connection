export interface CameraState {
  camera: CameraCameraState;
  lens: CameraLensState;
  chip: CameraChipState;
};

export interface CameraCameraState {
  gain?: number;
  whiteBalance?: number;
  shutter?: number;
}
export interface CameraLensState {
  focus?: number;
  autoFocus?: number; // ???
  iris?: number;
  zoomSpeed?: number;
}
export interface CameraChipState {
  lift?: CameraColorComponents;
  gamma?: CameraColorComponents;
  gain?: CameraColorComponents;
  lum?: number;
  aperture?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
}

export interface CameraColorComponents {
  red: number;
  green: number;
  blue: number;
  yellow: number;
}