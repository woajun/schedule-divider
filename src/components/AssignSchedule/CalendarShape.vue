<script lang="ts" setup>

const props = defineProps<{
  month: number[][]
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
      <tr v-for="(week, i) in props.month" :key="i">
        <template v-for="(day, idx) in week" :key="`${i}-${idx}`">
          <td v-if="day === 0" />
          <td v-else>
            <div>
              {{ day }}
            </div>
            <div>
              노홍철
            </div>
            <div>
              박명수
            </div>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
