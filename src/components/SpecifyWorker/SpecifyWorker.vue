<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-return-assign -->
<!-- eslint-disable no-param-reassign -->
<script lang="ts" setup>
import {
  computed, reactive, watch, watchEffect,
} from 'vue';
import type { Shift, SpecifyWorker, Workdays } from '@/interfaces';
import { iterate, newID, shuffle } from '../helper';

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
const workers = reactive<SpecifyWorker[]>([
  {
    id: newID(),
    name: '유재석',
    avoidDays: [],
    times: 0,
  },
  {
    id: newID(),
    name: '박명수',
    avoidDays: [],
    times: 0,
  },
  {
    id: newID(),
    name: '정준하',
    avoidDays: [],
    times: 0,
  },
  {
    id: newID(),
    name: '하정우',
    avoidDays: [],
    times: 0,
  },
  {
    id: newID(),
    name: '정형돈',
    avoidDays: [],
    times: 0,
  },
  {
    id: newID(),
    name: '노홍철',
    avoidDays: [],
    times: 0,
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
    times: 0,
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

const random = () => {
  const el = Math.floor(maximum.value / workers.length);
  const rest = maximum.value % workers.length;
  const arr = iterate(workers.length, el);
  iterate(rest).forEach((i) => {
    arr[i] = arr[i] + 1;
  });
  const shuffled = shuffle([...arr]);
  iterate(workers.length).forEach((i) => {
    workers[i].times = shuffled[i];
  });
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
            <th />
            <th>피하고 싶은 날</th>
            <th />
            <th />
            <th colspan="3">
              근무수 <button @click="random">
                분배
              </button>
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
            <td>{{ worker.times }}</td>
            <td>
              <button @click="()=>up(worker)">
                ▲
              </button>
            </td>
            <td>
              <button @click="()=>down(worker)">
                ▼
              </button>
            </td>
          </tr>
          <tr>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
            <td>{{ total }}/{{ maximum }}</td>
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
