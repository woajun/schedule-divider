<script setup lang="ts">
interface Person {
  name: string
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

function shuffle<T>(arr:Array<T>):Array<T>|undefined{
  if(arr.length < 1) return undefined;
  let i = arr.length;
  let randomI : number;

  while (i != 0) {
    randomI = Math.floor(Math.random() * i);
    i--;
    
    [arr[i], arr[randomI]] = [arr[randomI], arr[i]];
  }
  return arr;
}


const makeDays = (length:number, holidays: number[]):Day[] => {
  return Array(length)
  .fill(0)
  .map((e,i)=>{
    const date = i + 1
      const holiday = holidays.find((e)=> e===date) !== undefined
      return {
        date,
        holiday,
        day:[],
        night:[],
      }
    })
}

const makePeople = (names: string[], lng: number, hLng: number, howMany:number, shifts: number):Person[] => {
  const num = names.length;
  const wLng = lng - hLng;

  const calcWork = (aLng:number) => aLng * howMany * shifts / num;
  const calcRest = (aLng:number) => (calcWork(aLng) * num) - (Math.floor(calcWork(aLng)) * num);

  const wNeed = Math.floor(calcWork(wLng));
  const hNeed = Math.floor(calcWork(hLng)); 

  const restW = calcRest(wLng);
  const restH = calcRest(hLng);

  const people = names.map((e,i) => {
    const flag = i%2 === 0;
    const numDay = flag?Math.floor(wNeed/2):Math.ceil(wNeed/2);
    const numNight = wNeed - numDay;
    const numHDay = flag?Math.floor(hNeed/2):Math.ceil(hNeed/2);
    const numHNight = hNeed - numHDay;
    return {
      name: e,
      numDay,
      numNight,
      numHDay,
      numHNight,
    }
  })

  let index = 0;
  Array(restW).fill(0).forEach((e,i)=>{
    const flag = i%2 === 0;
    if(flag) {
      people[i].numDay = people[i].numDay + 1
    } else {
      people[i].numNight = people[i].numNight + 1
    }
    index = i+1;
  })

  for (let i = index; i < restH+index; i++) {
    const flag = i%2 === 0;
    if(flag) {
      people[i].numHDay = people[i].numHDay + 1
    } else {
      people[i].numHNight = people[i].numHNight + 1
    }
  }

  return people
};

type Calculator = (names: string[], length: number, holidays: number[]) => Day[]

const calc: Calculator = (rawNames, length, holidays) => {
  const names = shuffle(rawNames);
  if(!names) return;
  const people = makePeople(names, length, holidays.length,2,2);

  const days = makeDays(length,holidays);
  
  const result: Day[] = [];
  return result;
}

const onClick = () => {
  const people = ['홍길동','유재석','박명수','정준하','하하','노홍철']
  calc(people, 31, [6,7,13,14,20,21,27,28])
}

</script>

<template>
    <div>
      <select>
        <option value="2022">2022</option>
      </select>
      <select>
        <option value="9">9</option>
      </select>
      월
    </div>
    <div>
      근무자 수 : 
      <select>
        <option value="6">6</option>
      </select>
    </div>
    <div><button @click="onClick">계산</button></div>
</template>
