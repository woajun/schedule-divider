<script lang="ts" setup>
import { ref } from 'vue';
import { iterate } from './helper';

const now = new Date();
const opYears = iterate(5).map((i) => now.getFullYear() + i);
const opMonths = iterate(12).map((i) => i + 1);

const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 2);

interface Day {
  date: number,
  dayOftheWeek: 'mon' | 'tue' | 'wed' | 'thr' | 'fri' | 'sat' | 'sun',
  holiday: boolean,
}

</script>
<template>
  <div>
    <select v-model="year">
      <option v-for="y in opYears" :key="y" :value="y">
        {{ y }}
      </option>
    </select>
    년
    <select v-model="month">
      <option v-for="m in opMonths" :key="m" :value="m">
        {{ m }}
      </option>
    </select>
    월
  </div>
  <div>
    {{ year }} 년 {{ month }} 월
  </div>
  <div>
    <div>
      <table>
        <tbody>
          <tr>
            <th>평일</th>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>15</td>
            <td>16</td>
            <td>17</td>
            <td>18</td>
            <td>19</td>
            <td>22</td>
            <td>23</td>
            <td>24</td>
            <td>25</td>
            <td>26</td>
            <td>29</td>
            <td>30</td>
            <td>31</td>
          </tr>
          <tr>
            <th>공휴일</th>
            <td>6</td>
            <td>7</td>
            <td>13</td>
            <td>14</td>
            <td>20</td>
            <td>21</td>
            <td>27</td>
            <td>28</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
