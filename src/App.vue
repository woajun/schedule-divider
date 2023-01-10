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
/**
 * USER FLOW
 * 날짜분배옵션 (마지막 근무 다음 날 첫번째 근무 제외 / 연속 근무 제한 / 한 사람이 하루에 최대 한 번 근무)
 * 근무 총 인원 입력
 * 근무 기간 선택
 * 기간 디테일 선택 (중간에 빼는 날, 주말, 평일)
 * 평일 / 주말 하루 당 근무 수와 근무 인원,
 * --계산--
 */
</script>
<template>
  <BookLayout :page-length="4" :current-page="currentPage">
    <template #page1>
      <SpecifyDate @workdays="setWorkdays" />
      기간을 선택해주세요.
    </template>
    <template #page2>
      <SpecifyShifts @shifts="setShifts" />
      근무수와 근무인원을 입력해주세요.
    </template>
    <template #page3>
      <SpecifyWorker
        :shifts="shifts"
        :workdays="workdays"
        @workers="setWorkers"
      />
      근무자를 입력해주세요.
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
