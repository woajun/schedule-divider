<script lang="ts" setup>
import { defineProps } from 'vue';

interface Day {
  date: number,
  weekday: number,
  isHoliday: boolean,
  disabled: boolean,
}

const props = defineProps<Day>();

</script>
<template>
  <button>
    {{ props.date }}
  </button>
</template>

<style scoped>
.red {
    background-color: red;
}
</style>
