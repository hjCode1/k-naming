export type OhengElement = '목' | '화' | '토' | '금' | '수';

export type CalendarType = 'solar' | 'lunar' | 'lunar_leap';

export type Gender = 'male' | 'female';

export interface BirthInput {
  surname: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number; // 0-23, -1 for unknown
  gender: Gender;
  calendarType: CalendarType;
}

export interface Pillar {
  gan: string;
  zhi: string;
  ganZhi: string;
  ganElement: OhengElement;
  zhiElement: OhengElement;
  napiyin: string;
}

export interface OhengDistribution {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  dayMaster: string;
  dayMasterElement: OhengElement;
  ohpiengDistribution: OhengDistribution;
  deficientElements: OhengElement[];
  strongElements: OhengElement[];
  lunarDate: { year: number; month: number; day: number };
  solarDate: { year: number; month: number; day: number };
}

export interface HanjaEntry {
  hanja: string;
  meaning: string;
  reading: string;
  strokes: number;
  element: OhengElement;
}

export interface GyeokResult {
  value: number;
  luck: string;
  name: string;
  description: string;
}

export interface SuriResult {
  wonGyeok: GyeokResult;
  hyeongGyeok: GyeokResult;
  iGyeok: GyeokResult;
  jeongGyeok: GyeokResult;
  totalScore: number;
}

export interface NameCandidate {
  char1: HanjaEntry;
  char2: HanjaEntry;
  fullName: string;
  suriResult: SuriResult;
}

export interface AiNameRecommendation {
  hangul: string;
  hanja: string;
  meaning: string;
  reason: string;
}
