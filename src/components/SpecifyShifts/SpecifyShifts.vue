<script lang="ts" setup>
import { reactive, watchEffect } from 'vue';
import { newID } from '../helper';

interface Shift {
  id: number,
  name: string,
  num: number,
}

const emit = defineEmits(['shifts']);
const shifts = reactive<Shift[]>([
  {
    id: newID(),
    name: '오전근무',
    num: 2,
  },
  {
    id: newID(),
    name: '오후근무',
    num: 2,
  },
]);

const addShift = () => {
  shifts.push({
    id: newID(),
    name: '',
    num: 2,
  });
};

const removeShift = (id: number) => {
  const i = shifts.findIndex((s) => s.id === id);
  shifts.splice(i, 1);
};

watchEffect(() => {
  emit('shifts', shifts);
});
</script>
<template>
  <div>
    <button @click="addShift">
      근무추가
    </button>
    <table>
      <thead>
        <tr>
          <th />
          <th>근무이름</th>
          <th>근무인원</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(shift, i) in shifts" :key="shift.id">
          <th>{{ i }}.</th>
          <td><input v-model="shift.name" :class="{ invalid: shift.name.length < 1 }" type="text"></td>
          <td><input v-model="shift.num" type="number"></td>
          <td>
            <button @click="()=>removeShift(shift.id)">
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
  .invalid {
    background-color: brown;
  }
</style>
