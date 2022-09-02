<script lang="ts" setup>import type { Output } from './interfaces';

const props = defineProps<{
  output: Output[][]
}>();

</script>
<template>
  <table>
    <thead>
      <tr>
        <th v-for="e in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="e">
          {{ e }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, i) in props.output" :key="i">
        <template v-for="(day, idx) in week" :key="`${i}-${idx}`">
          <td v-if="day.date === 0" />
          <td v-else>
            <div>
              {{ day.date }}
            </div>
            <template v-if="day.shifts">
              <div v-for="(names, idx2) in day.shifts" :key="idx2">
                <span v-for="name in names" :key="name"> {{ name }} &nbsp;</span>
              </div>
            </template>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
