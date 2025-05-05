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

export function getIntensityColor(intensity: number): string {
  switch (intensity) {
    case 0:
      return '#79E5FD';
    case 1:
      return '#49E9AD';
    case 2:
      return '#44fa34';
    case 3:
      return '#beff0c';
    case 4:
      return '#fff000';
    case 5:
      return '#ff9300';
    case 6:
      return '#fc5235';
    case 7:
      return '#b720e9';
    case 8:
      return '#800080';
    case 9:
      return '#ff0000';
    default:
      return '#79E5FD';
  }
}

export function getIntensityText(intensity: number): string {
  switch (intensity) {
    case 0:
      return '0';
    case 1:
      return '1';
    case 2:
      return '2';
    case 3:
      return '3';
    case 4:
      return '4';
    case 5:
      return '5弱';
    case 6:
      return '5強';
    case 7:
      return '6弱';
    case 8:
      return '6強';
    case 9:
      return '7';
    default:
      return '0';
  }
}
