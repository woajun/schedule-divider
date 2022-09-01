<script lang="ts" setup>
import { reactive, watchEffect } from 'vue';
import type { Worker } from '@/interfaces';
import { newID } from '../helper';

const emit = defineEmits(['workers']);
const workers = reactive<Worker[]>([
  {
    id: newID(),
    name: '유재석',
    avoidDays: [],
    weekday: [],
    weekend: [],
  },
  {
    id: newID(),
    name: '박명수',
    avoidDays: [],
    weekday: [],
    weekend: [],
  },
  {
    id: newID(),
    name: '정준하',
    avoidDays: [],
    weekday: [],
    weekend: [],
  },
  {
    id: newID(),
    name: '하하',
    avoidDays: [],
    weekday: [],
    weekend: [],
  },
  {
    id: newID(),
    name: '정형돈',
    avoidDays: [],
    weekday: [],
    weekend: [],
  },
  {
    id: newID(),
    name: '노홍철',
    avoidDays: [],
    weekday: [],
    weekend: [],
  },
]);

const removeWorker = (id: number) => {
  const i = workers.findIndex((w) => w.id === id);
  workers.splice(i, 1);
};

watchEffect(() => {
  const newWokrers = workers.filter((e) => e.name.length > 0);
  emit('workers', newWokrers);
});

const addWorker = () => {
  workers.push({
    id: newID(),
    name: '',
    avoidDays: [],
    weekday: [],
    weekend: [],
  });
};
</script>
<template>
  <div>
    <div>
      <button @click="addWorker">
        근무자추가
      </button>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th />
            <th>이름</th>
            <th>피하고 싶은 날</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(worekr, i) in workers" :key="worekr.id">
            <th>{{ i + 1 }}.</th>
            <td><input v-model="worekr.name" :class="{ invalid: worekr.name.length < 1 }" type="text"></td>
            <td><input v-model="worekr.avoidDays" type="text"></td>
            <td>
              <button @click="()=>removeWorker(worekr.id)">
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
  .invalid {
    background-color: brown;
  }
</style>
