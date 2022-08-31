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
    .add(array.length);
  return Array.from(set).sort((a, b) => a - b);
};

const weeks = computed(() => {
  const arr = props.array;
  const cutPoints = findCutPoint(arr);

  const result = cutPoints.reduce((newArr, curPoint, i, a) => {
    const nextPoint = a[i + 1];
    const sliced = arr.slice(curPoint, nextPoint);
    if (sliced.length > 0)newArr.push(sliced);
    return newArr;
  }, [] as Array<Day | 'empty'>[]);

  const emptyCnt = 7 - result[0].length;
  const empties: Array<'empty'> = iterate(emptyCnt).map(() => 'empty');
  result[0].unshift(...empties);
  return result;
});

// 배열을 템플릿에서 돌린다.

</script>
<template>
  <div>
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
        <tr v-for="(week, i) in weeks" :key="i">
          <th>{{ i + 1 }}</th>
          <td v-if="week[0] === 'empty'" />
          <td v-else-if="week[0]">
            <button>{{ week[0].date }}</button>
          </td>
          <td v-if="week[1] === 'empty'" />
          <td v-else-if="week[1]">
            <button>{{ week[1].date }}</button>
          </td>
          <td v-if="week[2] === 'empty'" />
          <td v-else-if="week[2]">
            <button>{{ week[2].date }}</button>
          </td>
          <td v-if="week[3] === 'empty'" />
          <td v-else-if="week[3]">
            <button>{{ week[3].date }}</button>
          </td>
          <td v-if="week[4] === 'empty'" />
          <td v-else-if="week[4]">
            <button>{{ week[4].date }}</button>
          </td>
          <td v-if="week[5] === 'empty'" />
          <td v-else-if="week[5]">
            <button>{{ week[5].date }}</button>
          </td>
          <td v-if="week[6] === 'empty'" />
          <td v-else-if="week[6]">
            <button>{{ week[6].date }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>
