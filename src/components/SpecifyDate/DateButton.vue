<script lang="ts" setup>
import { defineProps } from 'vue';

interface Day {
  date: number | string,
  weekday: number,
  type: 'work' | 'holiday' | 'disabled' | string,
}

const props = defineProps<Day>();
const emit = defineEmits(['type']);

const changeType = () => {
  switch (props.type) {
    case 'work':
      emit('type', 'holiday');
      break;
    case 'holiday':
      emit('type', 'disabled');
      break;
    case 'disabled':
      emit('type', 'work');
      break;
    default:
      emit('type', 'work');
      break;
  }
};

</script>
<template>
  <button
    :class="type"
    @click="changeType"
  >
    {{ props.date }}
  </button>
</template>

<style scoped>
.holiday {
    background-color: crimson;
}
.disabled {
    background-color: black;
}
</style>
