<script lang="ts" setup>

interface Output {
  date: number,
  shifts: Array<string[]>,
}

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
        <template v-for="(output, idx) in week" :key="`${i}-${idx}`">
          <td v-if="output.date === 0" />
          <td v-else>
            <div>
              {{ output.date }}
            </div>
            <template v-if="output.shifts">
              <div v-for="(apple, idx2) in output.shifts" :key="idx2">
                {{ apple }}
              </div>
            </template>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
