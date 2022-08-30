<!-- eslint-disable vue/max-len -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-plusplus -->
<script setup lang="ts">
interface PartTime {
  type: string,
  number: number,
  assing: Person[]
}

interface Date {
  holiday: boolean,
  partTime: PartTime[]
}

interface Person {
  id: number
  name: string
}

type Calendar = Date[];

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

const assignDate = (people: Person[]) => {};

const makePeople = (names: string[], wl: number, hl: number, shifts: string[], perShift:number) => {
  /**
   * 총 공수를 구한다.
   */
  const wholeNumber = (wl + hl) * shifts.length * perShift;
  console.log('wholeNumber', wholeNumber);

  /** 사람 수대로 나눈다. */
  const oneHaveTo = wholeNumber / names.length;
  console.log('oneHaveTo', oneHaveTo);

  /** 주말과 평일을 비율로 나눈다 */
  const weekdayHaveTo = oneHaveTo * (wl / (wl + hl));
  const holidayHaveTo = oneHaveTo * (hl / (wl + hl));
  console.log('weekdayHaveTo', weekdayHaveTo);
  console.log('holidayHaveTo', holidayHaveTo);

  /** 내림하여 한 사람 당 실제 공수를 구한다. */
  const weekdayRealHaveTo = Math.floor(weekdayHaveTo);
  const holidayRealHaveTo = Math.floor(holidayHaveTo);
  console.log('weekdayRealHaveTo', weekdayRealHaveTo);
  console.log('holidayRealHaveTo', holidayRealHaveTo);

  /** 잔업량을 구한다 */
  const restWeekdayHaveTo = (weekdayHaveTo * names.length) - (weekdayRealHaveTo * names.length);
  const restholidayHaveTo = (holidayHaveTo * names.length) - (holidayRealHaveTo * names.length);
  console.log('restWeekdayHaveTo', restWeekdayHaveTo);
  console.log('restholidayHaveTo', restholidayHaveTo);

  /** 사람 객체를 생성한다. */
  /** 사람 객체에 파트타임 객체를 만든다. */
  const people: Person[] = names.map((e) => ({
    name: e,

  }));



  return people;
};

const onClick = () => {
  const inputNames = ['홍길동', '유재석', '박명수', '정준하', '노홍철', '정형돈'];
  const names = shuffle(inputNames);
  const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  const shifts = ['낮', '저녁'];
  const perShift = 2;
  const people = makePeople(names, workdays.length, holidays.length, shifts, perShift);
  console.log('people', people);
  const assigned = assignDate(people);

  // const inputNames = ['홍길동', '유재석', '박명수', '정준하', '노홍철', '정형돈'];
  // const names = shuffle(inputNames);
  // const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  // const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  // const shifts = ['낮', '저녁', '초저녁'];
  // const perShift = 1;
  // const people = makePeople(names, workdays.length, holidays.length, shifts, perShift);
  // const assigned = assignDate(people);
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
