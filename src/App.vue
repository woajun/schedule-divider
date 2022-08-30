<!-- eslint-disable vue/max-len -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-plusplus -->
<script setup lang="ts">
interface PartTime {
  type: string,
  num: number, // 근무하는 날들
  date?: number[], // 근무하는 날들
  holiday: boolean, // 주말근무 여부
}

interface Person {
  name: string
  schedule?: PartTime[],
}

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
   * 우선 공수를 구한다.
   */
  const wholeNumber = (wl + hl) * shifts.length * perShift;
  console.log('wholeNumber', wholeNumber);

  /** 그리고 사람 수대로 나눈다. */
  const oneHaveTo = wholeNumber / names.length;
  console.log('oneHaveTo', oneHaveTo);

  /** 주말과 평일을 비율로 나눈다 */
  const weekdayHaveTo = oneHaveTo * (wl / (wl + hl));
  const holidayHaveTo = oneHaveTo * (hl / (wl + hl));
  console.log('weekdayHaveTo', weekdayHaveTo);
  console.log('holidayHaveTo', holidayHaveTo);

  /** 내림한다. */
  const weekdayNum = Math.floor(weekdayHaveTo);
  const holidayNum = Math.floor(holidayHaveTo);
  console.log('weekdayNum', weekdayNum);
  console.log('holidayNum', holidayNum);

  /** 잔업량을 구한다 */
  const restWeekdayNum = (weekdayHaveTo * names.length) - (weekdayNum * names.length);
  const restholidayNum = (holidayHaveTo * names.length) - (holidayNum * names.length);
  console.log('restWeekdayNum', restWeekdayNum);
  console.log('restholidayNum', restholidayNum);
};

const onClick = () => {
  const inputNames = ['홍길동', '유재석', '박명수', '정준하', '노홍철', '정형돈'];
  const names = shuffle(inputNames);
  const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  const shifts = ['낮', '저녁'];
  const perShift = 2;
  const people = makePeople(names, workdays.length, holidays.length, shifts, perShift);
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
