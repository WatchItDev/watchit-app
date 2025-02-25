// ----------------------------------------------------------------------

type EaseType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate"
  | number[];

export interface VariantsType {
  distance?: number;
  durationIn?: number;
  durationOut?: number;
  easeIn?: EaseType;
  easeOut?: EaseType;
}

export interface TranHoverType {
  duration?: number;
  ease?: EaseType;
}

export interface TranEnterType {
  durationIn?: number;
  easeIn?: EaseType;
}

export interface TranExitType {
  durationOut?: number;
  easeOut?: EaseType;
}

export interface BackgroundType {
  colors?: string[];
  duration?: number;
  ease?: EaseType;
}
