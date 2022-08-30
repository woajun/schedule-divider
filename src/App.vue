<script setup lang="ts">import { ref } from 'vue';

interface Person {
  name: string
  schedule: Schedule[]
}

interface Schedule {
  type: 'day' | 'night'
  date: Date
  asign: Person
}

interface Day {
  day: Schedule
  night: Schedule
  holiday: boolean
}

type Calculator = (people: Person[], length: number, holiday: number[]) => Day[]
    
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
    <div><button @click="calc">계산</button></div>
    <div>{{result}}</div>
</template>
