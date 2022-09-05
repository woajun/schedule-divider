<script lang="ts" setup>
import {
  reactive, ref, watch, watchEffect,
} from 'vue';
import type { Shift } from '@/interfaces';
import { newID } from '../helper';

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

const perShift = ref(2);

watchEffect(() => {
  emit('shifts', shifts.map((e) => {
    e.num = perShift.value;
    return e;
  }));
});

const individual = ref(false);

watch(individual, (v) => {
  if (!v) {
    shifts.map((e) => {
      e.num = perShift.value;
      return e;
    });
  }
});

</script>
<template>
  <div>
    <button @click="addShift">
      근무추가
    </button>
  </div>
  <div>
    <label>
      근무당 인원
      <input v-model="perShift" type="number" :disabled="individual">
    </label>
    <label>
      <input v-model="individual" type="checkbox" />
      개별
    </label>
  </div>
  <table>
    <thead>
      <tr>
        <th />
        <th>근무이름</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(shift, i) in shifts" :key="shift.id">
        <th>{{ i + 1 }}.</th>
        <td><input v-model="shift.name" :class="{ invalid: shift.name.length < 1 }" type="text"></td>
        <td>
          <button @click="()=>removeShift(shift.id)">
            삭제
          </button>
        </td>
        <td v-show="individual">
          <input v-model="shift.num" type="number">
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
  .invalid {
    background-color: brown;
  }
</style>
