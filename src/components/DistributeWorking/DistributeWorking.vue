<!-- eslint-disable operator-assignment -->
<script lang="ts" setup>import { iterate, newID, shuffle } from '../helper';

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

const onClick = () => {
  // console.log('1번', distribute(15, 2, 4));
  // console.log('2번', distribute(20, 3, 3));
  // console.log('3번', distribute(19, 3, 3));
  // console.log('4번', distribute(19, 3, 4));
  // console.log('5번', distribute(30, 2, 4));
  const workdays = props.workdays.weekday;
  const holidays = props.workdays.weekday;
  const shifts = props.shifts.map((e) => e.name);
  const perShift = props.shifts[0].num;
  const partTimeType = makePartTimeTypes(shifts);
  const inputNames = props.workers.map((e) => e.name);
  const names = shuffle(inputNames);
  const people = makePeople(names, workdays.length, holidays.length, partTimeType, perShift);
  console.log('people', people);

  // console.log(calendar);
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
            <th colspan="2">
              평일
            </th>
            <th colspan="2">
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
            <th>오전근무</th>
            <th>오후근무</th>
            <th>오전근무</th>
            <th>오후근무</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1.</th>
            <td>홍길동</td>
            <td>7</td>
            <td>8</td>
            <td>3</td>
            <td>3</td>
            <td>15</td>
            <td>6</td>
            <td>21</td>
          </tr>
          <tr>
            <th>2.</th>
            <td>유재석</td>
            <td>7</td>
            <td>8</td>
            <td>3</td>
            <td>3</td>
            <td>15</td>
            <td>6</td>
            <td>21</td>
          </tr>
          <tr>
            <th>3.</th>
            <td>박명수</td>
            <td>8</td>
            <td>7</td>
            <td>3</td>
            <td>2</td>
            <td>15</td>
            <td>5</td>
            <td>20</td>
          </tr>
          <tr>
            <th>4.</th>
            <td>정준하</td>
            <td>8</td>
            <td>7</td>
            <td>3</td>
            <td>2</td>
            <td>15</td>
            <td>5</td>
            <td>20</td>
          </tr>
          <tr>
            <th>5.</th>
            <td>노홍철</td>
            <td>8</td>
            <td>8</td>
            <td>2</td>
            <td>3</td>
            <td>16</td>
            <td>5</td>
            <td>21</td>
          </tr>
          <tr>
            <th>6.</th>
            <td>임꺽정</td>
            <td>8</td>
            <td>8</td>
            <td>2</td>
            <td>3</td>
            <td>16</td>
            <td>5</td>
            <td>21</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
