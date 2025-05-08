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

export function getIntensityColorBg(intensity: number): string {
  switch (intensity) {
    case 0:
      return '#202020';
    case 1:
      return '#003264';
    case 2:
      return '#0064c8';
    case 3:
      return '#1e9632';
    case 4:
      return '#ffc800';
    case 5:
      return '#ff9600';
    case 6:
      return '#ff6400';
    case 7:
      return '#ff0000';
    case 8:
      return '#c00000';
    case 9:
      return '#9600c8';
    default:
      return '#202020';
  }
}

export function getIntensityColorText(intensity: number): string {
  switch (intensity) {
    case 0:
      return '#ffffff';
    case 1:
      return '#ffffff';
    case 2:
      return '#ffffff';
    case 3:
      return '#ffffff';
    case 4:
      return '#000000';
    case 5:
      return '#000000';
    case 6:
      return '#000000';
    case 7:
      return '#ffffff';
    case 8:
      return '#ffffff';
    case 9:
      return '#ffffff';
    default:
      return '#ffffff';
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
