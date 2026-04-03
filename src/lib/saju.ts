import { Solar, Lunar } from 'lunar-typescript';
import type { BirthInput, Pillar, SajuResult, OhengElement } from '../types';
import { GAN_TO_ELEMENT, ZHI_TO_ELEMENT } from '../constants/oheng';
import { countElements, findDeficientElements, findStrongElements } from './oheng';

function buildPillar(
  ganZhi: string,
  napiyin: string,
): Pillar {
  const gan = ganZhi[0];
  const zhi = ganZhi[1];
  return {
    gan,
    zhi,
    ganZhi,
    ganElement: GAN_TO_ELEMENT[gan],
    zhiElement: ZHI_TO_ELEMENT[zhi],
    napiyin,
  };
}

export function calculateSaju(input: BirthInput): SajuResult {
  const hasHour = input.birthHour >= 0;
  const hour = hasHour ? input.birthHour : 12;

  let solar: InstanceType<typeof Solar>;

  if (input.calendarType === 'solar') {
    solar = Solar.fromYmdHms(
      input.birthYear, input.birthMonth, input.birthDay,
      hour, 0, 0,
    );
  } else {
    const lunar = Lunar.fromYmdHms(
      input.birthYear, input.birthMonth, input.birthDay,
      hour, 0, 0,
    );
    solar = lunar.getSolar();
  }

  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const yearPillar = buildPillar(ec.getYear(), ec.getYearNaYin());
  const monthPillar = buildPillar(ec.getMonth(), ec.getMonthNaYin());
  const dayPillar = buildPillar(ec.getDay(), ec.getDayNaYin());
  const hourPillar = hasHour
    ? buildPillar(ec.getTime(), ec.getTimeNaYin())
    : null;

  const dayMaster = ec.getDayGan();
  const dayMasterElement = GAN_TO_ELEMENT[dayMaster];

  // Collect all elements from pillars
  const elements: OhengElement[] = [
    yearPillar.ganElement, yearPillar.zhiElement,
    monthPillar.ganElement, monthPillar.zhiElement,
    dayPillar.ganElement, dayPillar.zhiElement,
  ];
  if (hourPillar) {
    elements.push(hourPillar.ganElement, hourPillar.zhiElement);
  }

  const distribution = countElements(elements);
  const deficientElements = findDeficientElements(distribution);
  const strongElements = findStrongElements(distribution);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    dayMasterElement,
    ohpiengDistribution: distribution,
    deficientElements,
    strongElements,
    lunarDate: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
    },
    solarDate: {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
    },
  };
}
