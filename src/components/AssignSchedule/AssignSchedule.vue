<!-- eslint-disable no-alert -->
<!-- eslint-disable no-nested-ternary -->
<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable vue/max-len -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import type {
  Shift, Workdays, Worker,
} from '@/interfaces';
import { deepcopy, iterate } from '../helper';
import CalendarShape from './CalendarShape.vue';
import type { Output } from './interfaces';
import { assignIterate } from './randomAssign';

interface Work {
  type: string,
  shifts: Array<number[]>,
}

type DateMap = Map<number, Work>;

const props = defineProps<{
  workers: Worker[]
  shifts: Shift[]
  workdays: Workdays
}>();

const getMargin = (y:number, m:number) => new Date(y, m - 1, 1).getDay();

const convertIdToWorker = (schedule: DateMap, workers:Worker[]) : Output[] => {
  const findID = (id:number): Worker => {
    const found = workers.find((e) => e.id === id);
    if (!found) throw new Error('error');
    return found;
  };
  const idsToWorker = (ids: number[]) => ids.map((id) => findID(id));
  const shiftsToWorkers = (shifts: number[][]) => shifts.map((ids) => idsToWorker(ids));
  const result = Array<Output>();
  schedule.forEach((e, k) => {
    result.push({
      date: k,
      type: e.type,
      shifts: shiftsToWorkers(e.shifts),
    });
  });
  return result;
};

const makeOutput = (schedule: Output[], { year, month }: Workdays) => {
  const merged = iterate<Output>(getMargin(year, month), { date: 0, type: '', shifts: [] }).concat(schedule);
  const count = Math.ceil(merged.length / 7);
  return iterate(count).map((i) => merged.slice((i) * 7, (i + 1) * 7));
};

const y = ref<number>(0);
const m = ref<number>(0);
const output = ref<Output[][]>([]);

const flags = reactive({
  lastWorkerBanFirstWork: true,
  banContinuousWork: true,
  workOnceADayFlag: true,
});

const doDivision = () => {
  const d = props.workdays;
  const s = props.shifts;
  const w = deepcopy(props.workers);

  const assigned = assignIterate(w, d, s, flags);
  const schedule = convertIdToWorker(assigned, w);
  console.log(schedule);
  schedule.sort((a, b) => a.date - b.date);
  output.value = makeOutput(schedule, d);

  y.value = d.year;
  m.value = d.month;
};

</script>
<template>
  <div>
    ??????????????????
    <br />
    <label>
      <input v-model="flags.lastWorkerBanFirstWork" type="checkbox" />
      ?????? ?????? ??? ????????? ?????????
    </label>
    <br />
    <label>
      <input v-model="flags.banContinuousWork" type="checkbox" />
      ?????? ????????? ?????????
    </label>
    <br />
    <label>
      <input v-model="flags.workOnceADayFlag" type="checkbox" />
      ????????? ?????? ??? ??? ?????????.
    </label>
    <br />
    <br />
    <button @click="doDivision">
      ?????? ??????
    </button>
    <br>
    <h2>{{ y }} ??? {{ m }} ??? ?????????</h2>
    <CalendarShape :output="output" />
  </div>
</template>
