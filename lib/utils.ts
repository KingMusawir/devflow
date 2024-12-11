import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { techMap } from '@/constants/techMap';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techname: string) => {
  const normalizedTechname = techname.replace(/[ .]/g, '').toLowerCase();

  return techMap[normalizedTechname]
    ? `${techMap[normalizedTechname]} colored`
    : 'devicon-javascript-plain';
};
