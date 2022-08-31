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

interface HaveTo {
  type: PartTimeType,
  number: number,
}

interface Person {
  id: number
  name: string
  weekdayHaveTo: HaveTo[],
  holidayHaveTo: HaveTo[],
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

const makePeople = (names: string[], workdays: number, partTimeTypes: PartTimeType[], perShift:number) => {
  const numOfPerson = names.length;
  const numOfShift = partTimeTypes.length;

  /** 사람 수대로 나눈다. */
  const oneHaveTo = (workdays * numOfShift * perShift) / numOfPerson;
  console.log('oneHaveTo', oneHaveTo);

  /** 내림하여 한 사람 당 실제 공수를 구한다. */
  const realHaveTo = Math.floor(oneHaveTo);
  console.log('realHaveTo', realHaveTo);

  /** 사람 수대로 나눈 것을 배열로 만든다. */
  const people = names.map((name) => ({
    id: newID(),
    name,
    realHaveTo,
  }));
  console.log(people);

  /** 잔업량을 구한다 */
  const rest = (oneHaveTo * names.length) - (realHaveTo * names.length);
  console.log('rest', rest);

  /** 잔업을 분배한다. */
  Array(rest).fill(1).forEach((e, i) => {
    people[i].realHaveTo = people[i].realHaveTo + e;
  });

  console.log('people', people);

  console.log('distribute', distribute(30, 2, 4));

  // /** 교대근무로 나눈다 */
  // const applePeople = people.map((e, i) => {
  //   const flag = i % 2 === 0;
  //   const apple = e.realHaveTo / numOfShift;
  //   let weekdayHaveTo;
  //   if (apple % 1 === 0) {
  //     weekdayHaveTo = partTimeTypes.map((type) => ({
  //       type,
  //       number: apple,
  //     }));
  //     // TODO
  //     // 7.5 이면 (8, 7) 나누는 로직
  //     // 7.6666 이면 (7, 8, 8)
  //     // 7.3333 이면 (7, 7, 8)
  //   } else {
  //     console.log(apple);
  //   }
  //   return {
  //     id: e.id,
  //     name: e.name,
  //     weekdayHaveTo,
  //   };
  // });
  // console.log('applePeople', applePeople);




  return applePeople;
};

const onClick = () => {
  console.log('1번', distribute(15, 2, 4));
  console.log('2번', distribute(20, 3, 3));
  console.log('3번', distribute(19, 3, 3));
  console.log('4번', distribute(19, 3, 4));
  console.log('5번', distribute(30, 2, 4));
  // const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  // const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  // const shifts = ['낮', '저녁'];
  // const perShift = 2;

  // const partTimeType = makePartTimeTypes(shifts);
  // const calendar = makeCalendar(workdays, holidays, partTimeType, perShift);

  // const inputNames = ['홍길동', '유재석', '박명수', '정준하', '노홍철', '임꺽정'];
  // const names = shuffle(inputNames);
  // const people = makePeople(names, workdays.length, partTimeType, perShift);

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
    근무자 수 :
    <select>
      <option value="6">
        6
      </option>
    </select>
  </div>
  <div>
    한 타임 당 근무자 수 :
    <select>
      <option value="2">
        2
      </option>
    </select>
  </div>
  <div>
    하루의 교대 횟수 :
    <select>
      <option value="2">
        2
      </option>
    </select>
  </div>
  <div>
    <button type="button" @click="onClick">
      계산
    </button>
  </div>
</template>
