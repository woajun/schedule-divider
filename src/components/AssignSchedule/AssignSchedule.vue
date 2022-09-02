<script setup lang="ts">
import { ref } from 'vue';
import type { CalendarIO, Worker } from '@/interfaces';
import { deepcopy, iterate, shuffle } from '../helper';
import CalendarShape from './CalendarShape.vue';

interface Output {
  date: number,
  shifts: number[][],
}

const sample = [
  { date: 1, shifts: [[2, 3], [4, 5]] },
  { date: 2, shifts: [[2, 3], [4, 6]] },
  { date: 3, shifts: [[2, 5], [3, 6]] },
  { date: 4, shifts: [[4, 5], [2, 6]] },
  { date: 5, shifts: [[2, 3], [4, 6]] },
  { date: 6, shifts: [[2, 3], [4, 6]] },
  // 7일은 없음
  { date: 8, shifts: [[4, 5], [2, 3]] },
  // ...
];

const props = defineProps<{
  io:CalendarIO
}>();

const calendarShape = ref<number[][]>([[]]);

const createCalendarShape = () => {
  const y = props.io.workdays.year;
  const m = props.io.workdays.month;
  const length = new Date(y, m, 0).getDate();
  const firstday = new Date(y, m - 1, 1).getDay();
  const date = iterate(length).map((i) => i + 1);
  const margin = iterate(firstday, 0);
  const marginDate = margin.concat(date);

  const count = Math.ceil(marginDate.length / 7);
  calendarShape.value = iterate(count).map((i) => marginDate.slice((i) * 7, (i + 1) * 7));
};

const outputs = ref<Output[]>([]);

const onClick = () => {
  createCalendarShape();
  const w = deepcopy(props.io.workers);
  const d = props.io.workdays;
  const s = props.io.shifts;

  const findDayType = (i:number) => {
    if (d.weekday.includes(i)) {
      return 'weekday';
    }
    if (d.weekend.includes(i)) {
      return 'weekend';
    }
    return 'empty';
  };

  const apple = iterate(31).reduce((result, i) => {
    const date = i + 1;
    const type = findDayType(date);

    const lastOutput = result.length > 1 ? result[result.length - 1] : undefined;
    const lastdayWorker = lastOutput ? lastOutput.shifts[lastOutput.shifts.length - 1] : [];

    const filteredAvoidDays = w.filter((e) => !e.avoidDays.includes(date));

    // 여기서 근무로 순회해야함.
    const shifts = s.reduce((c, shift, idx) => {
      if (type === 'empty') return c;
      const lastWorker = idx === 0 ? lastdayWorker : c[c.length - 1];
      const filterd = filteredAvoidDays
        .filter((e) => !lastWorker.includes(e.id))
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
    const output: Output = {
      date,
      shifts,
    };
    result.push(output);

    return result;
  }, [] as Output[]);
  outputs.value = apple;

  const findID = (id:number) => {
    const found = props.io.workers.find((e) => e.id === id);
    if (!found) return 'invalidID';
    return found.name;
  };

  const idsToNames = (ids: number[]) => ids.map((id) => findID(id));

  const shiftsToNames = (shifts: number[][]) => shifts.map((ids) => idsToNames(ids));

  const banana = apple.map((e) => ({
    date: e.date,
    shifts: shiftsToNames(e.shifts),
  }));

  console.log(banana);
};

</script>
<template>
  {{ calendarShape }}
  <div>
    <button @click="onClick">
      날짜 분배
    </button>
    {{ outputs }}
    <br>
    오후 근무시 다음날 오전은 가능한 피하기.
    <br>
    {{ props.io.workdays.year }} 년 {{ props.io.workdays.month }} 월 근무표
    <CalendarShape :month="calendarShape" />
  </div>
</template>
