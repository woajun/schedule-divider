<!-- eslint-disable vue/max-len -->
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
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

const total = computed(
  () => {
    if (shifts.value.length < 1) return 0;
    return shifts.value.length * (workdays.weekday.length + workdays.weekend.length) * shifts.value[0].num;
  },
);

</script>

<template>
  <SpecifyDate @workdays="setWorkdays" />
  <hr>
  <SpecifyShifts @shifts="setShifts" />
  <hr>
  <SpecifyWorker
    :year="workdays.year"
    :month="workdays.month"
    :total="total"
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
