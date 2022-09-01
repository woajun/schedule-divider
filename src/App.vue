<!-- eslint-disable @typescript-eslint/no-array-constructor -->
<!-- eslint-disable arrow-body-style -->
<!-- eslint-disable vue/max-len -->
<!-- eslint-disable no-multiple-empty-lines -->
<!-- eslint-disable operator-assignment -->
<!-- eslint-disable no-plusplus -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import SpecifyDate from './components/SpecifyDate/SpecifyDate.vue';
import SpecifyShifts from './components/SpecifyShifts/SpecifyShifts.vue';
import SpecifyWorker from './components/SpecifyWorker/SpecifyWorker.vue';
import DistributeWorking from './components/DistributeWorking/DistributeWorking.vue';
import AssignSchedule from './components/AssignSchedule/AssignSchedule.vue';

interface Assignee {
  assignee?: Person;
}

interface PartTimeType {
  id: number,
  name: string,
}

interface PartTime {
  type: PartTimeType,
  assign: Assignee[]
}

interface Date {
  holiday: boolean,
  partTimes: PartTime[]
}

interface WorkingDays {
  type: PartTimeType,
  number: number,
}

interface Person {
  id: number
  name: string
  dayWork: WorkingDays[],
  holiWork: WorkingDays[],
}

type Calendar = Map<number, Date>;

let idGenerator = 0;
const newID = () => {
  idGenerator = idGenerator + 1;
  return idGenerator;
};

const makePartTimeTypes = (shifts: string[]) => shifts.map((name):PartTimeType => ({
  id: newID(),
  name,
}));


const makeCalendar = (workdays: number[], holidays: number[], partTimeTypes: PartTimeType[], perShift: number): Calendar => {
  const partTimes = ():PartTime[] => partTimeTypes.map((type) => ({
    type,
    assign: Array(perShift).fill({ assignee: undefined }),
  }));
  const calendar: Calendar = new Map();

  workdays.forEach((e) => {
    calendar.set(e, { holiday: false, partTimes: partTimes() });
  });

  holidays.forEach((e) => {
    calendar.set(e, { holiday: true, partTimes: partTimes() });
  });

  return calendar;
};

const onClick = () => {
  const workdays = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31];
  const holidays = [6, 7, 13, 14, 20, 21, 27, 28];
  const shifts = ['낮', '저녁'];
  const perShift = 2;

  const partTimeType = makePartTimeTypes(shifts);
  const calendar = makeCalendar(workdays, holidays, partTimeType, perShift);

  console.log(calendar);
};

interface Workdays {
  weekday: number[],
  holiday: number[],
}

const workdays = reactive<Workdays>({
  weekday: [],
  holiday: [],
});
const setWorkdays = (n: Workdays) => {
  workdays.weekday = n.weekday;
  workdays.holiday = n.holiday;
};

interface Shift {
  id: number,
  name: string,
  num: number,
}

const shifts = ref<Shift[]>([]);
const setShifts = (n:Shift[]) => {
  shifts.value = n;
};

interface Worker {
  id: number,
  name: string,
  avoidDays: number[],
}

const workers = ref<Worker[]>([]);
const setWorkers = (n:Worker[]) => {
  workers.value = n;
};
</script>

<template>
  <SpecifyDate @workdays="setWorkdays" />
  <hr>
  평일 : {{ workdays.weekday }}
  공휴일 : {{ workdays.holiday }}
  <hr>
  <SpecifyShifts @shifts="setShifts" />
  <hr>
  근무: {{ shifts }}
  <hr>
  <SpecifyWorker @workers="setWorkers" />
  <hr>
  근무자: {{ workers }}
  <hr />
  <button @click="onClick">
    test
  </button>
  <hr />
  <DistributeWorking :workers="workers" :shifts="shifts" :workdays="workdays" />
  <hr />
  <AssignSchedule />
</template>
