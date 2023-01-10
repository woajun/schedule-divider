<script setup lang="ts">
import { ref } from 'vue';

/**
 * TODO
 * 페이지 받기
 * 페이지 앞으로 넘기기
 * 페이지 뒤로 넘기기
 */
const props = defineProps<{
  pageLength: number
  currentPage: number
}>();

function toNumberArray(length: number) {
  const result: number[] = [];
  for (let i = 1; i <= length; i += 1) {
    result.push(i);
  }
  return result;
}
</script>
<template>
  <div v-for="page in toNumberArray(pageLength)" :key="page">
    <div v-show="!!(page === currentPage)">
      <slot :name="`page${page}`" />
    </div>
  </div>
</template>
