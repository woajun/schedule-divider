<script setup lang="ts">
interface Person {
  name: string
  numHDay: number,
  numHNight: number,
  numDay: number,
  numNight: number,
  hDay: number[],
  hNight: number[],
  day: number[],
  night: number[],
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
  const restW = calcRest(wLng);

  const hNeed = Math.floor(calcWork(hLng)); 
  const restH = calcRest(hLng);

  console.log('wNeed', wNeed);
  console.log('hNeed', hNeed);

  console.log('restW', restW)
  console.log('restH', restH)


  

  return result
};

type Calculator = (names: string[], length: number, holidays: number[]) => Day[]

const calc: Calculator = (names, length, holidays) => {
  const shuffleNames = shuffle(names);
  const people = makePeople(names, length, holidays.length,2,2);
  const days = makeDays(length,holidays);
  
  const result: Day[] = [];
  return result;
}

const onClick = () => {
  const people = ['A','B','C','D','E','F']
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
