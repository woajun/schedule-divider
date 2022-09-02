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

const outputs = ref<Output[]>();

const onClick = () => {
  createCalendarShape();
  const w = deepcopy(props.io.workers);
  const d = props.io.workdays;
  const s = props.io.shifts;
  // 셔플하고 조건검사하고 붙이고 반복

  // 1일을 잡고 weekend다. 하면 weekend 검사 숫자있는 애들만
  // 조건검사하고 넣는다.
  // 2일을 잡고 weekend다. 하면 weekend 검사 숫자있는 애들만
  // 조건검사하고 넣는다.
  // 3일을 잡고 weekday다. 하면 weekday 검사 숫자있는 애들만
  // 조건검사하고 넣는다.

  // 조건검사 항목
  // 1. weekday,또는 weekend 해당 숫자가 0 이상일 것.
  // 2. 바로 전 근무가 아닐 것.
  // 3. avoidDays가 아닐 것.
  // 4. 인원이 전부 다 불만족하면 처음부터 다시 짤 것.

  const findDayType = (i:number) => {
    if (d.weekday.includes(i)) {
      return 'weekday';
    }
    if (d.weekend.includes(i)) {
      return 'weekend';
    }
    return 'empty';
  };

  outputs.value = iterate(31).reduce((result, i) => {
    const date = i + 1;
    const type = findDayType(date);

    const lastOutput = result.length > 1 ? result[result.length - 1] : undefined;
    const lastdayWorker = lastOutput ? lastOutput.shifts[lastOutput.shifts.length - 1] : [];

    const filteredAvoidDays = w.filter((e) => !e.avoidDays.includes(date));

    // 여기서 근무로 순회해야함.
    const shifts = s.reduce((c, shift, idx) => {
      if (type === 'empty') return [];
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
