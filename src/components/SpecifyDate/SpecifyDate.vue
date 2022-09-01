<!-- eslint-disable no-param-reassign -->
<script lang="ts" setup>
import {
  computed, reactive, ref, watchEffect,
} from 'vue';
import { iterate } from '../helper';
import DateButtonTable from './DateButtonTable.vue';

interface Day {
  date: number,
  weekday: number,
  type: 'work' | 'holiday' | 'disabled' | string,
}

const emit = defineEmits(['workdays']);

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

watchEffect(() => {
  const workdays = days.value.reduce((obj, c) => {
    if (c.type === 'work') {
      obj.weekday.push(c.date);
    } else if (c.type === 'holiday') {
      obj.holiday.push(c.date);
    }
    return obj;
  }, {
    year: year.value,
    month: month.value,
    weekday: Array<number>(),
    holiday: Array<number>(),
  });
  emit('workdays', workdays);
});

const previous = () => {
  if (month.value === 1 && year.value > Math.min(...opYears)) {
    month.value = 12;
    year.value -= 1;
    return;
  }
  if (month.value === 1) {
    return;
  }
  month.value -= 1;
};

const next = () => {
  if (month.value === 12 && year.value < Math.max(...opYears)) {
    month.value = 1;
    year.value += 1;
    return;
  }
  if (month.value === 12) {
    return;
  }
  month.value += 1;
};

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
    <button @click="previous">
      ◀
    </button>
    &nbsp;
    <button @click="next">
      ▶
    </button>
  </div>
  <DateButtonTable :array="days" />
</template>
