<!-- eslint-disable no-cond-assign -->
<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { iterate } from '../helper';
import DateButton from './DateButton.vue';

interface Day {
  date: number,
  weekday: number,
  type: 'work' | 'holiday' | 'disabled' | string,
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

</script>
<template>
  <table>
    <thead>
      <tr>
        <th />
        <th v-for="e in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="e">
          {{ e }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, i) in weeks" :key="i">
        <th>{{ i + 1 }}</th>
        <template v-for="idx in [0, 1, 2, 3, 4, 5, 6]" :key="`${i}-${idx}`">
          <td v-if="week[idx] === 'empty'" />
          <td v-else-if="week[idx]">
            <DateButton
              v-bind="(week[idx] as Day)"
              @type="(t) => {
                (week[idx] as Day).type = t;
              }"
            />
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>
