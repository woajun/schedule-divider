<script setup lang="ts">
import { ref } from 'vue';
import type { CalendarIO } from '@/interfaces';
import { iterate } from '../helper';
import CalendarShape from './CalendarShape.vue';

interface Output {
  date: number,
  workerIDs: number[],
}

const sample = [
  { date: 1, workerIDs: [2, 3] },
  { date: 2, workerIDs: [3, 2] },
  { date: 3, workerIDs: [3, 2] },
  { date: 4, workerIDs: [2, 3] },
  { date: 5, workerIDs: [3, 2] },
  { date: 6, workerIDs: [3, 2] },
  // 8일은 없음
  { date: 7, workerIDs: [3, 2] },
  { date: 9, workerIDs: [3, 2] },
  { date: 10, workerIDs: [3, 2] },
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

const onClick = () => {
  createCalendarShape();
  const w = props.io.workers;
  const d = props.io.workdays;
  console.log('w', w);
  console.log('d', d);
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
  // 5. 10번 다시 짯는데 불만족하면 경고 후 그냥 쓸 것.
};

</script>
<template>
  {{ calendarShape }}
  <div>
    <button @click="onClick">
      날짜 분배
    </button>
    <br>
    오후 근무시 다음날 오전은 가능한 피하기.
    <br>
    {{ props.io.workdays.year }} 년 {{ props.io.workdays.month }} 월 근무표
    <CalendarShape :month="calendarShape" />
  </div>
</template>
