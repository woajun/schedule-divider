<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { iterate } from './helper';

const now = new Date();
const opYears = iterate(5).map((i) => now.getFullYear() + i);
const opMonths = iterate(12).map((i) => i + 1);

const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 2);

interface Day {
  date: number,
  weekday: string,
  isHoliday: boolean,
  disabled: boolean,
}

const days = computed<Day[]>(() => {
  const lastDay = new Date(year.value, month.value, 0);
  const length = lastDay.getDate();
  const result = iterate(length).map((i) => {
    const aDay = new Date(year.value, month.value - 1, i + 1);
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][aDay.getDay()];
    const isHoliday = !!(aDay.getDay() === 0 || aDay.getDay() === 6);
    return reactive({
      date: aDay.getDate(),
      weekday,
      isHoliday,
      disabled: false,
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
  <div>
    <label>
      평일:
    </label>
    <div v-for="day in days" :key="day.date">
      <div v-if="!day.isHoliday && !day.disabled">
        {{ day.date }} - {{ day.weekday }}
        <button @click="()=> { day.isHoliday = !day.isHoliday }">
          공휴일
        </button>
        <button @click="()=> { day.disabled = true }">
          삭제
        </button>
      </div>
    </div>
    <label>
      공휴일:
    </label>
    <div v-for="day in days" :key="day.date">
      <div v-if="day.isHoliday && !day.disabled">
        {{ day.date }} - {{ day.weekday }}
        <button @click="()=> { day.isHoliday = !day.isHoliday }">
          평일
        </button>
        <button @click="()=> { day.disabled = true }">
          삭제
        </button>
      </div>
    </div>
    <label>
      휴지통:
    </label>
    <div v-for="day in days" :key="day.date">
      <div v-if="day.disabled">
        {{ day.date }} - {{ day.weekday }}
        <button
          @click="()=> {
            day.isHoliday = false;
            day.disabled = false
          }"
        >
          평일
        </button>
        <button
          @click="()=> {
            day.isHoliday = true;
            day.disabled = false
          }"
        >
          공휴일
        </button>
      </div>
    </div>
  </div>
</template>
