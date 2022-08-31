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

const findCutPoint = (array:Day[]) => {
  const set = array
    .reduce((arr, e, i) => {
      if (e.weekday === 0) arr.add(i);
      return arr;
    }, new Set<number>())
    .add(0)
    .add(array.length - 1);
  return Array.from(set).sort((a, b) => a - b);
};

const splited = computed(() => {
  const arr = props.array;
  const cutPoints = findCutPoint(arr);
  console.log('cutPoints', cutPoints);

  return [];
});

// 인덱스를 기준으로 배열을 만든다.
const computedMonth = computed(() => {
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

// 배열을 템플릿에서 돌린다.

</script>
<template>
  <div>
    {{ splited }}
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
        <tr v-for="(week, i) in computedMonth" :key="i">
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
