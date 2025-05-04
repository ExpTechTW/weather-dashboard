import { type ClassValue, clsx } from 'clsx';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import 'moment/locale/zh-tw';

// eslint-disable-next-line import-x/no-named-as-default-member
moment.locale('zh-tw');

export const time = (t: moment.MomentInput) => moment(t).format('HH:mm:ss');

export const date = (t: moment.MomentInput) => moment(t).format('yyyy年MM月DD日 dddd');

export function getColor(intensity: number): string {
  switch (intensity) {
    case 0:
      return '#FFFFFF';
    case 1:
      return '#D4F2D2';
    case 2:
      return '#7BEA7B';
    case 3:
      return '#FFFF00';
    case 4:
      return '#FFA500';
    case 5:
      return '#FF0000';
    case 6:
      return '#800000';
    case 7:
      return '#FF00FF';
    default:
      return '#FFFFFF';
  }
}
