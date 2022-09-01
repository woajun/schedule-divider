<!-- eslint-disable no-param-reassign -->
<script lang="ts" setup>
import {
  computed, reactive, ref, watch, watchEffect,
} from 'vue';
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

const emit = defineEmits(['workdays']);

watchEffect(() => {
  const workdays = days.value.reduce((p, c) => {
    if (c.type === 'work') {
      p[0] += 1;
    } else if (c.type === 'holiday') {
      p[1] += 1;
    }
    return p;
  }, [0, 0]);
  emit('workdays', workdays);
});
</script>
<template>
  <div>
    <label>
      <select v-model="year">
        <option v-for="y in opYears" :key="y" :value="y">
          {{ y }}
        </option>
      </select>
      년
    </label>
    <label>
      <select v-model="month">
        <option v-for="m in opMonths" :key="m" :value="m">
          {{ m }}
        </option>
      </select>
      월
    </label>
  </div>
  <DateButtonTable :array="days" />
</template>
