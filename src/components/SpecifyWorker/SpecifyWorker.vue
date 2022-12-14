<!-- eslint-disable no-console -->
<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-return-assign -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts" setup>
import {
  computed, reactive, watch, watchEffect,
} from 'vue';
import type { Shift, SpecifyWorker, Workdays } from '@/interfaces';
import {
  dateFormat,
  newID,
} from '../helper';
import { distributeWorking } from './distributeWorking';

const props = defineProps<{
  workdays: Workdays,
  shifts: Shift[],
}>();

const daylng = computed(() => props.workdays.weekday.length);

const endlng = computed(() => props.workdays.weekend.length);

const maximum = computed(
  () => props.shifts.reduce((total, shift) => total + (daylng.value + endlng.value) * shift.num, 0),
);

const range = computed(() => {
  const { year, month } = props.workdays;
  return {
    max: dateFormat(new Date(year, month, 0)),
    min: dateFormat(new Date(year, month - 1, 1)),
  };
});

const emit = defineEmits(['workers']);

const createWorker = (name:string) => ({
  id: newID(),
  name,
  avoidDays: Array<number>(),
  weekday: Array<number>(),
  weekend: Array<number>(),
});

const sample: SpecifyWorker[] = ['일일일', '이이이', '삼삼삼', '사사사', '오오오', '육육육']
  .map(createWorker);

const workers = reactive<SpecifyWorker[]>(sample);

const addWorker = () => {
  workers.push(createWorker(''));
};

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

const selectAvoidDay = (e:Event, arr: number[]) => {
  const el = e.target as HTMLInputElement;
  const selected = parseInt(el.value.slice(8), 10);

  if (!arr.includes(selected)) arr.push(selected);

  emitWorker();
  el.value = '';
};

const emptyAvoidDays = (arr: number[]) => {
  while (arr.pop());
  emitWorker();
};

watch([() => props.workdays.month, () => props.workdays.year], () => {
  workers.forEach((e) => emptyAvoidDays(e.avoidDays));
});

const sumShiftWorkday = (key: 'weekday' | 'weekend', shiftIndex:number) => {
  const result = workers.reduce((t, c) => t += c[key][shiftIndex], 0);
  return Number.isNaN(result) ? 0 : result;
};

const sumWorkerWorkday = (w: SpecifyWorker, key: 'weekday' | 'weekend') => w[key].reduce((c, p) => c + p, 0);

const getWorkerWorkday = (w:SpecifyWorker) => sumWorkerWorkday(w, 'weekday') + sumWorkerWorkday(w, 'weekend');

const workerWorkdayTotal = computed(
  () => workers.reduce((t, w) => t + getWorkerWorkday(w), 0),
);

const btnDistribute = () => {
  distributeWorking(workers, props.workdays, props.shifts);
  emitWorker();
};

const btnUp = (key:'weekday' | 'weekend', i: number, arr: number[]) => {
  if (sumShiftWorkday(key, i) >= props.shifts[i].num * props.workdays[key].length) return;
  arr[i] += 1;
};

const btnDown = (arr:number[], i: number) => {
  if (arr[i] < 1) return;
  arr[i] -= 1;
};

const changeWorkday = (e: Event, key:'weekday' | 'weekend', i: number, arr: number[]) => {
  const el = e.target as HTMLInputElement;
  arr[i] = Number(el.value);
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
            <th colspan="8" />
            <th :colspan="props.shifts.length * 2">
              평일근무
            </th>
            <th :colspan="props.shifts.length * 2">
              주말근무
            </th>
          </tr>
          <tr>
            <th />
            <th>이름</th>
            <th />
            <th>피하고 싶은 날</th>
            <th />
            <th />
            <th>
              근무수
              <button @click="btnDistribute">
                분배
              </button>
            </th>
            <th v-for="s in props.shifts" :key="s.id" colspan="2">
              {{ s.name }}
            </th>
            <th v-for="s in props.shifts" :key="s.id" colspan="2">
              {{ s.name }}
            </th>
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
            <td><input type="date" :min="range.min" :max="range.max" @change="(e) => selectAvoidDay(e, worker.avoidDays)"></td>
            <td>{{ worker.avoidDays }}</td>
            <td>
              <button @click="()=>emptyAvoidDays(worker.avoidDays)">
                비우기
              </button>
            </td>
            <td>{{ getWorkerWorkday(worker) }}</td>
            <template v-for="dayType in (['weekday', 'weekend'] as ['weekday', 'weekend'])" :key="dayType">
              <template v-for="(num, idx) in worker[dayType]" :key="idx">
                <td>
                  <input :value="num" type="number" class="workday" @change="(e) => changeWorkday(e, dayType, idx, worker[dayType])">
                </td>
                <td>
                  <button class="btn" @click="()=>btnUp(dayType, idx, worker[dayType])">
                    ▲
                  </button>
                  <button class="btn" @click="()=>btnDown(worker[dayType], idx)">
                    ▼
                  </button>
                </td>
              </template>
            </template>
          </tr>
          <tr>
            <td colspan="6" />
            <td>
              {{ workerWorkdayTotal }} / {{ maximum }}
            </td>
            <td v-for="(s, i) in props.shifts" :key="s.id" colspan="2">
              {{ sumShiftWorkday('weekday', i) }} / {{ s.num * daylng }}
            </td>
            <td v-for="(s, i) in props.shifts" :key="s.id" colspan="2">
              {{ sumShiftWorkday('weekend', i) }} / {{ s.num * endlng }}
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
.btn {
  width: 20px;
  padding: 1px
}
.workday {
  width: 20px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
-webkit-appearance: none;
margin: 0;
}
</style>
