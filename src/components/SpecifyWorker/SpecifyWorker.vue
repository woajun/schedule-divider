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
  newID,
} from '../helper';
import { distributeWorking } from './distributeWorking';

const props = defineProps<{
  year: number,
  month: number,
  workdays: Workdays,
  shifts: Shift[],
}>();

const maximum = computed(
  () => {
    if (props.shifts.length < 1) return 0;
    return props.shifts.reduce(
      (c, p) => c + (props.workdays.weekday.length + props.workdays.weekend.length) * p.num,
      0,
    );
  },
);

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
const workers = reactive<SpecifyWorker[]>(
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((name) => ({
    id: newID(),
    name,
    avoidDays: [],
    times: 0,
    weekday: [],
    weekend: [],
  })),
);

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
    times: 0,
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

const total = computed(() => workers.reduce((c, worker) => c += worker.times, 0));

const onClick = () => {
  distributeWorking(workers, props.workdays, props.shifts);
  emitWorker();
};

const up = (w:SpecifyWorker) => {
  if (total.value >= maximum.value) return;
  w.times += 1;
};
const down = (w:SpecifyWorker) => {
  if (w.times < 1) return;
  w.times -= 1;
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
                <button class="btn" @click="()=>up(worker)">
                  ▲
                </button>
                <button class="btn" @click="()=>down(worker)">
                  ▼
                </button>
              </td>
            </template>
            <template v-for="(num, i) in worker.weekend" :key="i">
              <td>
                {{ num }}
              </td>
              <td>
                <button class="btn" @click="()=>up(worker)">
                  ▲
                </button>
                <button class="btn" @click="()=>down(worker)">
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
            <td v-for="s in props.shifts" :key="s.id" colspan="2">
              0 / {{ s.num * props.workdays.weekday.length }}
            </td>
            <td v-for="s in props.shifts" :key="s.id" colspan="2">
              0 / {{ s.num * props.workdays.weekend.length }}
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
