<!-- eslint-disable no-alert -->
<!-- eslint-disable no-nested-ternary -->
<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable vue/max-len -->
<script setup lang="ts">
import { ref } from 'vue';
import type {
  Shift, Workdays, Worker,
} from '@/interfaces';
import { deepcopy, iterate, shuffle } from '../helper';
import CalendarShape from './CalendarShape.vue';
import type { InnerOutput, Output } from './interfaces';
import { fixWorker } from '../DistributeWorking/fixWorker';

const props = defineProps<{
  workers: Worker[]
  shifts: Shift[]
  workdays: Workdays
}>();

const getMargin = (y:number, m:number) => new Date(y, m - 1, 1).getDay();

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

const lastdayWorkerFlag = ref(true);

const getLastdayWorker = (result: InnerOutput[]) => {
  if (!lastdayWorkerFlag.value) return [];
  const lastOutput = result.length > 0 ? result[result.length - 1] : undefined;
  return lastOutput && lastOutput.shifts.length > 1 ? lastOutput.shifts[lastOutput.shifts.length - 1] : [];
};

const previouseWorkerFlag = ref(true);

const getPreviousWorker = (c:number[][]) => {
  if (!previouseWorkerFlag.value) return [];
  return c.length > 0 ? c[c.length - 1] : [];
};

const getLastWorker = (idx: number, result: InnerOutput[], c:number[][]) => (
  idx === 0 ? getLastdayWorker(result) : getPreviousWorker(c)
);

const workOnceADayFlag = ref(true);

const getAlreadyWorker = (c: number[][]) => (workOnceADayFlag.value ? c.flat() : []);

const doAssign = (l:number, workdays: Workdays, workers: Worker[], s: Shift[]) => iterate(l).reduce((result, i) => {
  const date = i + 1;
  const type = findDayType(workdays, date);
  const shifts = s.reduce((c, shift, idx) => {
    if (type === 'empty') return c;
    const filterd = workers
      .filter((e) => !e.avoidDays.includes(date))
      .filter((e) => !getLastWorker(idx, result, c).includes(e.id))
      .filter((e) => !getAlreadyWorker(c).includes(e.id))
      .filter((e) => e[type][idx] > 0);
    const shuffled = shuffle(filterd);
    const assigned = shuffled.slice(0, shift.num);
    reduceAllotment(assigned, type, idx);
    c.push(assigned.map((e) => e.id));
    return c;
  }, Array<number[]>());
  const output: InnerOutput = {
    date,
    shifts,
  };
  result.push(output);

  return result;
}, Array<InnerOutput>());

const iterateDate = (workdays: Workdays, workers: Worker[], s: Shift[]) => {
  const length = new Date(workdays.year, workdays.month, 0).getDate();

  let result:InnerOutput[] = [];
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

const convertIdToWorker = (schedule: InnerOutput[], workers:Worker[]) : Output[] => {
  const findID = (id:number): Worker => {
    const found = workers.find((e) => e.id === id);
    if (!found) throw new Error('error');
    return found;
  };
  const idsToWorker = (ids: number[]) => ids.map((id) => findID(id));
  const shiftsToWorkers = (shifts: number[][]) => shifts.map((ids) => idsToWorker(ids));
  return schedule.map((e) => ({
    date: e.date,
    shifts: shiftsToWorkers(e.shifts),
  }));
};

const randomAssign = (w:Worker[], d: Workdays, s: Shift[]) => iterateDate(d, w, s);

const makeOutput = (schedule: Output[], { year, month }: Workdays) => {
  const merged = iterate<Output>(getMargin(year, month), { date: 0, shifts: [] }).concat(schedule);
  const count = Math.ceil(merged.length / 7);
  return iterate(count).map((i) => merged.slice((i) * 7, (i + 1) * 7));
};

const y = ref<number>(0);
const m = ref<number>(0);
const output = ref<Output[][]>([]);

const onClick = () => {
  const d = props.workdays;
  const s = props.shifts;
  const w = deepcopy(fixWorker(props.workers, d, s));

  const assigned = randomAssign(w, d, s);
  const schedule = convertIdToWorker(assigned, w);
  output.value = makeOutput(schedule, d);

  y.value = d.year;
  m.value = d.month;
};

</script>
<template>
  <div>
    날짜분배옵션
    <br />
    <label>
      <input v-model="lastdayWorkerFlag" type="checkbox" />
      말번 다음 날 초번을 제외함
    </label>
    <br />
    <label>
      <input v-model="previouseWorkerFlag" type="checkbox" />
      연속 근무를 제한함
    </label>
    <br />
    <label>
      <input v-model="workOnceADayFlag" type="checkbox" />
      하루에 최대 한 번 근무함.
    </label>
    <br />
    <br />
    <button @click="onClick">
      날짜 분배
    </button>
    <br>
    <h2>{{ y }} 년 {{ m }} 월 근무표</h2>
    <CalendarShape :output="output" />
  </div>
</template>
