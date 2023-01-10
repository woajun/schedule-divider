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
import BookLayout from './components/BookLayout.vue';

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

const currentPage = ref(1);
</script>

<template>
  <BookLayout :page-length="4" :current-page="currentPage">
    <template #page1>
      <SpecifyDate @workdays="setWorkdays" />
    </template>
    <template #page2>
      <SpecifyShifts @shifts="setShifts" />
    </template>
    <template #page3>
      <SpecifyWorker
        :shifts="shifts"
        :workdays="workdays"
        @workers="setWorkers"
      />
    </template>
    <template #page4>
      <AssignSchedule
        :workers="workers"
        :shifts="shifts"
        :workdays="workdays"
      />
    </template>
  </BookLayout>
  현재페이지 : {{ currentPage }}
  <button class="rounded-full" @click="currentPage--">
    이전
  </button>
  <button @click="currentPage++">
    다음
  </button>
</template>
