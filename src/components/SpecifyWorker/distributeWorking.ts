/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import type { Shift, SpecifyWorker, Workdays } from '@/interfaces';
import {
  calcRest, iterate, shuffle, splitInt,
} from '../helper';

const distributeWork = (dd:number[], de: number[], p: number, s:Shift[]) => {
  const ddTotal = s.map((e) => e.num * dd.length);
  const deTotal = s.map((e) => e.num * de.length);

  const ddInts = ddTotal.map((e) => splitInt(e, p));
  const deInts = deTotal.map((e) => splitInt(e, p));
  const ints = ddInts.concat(deInts);

  const ddRests = ddTotal.map((e) => calcRest(e, p));
  const deRests = deTotal.map((e) => calcRest(e, p));
  const rests = ddRests.concat(deRests);

  let point = 0;
  const maped = rests.map((r, i) => {
    const t = [...ints[i]];
    iterate(r).forEach((idx) => {
      const index = (idx + point) % p;
      t[index] += 1;
    });
    point += r;
    return t;
  });

  return maped;
};

const perWorker = (distributed: number[][], workersLng: number) => {
  const point = distributed.length / 2;
  const weekdays = distributed.slice(0, point);
  const weekends = distributed.slice(point);

  return iterate(workersLng).map((i) => ({
    weekday: weekdays.map((e) => e[i]),
    weekend: weekends.map((e) => e[i]),
  }));
};

export const distributeWorking = (
  workers: SpecifyWorker[],
  { weekday, weekend }: Workdays,
  shifts: Shift[],
) => {
  const distributed = distributeWork(weekday, weekend, workers.length, shifts);
  const shuffled = shuffle(perWorker(distributed, workers.length));

  workers.forEach((w, i) => {
    w.weekday = shuffled[i].weekday;
    w.weekend = shuffled[i].weekend;
  });
};
