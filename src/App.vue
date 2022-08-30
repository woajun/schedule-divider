<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-plusplus -->
<script setup lang="ts">
interface Shift {
  part: number, // 예를들어, 2교대면 0: 오전, 1: 오후
  number: number, // 한 달동한 근무하는 횟수
  holiday: boolean, // 주말근무 여부
}

interface Person {
  name: string
  shift?: Shift[],
  numDay: number,
  numNight: number,
  numHDay: number,
  numHNight: number,
  day?: number[],
  night?: number[],
  hDay?: number[],
  hNight?: number[],
}

interface Day {
  date: number
  holiday: boolean
  day?: Person[]
  night?: Person[]
}

function shuffle<T>(arr:Array<T>):Array<T> | undefined {
  if (arr.length < 1) return undefined;
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

const makeDays = (length:number, holidays: number[]):Day[] => Array(length)
  .fill(0)
  .map((e, i) => {
    const date = i + 1;
    const holiday = holidays.find((el) => el === date) !== undefined;
    return {
      date,
      holiday,
      day: [],
      night: [],
    };
  });

const { floor } = Math;
const { ceil } = Math;

const makePeople = (
  names: string[],
  lng: number,
  rawHLng: number,
  workerPerShift:number,
  shifts: number,
): Person[] => {
  const num = names.length;
  const hLng = rawHLng;
  const wLng = lng - hLng;

  const calcWork = (aLng:number) => (aLng * workerPerShift * shifts) / num;
  const floorOrCeilAndHarf = (target:number, flag:boolean) => (
    flag ? floor(target / 2) : ceil(target / 2)
  );
  const flag = (i:number) => i % 2 === 0;
  const toPeople = (name:string, i:number): Person => ({
    name,
    numDay: floorOrCeilAndHarf(floor(calcWork(wLng)), flag(i)),
    numNight: floorOrCeilAndHarf(floor(calcWork(wLng)), !flag(i)),
    numHDay: floorOrCeilAndHarf(floor(calcWork(hLng)), flag(i)),
    numHNight: floorOrCeilAndHarf(floor(calcWork(hLng)), !flag(i)),
  });

  const people = names.map(toPeople);

  const calcRest = (aLng:number) => (calcWork(aLng) * num) - (floor(calcWork(aLng)) * num);
  const restW = calcRest(wLng);
  const restH = calcRest(hLng);
  console.log('restW', restW);
  console.log('restH', restH);

  let index = 0;
  Array(restW).fill(0).forEach((e, i) => {
    const flagA = i % 2 === 0;
    if (flagA) {
      people[i].numDay = people[i].numDay + 1;
    } else {
      people[i].numNight = people[i].numNight + 1;
    }
    index = i + 1;
  });

  for (let i = index; i < restH + index; i++) {
    const flagB = i % 2 === 0;
    if (flagB) {
      people[i].numHDay = people[i].numHDay + 1;
    } else {
      people[i].numHNight = people[i].numHNight + 1;
    }
  }

  return people;
};

type Calculator = (
  names: string[],
  length: number,
  holidays: number[],
  workerPerShift: number,
  shifts: number
) => Day[];

const calc: Calculator = (rawNames, length, holidays, workerPerShift, shifts) => {
  const names = shuffle(rawNames);
  if (!names) return;
  const people = makePeople(names, length, holidays.length, workerPerShift, shifts);

  const days = makeDays(length, holidays);

  console.log(people);
  const result: Day[] = [];
  return result;
};

const onClick = () => {
  const people = ['홍길동',
    '유재석',
    '박명수',
    '정준하',
    '노홍철',
    '정형돈',
  ];
  const workerPerShift = 2;
  const shifts = 2;
  calc(people, 31, [6, 7, 13, 14, 20, 21, 27, 28], workerPerShift, shifts);
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
