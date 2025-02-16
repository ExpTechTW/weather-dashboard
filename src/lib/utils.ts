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
