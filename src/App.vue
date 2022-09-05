<!-- eslint-disable vue/max-len -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import SpecifyDate from './components/SpecifyDate/SpecifyDate.vue';
import SpecifyShifts from './components/SpecifyShifts/SpecifyShifts.vue';
import SpecifyWorker from './components/SpecifyWorker/SpecifyWorker.vue';
import AssignSchedule from './components/AssignSchedule/AssignSchedule.vue';
import type {
  Worker, Shift, Workdays,
} from './interfaces';

const workdays = reactive<Workdays>({
  year: 0,
  month: 0,
  weekday: [],
  weekend: [],
});
const setWorkdays = (n: Workdays) => {
  workdays.year = n.year;
  workdays.month = n.month;
  workdays.weekday = n.weekday;
  workdays.weekend = n.weekend;
};

const shifts = ref<Shift[]>([]);
const setShifts = (n:Shift[]) => {
  shifts.value = n;
};

const workers = ref<Worker[]>([]);
const setWorkers = (n:Worker[]) => {
  workers.value = n;
};

</script>

<template>
  <SpecifyDate @workdays="setWorkdays" />
  <hr>
  <SpecifyShifts @shifts="setShifts" />
  <hr>
  {{ shifts }}
  <hr>
  <SpecifyWorker
    :year="workdays.year"
    :month="workdays.month"
    :shifts="shifts"
    :workdays="workdays"
    @workers="setWorkers"
  />
  <hr>
  {{ workers }}
  <hr>
  <AssignSchedule
    :workers="workers"
    :shifts="shifts"
    :workdays="workdays"
  />
</template>
