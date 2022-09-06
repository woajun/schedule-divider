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
  calcRest,
  iterate, newID, shuffle, spliteToInt, splitInt,
} from '../helper';
import { randomTimes } from './randomTimes';

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

const distributeWork = (dd:number[], de: number[], p: number, s:Shift[]) => {
  const ddTotal = s.map((e) => e.num * dd.length);
  const deTotal = s.map((e) => e.num * de.length);

  const ddInts = ddTotal.map((e) => splitInt(e, p));
  const deInts = deTotal.map((e) => splitInt(e, p));
  const ints = ddInts.concat(deInts);

  const ddRests = ddTotal.map((e) => calcRest(e, p));
  const deRests = deTotal.map((e) => calcRest(e, p));
  const rests = ddRests.concat(deRests);

  let point = 0;
  const maped = rests.map((r, i) => {
    const t = ints[i];
    iterate(r).forEach((idx) => {
      const index = (idx + point) % p;
      t[index] += 1;
    });
    point = point + r;
    return t;
  });

  console.log(ints);
  console.log(rests);
  console.log('maped', maped);
};

const random = () => {
  const w = workers;
  const d = props.workdays;
  const dd = d.weekday;
  const de = d.weekend;
  const s = props.shifts;

  distributeWork(dd, de, w.length, s);
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
            <th colspan="9" />
            <th colspan="2">
              weekday
            </th>
            <th colspan="2">
              weekend
            </th>
          </tr>
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
            <th>오전근무</th>
            <th>새벽근무</th>
            <th>오전근무</th>
            <th>새벽근무</th>
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
            <td colspan="3">
              {{ total }}/{{ maximum }}
            </td>
            <td>{{ total }}/{{ maximum }}</td>
            <td>{{ total }}/{{ maximum }}</td>
            <td>{{ total }}/{{ maximum }}</td>
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
