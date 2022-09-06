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

  console.log('maped', maped);
  return maped;
};
export const distributeWorking = (workers: SpecifyWorker[], d: Workdays, s: Shift[]) => {
  const dd = d.weekday;
  const de = d.weekend;

  const distributed = distributeWork(dd, de, workers.length, s);
  const point = distributed.length / 2;
  const wArr = distributed.slice(0, point);
  const hArr = distributed.slice(point);

  const result = iterate(workers.length).map((i) => ({
    weekday: wArr.map((e) => e[i]),
    weekend: hArr.map((e) => e[i]),
  }));
  const shuffled = shuffle(result);

  workers.forEach((w, i) => {
    w.weekday = shuffled[i].weekday;
    w.weekend = shuffled[i].weekend;
  });
};
