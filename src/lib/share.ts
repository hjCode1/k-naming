import type { BirthInput } from '../types';
import html2canvas from 'html2canvas';

/** BirthInput을 URL search params로 인코딩 */
export function encodeToURL(
  input: BirthInput,
  name1?: string,
  name2?: string,
): string {
  const params = new URLSearchParams();
  params.set('s', input.surname);
  params.set('y', String(input.birthYear));
  params.set('m', String(input.birthMonth));
  params.set('d', String(input.birthDay));
  params.set('h', String(input.birthHour));
  params.set('g', input.gender === 'male' ? 'm' : 'f');
  params.set('c', input.calendarType === 'solar' ? 's' : input.calendarType === 'lunar' ? 'l' : 'p');
  if (name1) params.set('n1', name1);
  if (name2) params.set('n2', name2);
  return `${window.location.origin}/result?${params.toString()}`;
}

/** URL search params에서 BirthInput 디코딩 */
export function decodeFromURL(params: URLSearchParams): BirthInput | null {
  const s = params.get('s');
  const y = params.get('y');
  const m = params.get('m');
  const d = params.get('d');

  if (!s || !y || !m || !d) return null;

  const genderMap: Record<string, 'male' | 'female'> = { m: 'male', f: 'female' };
  const calendarMap: Record<string, BirthInput['calendarType']> = {
    s: 'solar', l: 'lunar', p: 'lunar_leap',
  };

  return {
    surname: s,
    birthYear: Number(y),
    birthMonth: Number(m),
    birthDay: Number(d),
    birthHour: Number(params.get('h') ?? -1),
    gender: genderMap[params.get('g') ?? 'm'] ?? 'male',
    calendarType: calendarMap[params.get('c') ?? 's'] ?? 'solar',
  };
}

/** NameCard 요소를 PNG 이미지로 저장 */
export async function exportNameCard(element: HTMLElement): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#FFF8F0',
    useCORS: true,
  });
  const link = document.createElement('a');
  link.download = 'k-naming-card.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/** 클립보드에 URL 복사 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
