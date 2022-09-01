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
  weekday: number[],
  weekend: number[],
}

const workers = ref<Worker[]>([]);
const setWorkers = (n:Worker[]) => {
  workers.value = n;
};

const distributed = ref<Worker[]>([]);
const setDistributed = (n:Worker[]) => {
  distributed.value = n;
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
  <DistributeWorking
    :workers="workers"
    :shifts="shifts"
    :workdays="workdays"
    @distributed="setDistributed"
  />
  <hr>
  distributed: {{ distributed }}
  <hr>
  AssignSchedule 재료:
  1. 평일, 공휴일
  2. distributed + 피하고 싶은 날
  <hr />
  <AssignSchedule />
</template>
