<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable operator-assignment -->
<script lang="ts" setup>import { ref } from 'vue';
import { iterate, shuffle } from '../helper';

interface Worker {
  id: number,
  name: string,
  avoidDays: number[],
  weekday: number[],
  weekend: number[],
}

interface Shift {
  id: number,
  name: string,
  num: number,
}

interface Workdays {
  weekday: number[],
  holiday: number[],
}

const emit = defineEmits(['distributed']);
const props = defineProps<{
  workers: Worker[],
  shifts: Shift[],
  workdays: Workdays,
}>();

const distribute = (date:number, shifts: number, people: number) => {
  const el = Math.floor(date / people);
  const rest = date % people;
  const splitedDate = iterate(people, el);

  iterate(rest).forEach((i) => {
    splitedDate[i] = splitedDate[i] + 1;
  });

  const arrs = iterate(shifts).map(() => {
    const sliced = splitedDate.slice(rest);
    splitedDate.unshift(...sliced);
    splitedDate.splice(people);
    return splitedDate.map((e) => e);
  });

  return iterate(people).map((i) => arrs.map((e) => e[i]));
};

const mergeWeek = (arrA:number[][], arrB:number[][]) => {
  arrB.reverse();
  return iterate(arrA.length).map((i) => [arrA[i], arrB[i]]);
};

const makeWorkdayArray = (
  people: number,
  wd: number,
  hd: number,
  shifts: number,
  perShift:number,
) : number[][][] => {
  const weekday = distribute(wd * perShift, shifts, people);
  const weekend = distribute(hd * perShift, shifts, people);
  return mergeWeek(weekday, weekend);
};

const result = ref<Worker[]>([]);

const shifts = ref<Shift[]>([]);
const onClick = () => {
  const workers = props.workers.length;
  const weekdays = props.workdays.weekday.length;
  const weekends = props.workdays.holiday.length;
  shifts.value = props.shifts;
  const perShift = props.shifts[0].num;
  const arr = makeWorkdayArray(workers, weekdays, weekends, shifts.value.length, perShift);

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
