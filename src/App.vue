<script setup lang="ts">
import { reactive, ref } from 'vue';
import SpecifyDate from './components/SpecifyDate/SpecifyDate.vue';
import SpecifyShifts from './components/SpecifyShifts/SpecifyShifts.vue';
import SpecifyWorker from './components/SpecifyWorker/SpecifyWorker.vue';
import DistributeWorking from './components/DistributeWorking/DistributeWorking.vue';
import AssignSchedule from './components/AssignSchedule/AssignSchedule.vue';
import type {
  Worker, CalendarIO, Shift, Workdays,
} from './interfaces';

const workdays = reactive<Workdays>({
  year: 0,
  month: 0,
  weekday: [],
  holiday: [],
});
const setWorkdays = (n: Workdays) => {
  workdays.year = n.year;
  workdays.month = n.month;
  workdays.weekday = n.weekday;
  workdays.holiday = n.holiday;
};

const shifts = ref<Shift[]>([]);
const setShifts = (n:Shift[]) => {
  shifts.value = n;
};

const workers = ref<Worker[]>([]);
const setWorkers = (n:Worker[]) => {
  workers.value = n;
};

const calendarIO = reactive<CalendarIO>({
  workers: [],
  workdays: {
    year: 0,
    month: 0,
    weekday: [],
    holiday: [],
  },
});

const setDistributed = (n:Worker[]) => {
  calendarIO.workdays = workdays;
  calendarIO.workers = n;
};
</script>

<template>
  <SpecifyDate @workdays="setWorkdays" />
  <hr>
  {{ workdays }}
  <hr>
  <SpecifyShifts @shifts="setShifts" />
  <hr>
  근무: {{ shifts }}
  <hr>
  <SpecifyWorker @workers="setWorkers" />
  <hr>
  근무자: {{ workers }}
  <hr />
  <DistributeWorking
    :workers="workers"
    :shifts="shifts"
    :workdays="workdays"
    @distributed="setDistributed"
  />
  <hr>
  calendarIO: {{ calendarIO }}
  <hr />
  <AssignSchedule :io="calendarIO" />
</template>
