<!-- eslint-disable no-nested-ternary -->
<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable vue/max-len -->
<script setup lang="ts">
import { ref } from 'vue';
import type {
  CalendarIO, Shift, Workdays, Worker,
} from '@/interfaces';
import { deepcopy, iterate, shuffle } from '../helper';
import CalendarShape from './CalendarShape.vue';

interface Output {
  date: number,
  shifts: Array<string[]>,
}

interface InnerOutput {
  date: number,
  shifts: number[][],
}

const props = defineProps<{
  io:CalendarIO
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

const iterateDate = (workdays: Workdays, workers: Worker[], s: Shift[]) => iterate(31).reduce((result, i) => {
  const date = i + 1;
  const type = findDayType(workdays, date);

  const lastOutput = result.length > 1 ? result[result.length - 1] : undefined;
  const lastdayWorker = lastOutput ? lastOutput.shifts[lastOutput.shifts.length - 1] : [];

  const filteredAvoidDays = workers.filter((e) => !e.avoidDays.includes(date));

  const shifts = s.reduce((c, shift, idx) => {
    if (type === 'empty') return c;
    const lastWorker = idx === 0 ? lastdayWorker : c.length > 1 ? c[c.length - 1] : undefined;
    const filterd = filteredAvoidDays
      .filter((e) => !lastWorker?.includes(e.id))
      .filter((e) => e[type][idx] > 0);
    const shuffled = shuffle(filterd);
    const sliced = shuffled.slice(0, shift.num);
    sliced.forEach((e) => {
      e[type][idx] -= 1;
    });
    const ids = sliced.map((e) => e.id);
    c.push(ids);
    return c;
  }, [] as number[][]);
  const output: InnerOutput = {
    date,
    shifts,
  };
  result.push(output);

  return result;
}, [] as InnerOutput[]);

const convertIdToName = (schedule: InnerOutput[], workers:Worker[]): Output[] => {
  const findID = (id:number) => {
    const found = workers.find((e) => e.id === id);
    if (!found) return 'invalidID';
    return found.name;
  };
  const idsToNames = (ids: number[]) => ids.map((id) => findID(id));
  const shiftsToNames = (shifts: number[][]) => shifts.map((ids) => idsToNames(ids));
  return schedule.map((e) => ({
    date: e.date,
    shifts: shiftsToNames(e.shifts),
  }));
};

const randomAssign = (workers:Worker[], workdays: Workdays, s: Shift[]) => {
  const schedule = iterateDate(workdays, workers, s);
  return convertIdToName(schedule, workers);
};

const makeOutput = (schedule: Output[], { year, month }: Workdays) => {
  const margin = getMargin(year, month);
  const ouputMargin: Output[] = iterate(margin, { date: 0, shifts: [] });
  const merged = ouputMargin.concat(schedule);
  const count = Math.ceil(merged.length / 7);
  return iterate(count).map((i) => merged.slice((i) * 7, (i + 1) * 7));
};

const output = ref<Output[][]>([]);

const onClick = () => {
  const w = deepcopy(props.io.workers);
  const d = props.io.workdays;
  const s = props.io.shifts;
  const schedule = randomAssign(w, d, s);
  output.value = makeOutput(schedule, d);
};

</script>
<template>
  <div>
    <button @click="onClick">
      날짜 분배
    </button>
    <br>
    <h2>{{ props.io.workdays.year }} 년 {{ props.io.workdays.month }} 월 근무표</h2>
    <CalendarShape :output="output" />
  </div>
</template>
