<!-- eslint-disable no-cond-assign -->
<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { iterate } from '../helper';

interface Day {
  date: number,
  weekday: number,
  isHoliday: boolean,
  disabled: boolean,
}

const props = defineProps<{ array: Day[] }>();

// 모든 일요일 인덱스를 찾는다.
const everySundayIndexes = computed(() => props.array.reduce((arr, e, i) => {
  if (e.weekday === 0) arr.push(i);
  return arr;
}, [] as number[]));

console.log('everySundayIndexes', everySundayIndexes.value);

// 인덱스를 기준으로 배열을 만든다.
// 배열을 템플릿에서 돌린다.

const month = computed(() => {
  const months = iterate(6).map((i) => ({
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
  }));
  console.log('months', months);

  return months;
});

</script>
<template>
  <div>
    {{ everySundayIndexes }}
    <table>
      <thead>
        <tr>
          <th />
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, i) in month" :key="i">
          <th>{{ i + 1 }}</th>
          <td v-if="week[0]">
            <button>aaa</button>
          </td>
          <td v-if="week[1]">
            <button>aaa</button>
          </td>
          <td v-if="week[2]">
            <button>aaa</button>
          </td>
          <td v-if="week[3]">
            <button>aaa</button>
          </td>
          <td v-if="week[4]">
            <button>aaa</button>
          </td>
          <td v-if="week[5]">
            <button>aaa</button>
          </td>
          <td v-if="week[6]">
            <button>aaa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>
