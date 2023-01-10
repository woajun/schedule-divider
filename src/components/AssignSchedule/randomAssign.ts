/* eslint-disable import/prefer-default-export */
/* eslint-disable vue/max-len */
import type { Worker, Workdays, Shift } from '@/interfaces';
import { deepcopy, getDatesArray, shuffle } from '../helper';

interface Flags {
  lastWorkerBanFirstWork: boolean,
  banContinuousWork: boolean,
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

function calcShifts(s: Shift[], workers: Worker[], date: number, type: 'weekday' | 'weekend' | 'empty', map: Map<number, Work>, f: Flags) {
  const filterLastdayLastWorker = (filtered: Worker[]) => {
    const lastdayLastWorkerIds = map.get(date - 1)?.shifts[s.length - 1] ?? [];
    return filtered.filter((worker) => !lastdayLastWorkerIds.includes(worker.id));
  };

  const filterNextdayFirstWorker = (filtered: Worker[]) => {
    const nextdayFirstWorkerIds = map.get(date + 1)?.shifts[0] ?? [];
    return filtered.filter((worker) => !nextdayFirstWorkerIds.includes(worker.id));
  };

  const filterLastWorker = (c: number[][], filtered: Worker[]) => {
    const lastWorkerIds = c[c.length - 1];
    return filtered.filter((worker) => !lastWorkerIds.includes(worker.id));
  };

  const filterAlreadyAssignee = (filtered: Worker[], c: number[][]): Worker[] => filtered
    .filter((worker) => !c.flat().includes(worker.id));

  const filterExhaustAssign = (filtered: Worker[], t:'weekday' | 'weekend', i: number): Worker[] => filtered
    .filter((worker) => worker[t][i] > 0);

  if (type === 'empty') return [];
  return s.reduce((c, shift, idx) => {
    let filtered = workers.filter((worker) => !worker.avoidDays.includes(date));

    if (idx === 0 && f.lastWorkerBanFirstWork) {
      filtered = filterLastdayLastWorker(filtered);
    }

    if (idx === s.length - 1 && f.lastWorkerBanFirstWork) {
      filtered = filterNextdayFirstWorker(filtered);
    }

    if (c.length > 0 && f.banContinuousWork) {
      filtered = filterLastWorker(c, filtered);
    }

    if (f.workOnceADayFlag) {
      filtered = filterAlreadyAssignee(filtered, c);
    }

    filtered = filterExhaustAssign(filtered, type, idx);

    shuffle(filtered);

    filtered.sort((a, b) => b[type][idx] - a[type][idx]);

    const assignee = filtered.slice(0, shift.num);
    reduceAllotment(assignee, type, idx);
    c.push(assignee.map((e) => e.id));
    return c;
  }, Array<number[]>());
}

const doAssign = (workdays: Workdays, workers: Worker[], s: Shift[], f: Flags) => shuffle(getDatesArray(workdays.year, workdays.month))
  .reduce((map, date) => {
    const type = findDayType(workdays, date);
    map.set(date, {
      type,
      shifts: calcShifts(s, workers, date, type, map, f),
    });

    return map;
  }, new Map<number, Work>());

export const assignIterate = (workers:Worker[], workdays: Workdays, s: Shift[], f: Flags) => {
  let result:DateMap;
  let error = 1;
  let i = 0;
  do {
    const w = deepcopy(workers);
    result = doAssign(workdays, w, s, f);
    error = w
      .map((e) => [...e.weekday, ...e.weekend])
      .flat()
      .reduce((p, c) => p + c, 0);
    i += 1;
  } while (i < 1000 && error !== 0);

  if (error !== 0) {
    alert('1000가지 경우의 수에 실패했습니다. 조건을 변경하고 다시 시도해보세요!');
  }
  return result;
};
