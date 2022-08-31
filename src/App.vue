<!-- eslint-disable @typescript-eslint/no-array-constructor -->
<!-- eslint-disable arrow-body-style -->
<!-- eslint-disable vue/max-len -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-plusplus -->
<script setup lang="ts">
interface Assignee {
  assignee?: Person;
}

interface PartTimeType {
  id: number,
  name: string,
}

interface PartTime {
  type: PartTimeType,
  assign: Assignee[]
}

interface Date {
  holiday: boolean,
  partTimes: PartTime[]
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

type Calendar = Map<number, Date>;

let idGenerator = 0;
const newID = () => {
  idGenerator = idGenerator + 1;
  return idGenerator;
};


function shuffle<T>(rawArr:Array<T>):Array<T> {
  const arr = JSON.parse(JSON.stringify(rawArr));
  let i = arr.length;
  let randomI : number;

  while (i !== 0) {
    randomI = Math.floor(Math.random() * i);
    i--;

    // eslint-disable-next-line no-param-reassign
    [arr[i], arr[randomI]] = [arr[randomI], arr[i]];
  }
  return arr;
}

const makePartTimeTypes = (shifts: string[]) => shifts.map((name):PartTimeType => ({
  id: newID(),
  name,
}));


const makeCalendar = (workdays: number[], holidays: number[], partTimeTypes: PartTimeType[], perShift: number): Calendar => {
  const partTimes = ():PartTime[] => partTimeTypes.map((type) => ({
    type,
    assign: Array(perShift).fill({ assignee: undefined }),
  }));
  const calendar: Calendar = new Map();

  workdays.forEach((e) => {
    calendar.set(e, { holiday: false, partTimes: partTimes() });
  });

  holidays.forEach((e) => {
    calendar.set(e, { holiday: true, partTimes: partTimes() });
  });

  return calendar;
};

const iterate = (num: number, el?:unknown) => {
  if (el !== undefined) {
    return Array(num).fill(el);
  }
  return Array(num).fill(0).map((e, i) => i);
};

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

const makePeople = (names: string[], dayWorkNum: number, holiWrokNum: number, partTimeTypes: PartTimeType[], perShift:number) : Person[] => {
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

  const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  const shifts = ['낮', '저녁'];
  const perShift = 2;

  const partTimeType = makePartTimeTypes(shifts);
  const calendar = makeCalendar(workdays, holidays, partTimeType, perShift);

  const inputNames = ['홍길동', '유재석', '박명수', '정준하', '노홍철', '임꺽정'];
  const names = shuffle(inputNames);
  const people = makePeople(names, workdays.length, holidays.length, partTimeType, perShift);
  console.log('people', people);

  // console.log(calendar);
};

</script>

<template>
  <div>
    <select>
      <option value="2022">
        2022
      </option>
    </select>
    <select>
      <option value="9">
        9
      </option>
    </select>
    월
  </div>
  <div>
    <div>
      <button>
        근무추가
      </button>
    </div>
    <div>
      <table>
        <tbody>
          <tr>
            <th>평일</th>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>15</td>
            <td>16</td>
            <td>17</td>
            <td>18</td>
            <td>19</td>
            <td>22</td>
            <td>23</td>
            <td>24</td>
            <td>25</td>
            <td>26</td>
            <td>29</td>
            <td>30</td>
            <td>31</td>
          </tr>
          <tr>
            <th>공휴일</th>
            <td>6</td>
            <td>7</td>
            <td>13</td>
            <td>14</td>
            <td>20</td>
            <td>21</td>
            <td>27</td>
            <td>28</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <hr>
  <div>
    <div>
      <button>
        근무추가
      </button>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th />
            <th>교대</th>
            <th>근무인원</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1.</th>
            <td>오전근무</td>
            <td>2</td>
          </tr>
          <tr>
            <th>2.</th>
            <td>오후근무</td>
            <td>2</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <hr>
  <div>
    <div>
      <button>
        근무자추가
      </button>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th />
            <th>이름</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1.</th>
            <td>홍길동</td>
          </tr>
          <tr>
            <th>2.</th>
            <td>유재석</td>
          </tr>
          <tr>
            <th>3.</th>
            <td>박명수</td>
          </tr>
          <tr>
            <th>4.</th>
            <td>정준하</td>
          </tr>
          <tr>
            <th>5.</th>
            <td>노홍철</td>
          </tr>
          <tr>
            <th>6.</th>
            <td>임꺽정</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <hr />
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
  <hr />
  <div>
    <button>날짜 분배</button>
    오후 근무시 다음날 오전은 가능한 피하기.
  </div>
  <div />
</template>
