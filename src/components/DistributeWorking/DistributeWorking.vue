<!-- eslint-disable operator-assignment -->
<script lang="ts" setup>import { ref } from 'vue';
import { iterate, newID, shuffle } from '../helper';

interface Worker {
  id: number,
  name: string,
  avoidDays: number[],
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

interface PartTimeType {
  id: number,
  name: string,
}

interface WorkingDays {
  type: PartTimeType,
  number: number,
}

interface Person {
  id: number
  name: string
  dayWork: WorkingDays[],
  holiWork: WorkingDays[],
}

const props = defineProps<{
  workers: Worker[],
  shifts: Shift[],
  workdays: Workdays,
}>();

const makePartTimeTypes = (shifts: string[]) => shifts.map((name):PartTimeType => ({
  id: newID(),
  name,
}));

// 해야할 날짜가 15일이고, 2교대이며 4명이 나눈다.
// [15,15,15] expect [ [3,4],[4,3],[4,4],[4,4] ]
// 해야할 날짜가 20일이고, 3교대이며 3명이 나눈다.
// [20,20,20] expect [ [6,7,7],[7,6,7],[7,7,6] ]
// 해야할 날짜가 19일이고, 3교대이며 3명이 나눈다.
// [19,19,19] expect [ [7,6,6],[6,7,6],[6,6,7] ]
// 해야할 날짜가 19일이고, 3교대이며 4명이 나눈다.
// [19,19,19] expect [ [4,5,5],[5,4,5],[5,5,4],[5,5,5] ]
// 해야할 날짜가 30일이고, 2교대이며 4명이 나눈다.
// [30,30,30] expect [ [8,7],[8,7],[7,8],[7,8] ]
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

const mergeDayHoli = (arrA:number[][], arrB:number[][]) => {
  arrB.reverse();
  return iterate(arrA.length).map((i) => [arrA[i], arrB[i]]);
};

const makePeople = (
  names: string[],
  dayWorkNum: number,
  holiWrokNum: number,
  partTimeTypes: PartTimeType[],
  perShift:number,
) : Person[] => {
  const dayWorkArr = distribute(dayWorkNum * perShift, partTimeTypes.length, names.length);
  const holiWorkArr = distribute(holiWrokNum * perShift, partTimeTypes.length, names.length);
  const workArray = mergeDayHoli(dayWorkArr, holiWorkArr);
  console.log('workArray', workArray);
  const makeWork = (i:number, type: 'day' | 'holi') => workArray[i][type === 'day' ? 0 : 1]
    .map((num, key) => ({
      type: partTimeTypes[key],
      number: num,
    }));
  return names.map((name, i) => ({
    id: newID(),
    name,
    dayWork: makeWork(i, 'day'),
    holiWork: makeWork(i, 'holi'),
  }));
};

const refPeople = ref<Person[]>([]);

const onClick = () => {
  // console.log('1번', distribute(15, 2, 4));
  // console.log('2번', distribute(20, 3, 3));
  // console.log('3번', distribute(19, 3, 3));
  // console.log('4번', distribute(19, 3, 4));
  // console.log('5번', distribute(30, 2, 4));
  const workdays = props.workdays.weekday;
  const holidays = props.workdays.holiday;
  const shifts = props.shifts.map((e) => e.name);
  const perShift = props.shifts[0].num;
  const partTimeType = makePartTimeTypes(shifts);
  const inputNames = props.workers.map((e) => e.name);
  const names = shuffle(inputNames);
  const people = makePeople(names, workdays.length, holidays.length, partTimeType, perShift);
  console.log('people', people);

  refPeople.value = people;
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
            <th :colspan="props.shifts.length">
              평일
            </th>
            <th :colspan="props.shifts.length">
              공휴일
            </th>
            <th colspan="1">
              평일합
            </th>
            <th colspan="1">
              공휴합
            </th>
            <th colspan="1">
              총합
            </th>
          </tr>
          <tr>
            <th />
            <th>이름</th>
            <template v-for="shift in props.shifts" :key="shift.id">
              <th>{{ shift.name }}</th>
            </template>
            <template v-for="shift in props.shifts" :key="shift.id">
              <th>{{ shift.name }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(person, i) in refPeople" :key="person.id">
            <th>{{ i }}.</th>
            <td>{{ person.name }}</td>
            <template v-for="weekday in person.dayWork" :key="weekday">
              <td>{{ weekday.number }}</td>
            </template>
            <template v-for="weekday in person.holiWork" :key="weekday">
              <td>{{ weekday.number }}</td>
            </template>
            <td>{{ person.dayWork.reduce((p, c)=>p + c.number, 0) }}</td>
            <td>{{ person.holiWork.reduce((p, c)=>p + c.number, 0) }}</td>
            <td>
              {{ person.dayWork.reduce((p, c)=>p + c.number, 0)
                + person.holiWork.reduce((p, c)=>p + c.number, 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
