<script setup lang="ts">

interface Person {
  name: string
}

interface Day {
  date: number
  holiday: boolean
  day?: Person[]
  night?: Person[]
}




function shuffle(arr:Array<unknown>){
  let i = arr.length;
  let randomI : number;

  while (i != 0) {
    randomI = Math.floor(Math.random() * i);
    i--;
    
    [arr[i], arr[randomI]] = [arr[randomI], arr[i]];
  }
  return arr;
}


type Calculator = (people: Person[], length: number, holiday: number[]) => Day[]

const calc: Calculator = (rawPeople, length, holidays) => {
  console.log('run')
  // const people = shuffle(rawPeople);
  const days: Day[] = Array(length)
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
    console.log(days);

  const result: Day[] = [];
  return result;
}

const onClick = () => {
  const people: Person[] = [
  {name: 'A'},
  {name: 'B'},
  {name: 'C'},
  {name: 'D'},
  {name: 'E'},
  {name: 'F'}
]
  calc(people, 31, [3,4,10,11,17])
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
    <div>{{result}}</div>
</template>
