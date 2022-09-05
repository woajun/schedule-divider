/* eslint-disable prefer-destructuring */
import { shuffle } from '../helper';
import { makeWorkdayArray } from './makeWorkdayArray';
import type { Shift, Workdays, Worker } from '@/interfaces';

/* eslint-disable import/prefer-default-export */
export const fixWorker = (w:Worker[], d: Workdays, s: Shift[]) => {
  const arr = makeWorkdayArray({
    people: w.length,
    weekdays: d.weekday.length,
    weekends: d.weekend.length,
    shifts: s.length,
    perShift: s[0].num,
  });

  const shuffled = shuffle(w);
  return shuffled.map((e, i) => {
    e.weekday = arr[i][0];
    e.weekend = arr[i][1];
    return e;
  });
};
