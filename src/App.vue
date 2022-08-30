<!-- eslint-disable vue/max-len -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-plusplus -->
<script setup lang="ts">
interface PartTimeType {
  id: number,
  name: string,
}

interface PartTime {
  type: PartTimeType,
  number: number,
  assign?: Person[]
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
    number: perShift,
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

const makePeople = (names: string[], wl: number, partTimeTypes: PartTimeType[], perShift:number) => {
  const numOfPerson = names.length;
  /**
   * 총 공수를 구한다.
   */
  const wholeNumber = wl * partTimeTypes.length * perShift;
  console.log('wholeNumber', wholeNumber);

  /** 사람 수대로 나눈다. */
  const oneHaveTo = wholeNumber / numOfPerson;
  console.log('oneHaveTo', oneHaveTo);

  /** 내림하여 한 사람 당 실제 공수를 구한다. */
  const weekdayRealHaveTo = Math.floor(oneHaveTo);
  console.log('weekdayRealHaveTo', weekdayRealHaveTo);

  /** 교대근무를 나눈다. */
  const weekdayShifts = partTimeTypes.map(() => weekdayRealHaveTo / partTimeTypes.length);
  console.log('weekdayShifts', weekdayShifts);

  /** 잔업량을 구한다 */
  const restWeekdayHaveTo = (oneHaveTo * names.length) - (weekdayRealHaveTo * names.length);
  console.log('restWeekdayHaveTo', restWeekdayHaveTo);


  /** 사람 객체를 생성한다. */
  /** 사람 객체에 파트타임 객체를 만든다. */
  const people: Person[] = names.map((e) => ({
    name: e,

  }));



  return people;
};

const onClick = () => {
  const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  const shifts = ['낮', '저녁'];
  const perShift = 2;

  const partTimeType = makePartTimeTypes(shifts);
  const calendar = makeCalendar(workdays, holidays, partTimeType, perShift);

  const inputNames = ['홍길동', '유재석', '박명수', '정준하', '노홍철', '정형돈'];
  const names = shuffle(inputNames);
  const people = makePeople(names, workdays.length, partTimeType, perShift);

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
