<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { iterate } from './helper';
import DateButtonTable from './SpecifyDate/DateButtonTable.vue';

interface Day {
  date: number,
  weekday: number,
  type: 'work' | 'holiday' | 'disabled' | string,
}

const now = new Date();
const opYears = iterate(5).map((i) => now.getFullYear() + i);
const opMonths = iterate(12).map((i) => i + 1);

const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 2);

const days = computed<Day[]>(() => {
  const lastDay = new Date(year.value, month.value, 0);
  const length = lastDay.getDate();
  const result = iterate(length).map((i) => {
    const aDay = new Date(year.value, month.value - 1, i + 1);
    const weekday = aDay.getDay();
    const isHoliday = !!(aDay.getDay() === 0 || aDay.getDay() === 6);
    return reactive({
      date: aDay.getDate(),
      weekday,
      type: isHoliday ? 'holiday' : 'work',
    });
  });
  return result;
});
</script>
<template>
  <div>
    <select v-model="year">
      <option v-for="y in opYears" :key="y" :value="y">
        {{ y }}
      </option>
    </select>
    년
    <select v-model="month">
      <option v-for="m in opMonths" :key="m" :value="m">
        {{ m }}
      </option>
    </select>
    월
  </div>
  <div>
    {{ year }} 년 {{ month }} 월
  </div>
  <DateButtonTable :array="days" />
</template>
