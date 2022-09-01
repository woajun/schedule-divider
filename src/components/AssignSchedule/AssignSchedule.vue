<script setup lang="ts">
import { ref } from 'vue';
import type { CalendarIO } from '@/interfaces';
import { iterate } from '../helper';
import CalendarShape from './CalendarShape.vue';

interface Output {
  date: number,
  weekday: number,
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
