<script lang="ts" setup>
import {
  computed, reactive, watch, watchEffect,
} from 'vue';
import type { Worker } from '@/interfaces';
import { newID } from '../helper';

const props = defineProps<{
  year: number,
  month: number,
}>();

const range = computed(() => {
  const date = new Date(props.year, props.month, 0);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const mm = m < 10 ? `0${m}` : m;
  const d = date.getDate();
  const dd = d < 10 ? `0${d}` : d;

  return { min: `${y}-${mm}-0${1}`, max: `${y}-${mm}-${dd}` };
});

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

const emitWorker = () => {
  const newWokrers = workers.filter((e) => e.name.length > 0);
  emit('workers', newWokrers);
};

watchEffect(() => {
  emitWorker();
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

const selectDate = (e:Event, arr: number[]) => {
  const el = e.target as HTMLInputElement;
  const date = parseInt(el.value.slice(8), 10);
  if (!arr.includes(date))arr.push(date);
  emitWorker();
};

const empty = (arr: number[]) => {
  while (arr.pop());
  emitWorker();
};

watch([() => props.month, () => props.year], () => {
  workers.forEach((e) => {
    empty(e.avoidDays);
  });
});

</script>
<template>
  <div>
    <div>
      <button @click="addWorker">
        근무자추가
      </button>
      {{ range.min }}
      {{ range.max }}
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th />
            <th>이름</th>
            <th />
            <th>피하고 싶은 날</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(worker, i) in workers" :key="worker.id">
            <th>{{ i + 1 }}.</th>
            <td><input v-model="worker.name" :class="{ invalid: worker.name.length < 1 }" type="text"></td>
            <td>
              <button @click="()=>removeWorker(worker.id)">
                삭제
              </button>
            </td>
            <td><input type="date" :min="range.min" :max="range.max" @change="(e) => selectDate(e, worker.avoidDays)"></td>
            <td>{{ worker.avoidDays }}</td>
            <td>
              <button @click="()=>empty(worker.avoidDays)">
                비우기
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
