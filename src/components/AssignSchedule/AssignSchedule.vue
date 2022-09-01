<script setup lang="ts">
import { computed, watch } from 'vue';
import { iterate } from '../helper';

interface Worker {
  id: number,
  name: string,
  avoidDays: number[],
  weekday: number[],
  weekend: number[],
}

interface CalendarIO {
  year: number,
  month: number,
  worker: Worker[]
}

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

const calendarShape = computed(() => {
  const y = props.io.year;
  const m = props.io.month;
  const length = new Date(y, m, 0).getDate();
  const firstday = new Date(y, m - 1, 1).getDay();
  const date = iterate(length).map((i) => i + 1);
  const margin = iterate(firstday, 0);
  return margin.concat(date);
});

</script>
<template>
  {{ calendarShape }}
  <div>
    <button>날짜 분배</button>
    오후 근무시 다음날 오전은 가능한 피하기.
  </div>
</template>
