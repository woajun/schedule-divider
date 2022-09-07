/* eslint-disable import/prefer-default-export */
/* eslint-disable vue/max-len */
import type { Worker, Workdays, Shift } from '@/interfaces';
import { deepcopy, iterate, shuffle } from '../helper';

interface Flags {
  lastdayWorkerFlag: boolean,
  previouseWorkerFlag: boolean,
  workOnceADayFlag: boolean,
}

interface Work {
  type: string,
  shifts: Array<number[]>,
}

type DateMap = Map<number, Work>;

const findDayType = (workdays: Workdays, i:number) => {
  if (workdays.weekday.includes(i)) {
    return 'weekday';
  }
  if (workdays.weekend.includes(i)) {
    return 'weekend';
  }
  return 'empty';
};

const reduceAllotment = (workers:Worker[], type:'weekday' | 'weekend', shift: number) => {
  workers.forEach((e) => {
    e[type][shift] -= 1;
  });
};

const getPreviousWorker = (c:number[][], f:Flags) => {
  if (!f.previouseWorkerFlag) return [];
  return c.length > 0 ? c[c.length - 1] : [];
};

const getLastdayWorker = (result: DateMap, f:Flags) => {
  if (!f.lastdayWorkerFlag) return [];
  const lastOutput = result.size > 0 ? result.get(result.size - 1) : undefined;
  console.log('lastOutput', lastOutput);
  return lastOutput && lastOutput.shifts.length > 1 ? lastOutput.shifts[lastOutput.shifts.length - 1] : [];
};

const getLastWorker = (idx: number, result: DateMap, c:number[][], f:Flags) => (
  idx === 0 ? getLastdayWorker(result, f) : getPreviousWorker(c, f)
);

const getAlreadyWorker = (c: number[][], f:Flags) => (f.workOnceADayFlag ? c.flat() : []);

const doAssign = (l:number, workdays: Workdays, workers: Worker[], s: Shift[], f: Flags) => {
  const b = 1 + 1;
  return iterate(l).reduce((map, i) => {
    const date = i + 1;
    const type = findDayType(workdays, date);
    const shifts = s.reduce((c, shift, idx) => {
      if (type === 'empty') return c;
      const filterd = workers
        .filter((e) => !e.avoidDays.includes(date))
        .filter((e) => !getLastWorker(idx, map, c, f).includes(e.id))
        .filter((e) => !getAlreadyWorker(c, f).includes(e.id))
        .filter((e) => e[type][idx] > 0);
      const shuffled = shuffle(filterd);
      const assigned = shuffled.slice(0, shift.num);
      reduceAllotment(assigned, type, idx);
      c.push(assigned.map((e) => e.id));
      return c;
    }, Array<number[]>());
    const output: Work = {
      type,
      shifts,
    };
    map.set(date, output);

    return map;
  }, new Map<number, Work>());
};
export const randomAssign = (workers:Worker[], workdays: Workdays, s: Shift[], f: Flags) => {
  const length = new Date(workdays.year, workdays.month, 0).getDate();

  let result:DateMap;
  let error = 1;
  let i = 0;
  do {
    const w = deepcopy(workers);
    result = doAssign(length, workdays, w, s, f);
    error = w
      .map((e) => [...e.weekday, ...e.weekend])
      .flat()
      .reduce((p, c) => p + c, 0);
    i += 1;
  } while (i < 1 && error !== 0);

  if (error !== 0) {
    alert('1000가지 경우의 수에 실패했습니다. 조건을 변경하고 다시 시도해보세요!');
  }
  return result;
};
