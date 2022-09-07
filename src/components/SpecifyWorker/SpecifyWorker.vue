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

const sample: SpecifyWorker[] = ['일일일', '이이이', '삼삼삼', '사사사', '오오오', '육육육']
  .map((name) => ({
    id: newID(),
    name,
    avoidDays: Array<number>(),
    weekday: Array<number>(),
    weekend: Array<number>(),
  }));

const workers = reactive<SpecifyWorker[]>(sample);

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
  el.value = '';
};

const empty = (arr: number[]) => {
  while (arr.pop());
  emitWorker();
};

watch([() => props.workdays.month, () => props.workdays.year], () => {
  workers.forEach((e) => {
    empty(e.avoidDays);
  });
});

const total = computed(() => workers.reduce((t, worker) => {
  const dt = worker.weekday.reduce((r, c) => r += c, 0);
  const et = worker.weekend.reduce((r, c) => r += c, 0);
  t += dt + et;
  return t;
}, 0));

const onClick = () => {
  distributeWorking(workers, props.workdays, props.shifts);
  emitWorker();
};

const workdayTotal = (key: 'weekday' | 'weekend', i:number) => {
  const result = workers.reduce((t, c) => t += c[key][i], 0);
  return Number.isNaN(result) ? 0 : result;
};

const up = (key:'weekday' | 'weekend', i: number, arr: number[]) => {
  if (workdayTotal(key, i) >= props.shifts[i].num * props.workdays[key].length) return;
  arr[i] += 1;
};
const down = (arr:number[], i: number) => {
  if (arr[i] < 1) return;
  arr[i] -= 1;
};

const totals = (w:SpecifyWorker) => {
  const dd = w.weekday.reduce((c, p) => c + p, 0);
  const de = w.weekend.reduce((c, p) => c + p, 0);
  return dd + de;
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
              <button @click="onClick">
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
            <td><input type="date" :min="range.min" :max="range.max" @change="(e) => selectDate(e, worker.avoidDays)"></td>
            <td>{{ worker.avoidDays }}</td>
            <td>
              <button @click="()=>empty(worker.avoidDays)">
                비우기
              </button>
            </td>
            <td>{{ totals(worker) }}</td>
            <template v-for="(num, i) in worker.weekday" :key="i">
              <td>
                {{ num }}
              </td>
              <td>
                <button class="btn" @click="()=>up('weekday', i, worker.weekday)">
                  ▲
                </button>
                <button class="btn" @click="()=>down(worker.weekday, i)">
                  ▼
                </button>
              </td>
            </template>
            <template v-for="(num, i) in worker.weekend" :key="i">
              <td>
                {{ num }}
              </td>
              <td>
                <button class="btn" @click="()=>up('weekend', i, worker.weekend)">
                  ▲
                </button>
                <button class="btn" @click="()=>down(worker.weekend, i)">
                  ▼
                </button>
              </td>
            </template>
          </tr>
          <tr>
            <td colspan="6" />
            <td>
              {{ total }} / {{ maximum }}
            </td>
            <td v-for="(s, i) in props.shifts" :key="s.id" colspan="2">
              {{ workdayTotal('weekday', i) }} / {{ s.num * daylng }}
            </td>
            <td v-for="(s, i) in props.shifts" :key="s.id" colspan="2">
              {{ workdayTotal('weekend', i) }} / {{ s.num * endlng }}
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
</style>
