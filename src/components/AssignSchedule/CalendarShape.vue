<script lang="ts" setup>

const props = defineProps<{
  month: number[][]
}>();

</script>
<template>
  <br />
  <button class="bg-yellow">
    오전근무
  </button>
  <button class="bg-brown">
    오후근무
  </button>
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
            <div class="bg-yellow">
              노홍철, 박명수
            </div>
            <div class="bg-brown">
              유재석, 하하
            </div>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>

.bg-yellow {
  /* background-color: yellow; */
}

.bg-brown {
  /* background-color: brown; */
}

</style>
