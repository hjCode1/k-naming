import type { OhengElement } from '../types';

/** 천간 → 오행 */
export const GAN_TO_ELEMENT: Record<string, OhengElement> = {
  '甲': '목', '乙': '목',
  '丙': '화', '丁': '화',
  '戊': '토', '己': '토',
  '庚': '금', '辛': '금',
  '壬': '수', '癸': '수',
};

/** 지지 → 오행 */
export const ZHI_TO_ELEMENT: Record<string, OhengElement> = {
  '寅': '목', '卯': '목',
  '巳': '화', '午': '화',
  '辰': '토', '丑': '토', '戌': '토', '未': '토',
  '申': '금', '酉': '금',
  '亥': '수', '子': '수',
};

/** 오행 한자 → 한글 */
export const WUXING_TO_OHENG: Record<string, OhengElement> = {
  '木': '목',
  '火': '화',
  '土': '토',
  '金': '금',
  '水': '수',
};

/** 오행별 색상 */
export const OHENG_COLORS: Record<OhengElement, string> = {
  '목': '#6B9F6B',
  '화': '#E07A5F',
  '토': '#D4A843',
  '금': '#B8B8B8',
  '수': '#4A7DA8',
};

/** 오행별 한자 */
export const OHENG_HANJA: Record<OhengElement, string> = {
  '목': '木',
  '화': '火',
  '토': '土',
  '금': '金',
  '수': '水',
};

/** 오행 목록 (순서 고정) */
export const OHENG_LIST: OhengElement[] = ['목', '화', '토', '금', '수'];

/** 상생 관계: key가 생하는 오행 */
export const SANGSAENG: Record<OhengElement, OhengElement> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목',
};

/** 상극 관계: key가 극하는 오행 */
export const SANGGEUK: Record<OhengElement, OhengElement> = {
  '목': '토',
  '화': '금',
  '토': '수',
  '금': '목',
  '수': '화',
};

/** 천간 한글 읽기 */
export const GAN_KOREAN: Record<string, string> = {
  '甲': '갑', '乙': '을',
  '丙': '병', '丁': '정',
  '戊': '무', '己': '기',
  '庚': '경', '辛': '신',
  '壬': '임', '癸': '계',
};

/** 지지 한글 읽기 */
export const ZHI_KOREAN: Record<string, string> = {
  '子': '자', '丑': '축', '寅': '인', '卯': '묘',
  '辰': '진', '巳': '사', '午': '오', '未': '미',
  '申': '신', '酉': '유', '戌': '술', '亥': '해',
};
