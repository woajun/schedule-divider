<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable operator-assignment -->
<script lang="ts" setup>
import { ref } from 'vue';
import type { Worker, Shift, Workdays } from '@/interfaces';
import { shuffle } from '../helper';
import { makeWorkdayArray } from './makeWorkdayArray';

const emit = defineEmits(['distributed']);
const props = defineProps<{
  workers: Worker[],
  shifts: Shift[],
  workdays: Workdays,
}>();

const result = ref<Worker[]>([]);

const shifts = ref<Shift[]>([]);

const onClick = () => {
  shifts.value = props.shifts;

  const arr = makeWorkdayArray({
    people: props.workers.length,
    weekdays: props.workdays.weekday.length,
    weekends: props.workdays.weekend.length,
    shifts: props.shifts.length,
    perShift: props.shifts[0].num,
  });

  const shuffled = shuffle(props.workers);

  const people:Worker[] = shuffled.map((e, i) => {
    e.weekday = arr[i][0];
    e.weekend = arr[i][1];
    return e;
  });

  emit('distributed', people);
  result.value = people;
};

</script>
<template>
  <div>
    <div>
      <button type="button" @click="onClick">
        근무일분배
      </button>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th />
            <th />
            <th :colspan="shifts.length">
              평일
            </th>
            <th :colspan="shifts.length">
              공휴일
            </th>
            <th>
              평일합
            </th>
            <th>
              공휴합
            </th>
            <th>
              총합
            </th>
          </tr>
          <tr>
            <th />
            <th>이름</th>
            <template v-for="shift in shifts" :key="shift.id">
              <th>{{ shift.name }}</th>
            </template>
            <template v-for="shift in shifts" :key="shift.id">
              <th>{{ shift.name }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(person, i) in result" :key="person.id">
            <th>{{ i + 1 }}.</th>
            <td>{{ person.name }}</td>
            <template v-for="(shift, idx) in person.weekday" :key="idx">
              <td>{{ shift }}</td>
            </template>
            <template v-for="(shift, idx) in person.weekend" :key="idx">
              <td>{{ shift }}</td>
            </template>
            <td>{{ person.weekday.reduce((p, c)=>p + c, 0) }}</td>
            <td>{{ person.weekend.reduce((p, c)=>p + c, 0) }}</td>
            <td>
              {{ person.weekday.reduce((p, c)=>p + c, 0)
                + person.weekend.reduce((p, c)=>p + c, 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
 table, th, td {
  border: 1px solid
 }

</style>
