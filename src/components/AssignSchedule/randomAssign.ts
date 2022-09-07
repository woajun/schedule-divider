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

// 1. 날짜를 배열로 만든다.
// 2. 날짜의 전 날과 다음 날을 고른다.
// 3. 필터링을 한다.
// 4. 날짜에 근무자를 지정한다. (숫자가 많은 순)
const doAssign = (l:number, workdays: Workdays, workers: Worker[], s: Shift[]) => {
  const dates = shuffle(iterate(l).map((i) => i + 1));
  return dates.reduce((map, date) => {
    // console.log(date);
    const lastdayLastWorkerIds = map.get(date - 1)?.shifts[s.length - 1] ?? [];
    // console.log(`lastdayLastWorkerIds: ${date - 1}`, lastdayLastWorkerIds);
    const nextdayFirstWorkerIds = map.get(date + 1)?.shifts[0] ?? [];
    // console.log(`nextdayFirstWorkerIds: ${date + 1}`, nextdayFirstWorkerIds);
    const type = findDayType(workdays, date);
    const shifts = s.reduce((c, shift, idx) => {
      if (type === 'empty') return c;
      let filtered = workers.filter((e) => !e.avoidDays.includes(date));
      if (idx === 0) {
        filtered = filtered.filter((e) => !lastdayLastWorkerIds.includes(e.id));
      }
      if (idx === s.length - 1) {
        filtered = filtered.filter((e) => !nextdayFirstWorkerIds.includes(e.id));
      }
      filtered = filtered.filter((e) => !c.flat().includes(e.id));
      filtered = filtered.filter((e) => e[type][idx] > 0);
      filtered.sort((a, b) => b[type][idx] - a[type][idx]);
      const assigned = filtered.slice(0, shift.num);
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
    result = doAssign(length, workdays, w, s);
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
