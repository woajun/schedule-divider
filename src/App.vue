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
  const wLng = lng - hLng;

  const rwNeed = wLng * howMany * shifts / names.length; 
  const rhNeed = hLng * howMany * shifts / names.length; 
  console.log('rwNeed', rwNeed);
  console.log('rhNeed', rhNeed);

  const wNeed = Math.floor(wLng * howMany * shifts / names.length); 
  const hNeed = Math.floor(hLng * howMany * shifts / names.length); 
  console.log('wNeed', wNeed);
  console.log('hNeed', hNeed);

  const sumWNeed = rwNeed * names.length;
  const sumHNeed = rhNeed * names.length;
  console.log('sumWNeed', sumWNeed)
  console.log('sumHNeed', sumHNeed)
  
  const floorWNeed = wNeed * names.length;
  const floorHNeed = hNeed * names.length;
  console.log('floorWNeed', floorWNeed)
  console.log('floorHNeed', floorHNeed)

  const restW = sumWNeed - floorWNeed
  const restH = sumHNeed - floorHNeed
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
