<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Financial Summary Card -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Patrimônio Líquido</div>
            <div class="text-h4 text-primary q-mt-sm">
              {{ formatCurrency(netWorth) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Monthly Income Card -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Receitas do Mês</div>
            <div class="text-h4 text-positive q-mt-sm">
              {{ formatCurrency(monthlyIncome) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Monthly Expenses Card -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Despesas do Mês</div>
            <div class="text-h4 text-negative q-mt-sm">
              {{ formatCurrency(monthlyExpenses) }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Chart Section -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Evolução Financeira</div>
            <line-chart :chart-data="chartData" :options="chartOptions" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Transactions -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Últimas Transações</div>
            <q-list separator>
              <q-item v-for="transaction in recentTransactions" :key="transaction.id">
                <q-item-section>
                  <q-item-label>{{ transaction.description }}</q-item-label>
                  <q-item-label caption>{{ transaction.date }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :class="transaction.type === 'income' ? 'text-positive' : 'text-negative'">
                    {{ formatCurrency(transaction.amount) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { api } from 'boot/axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const netWorth = ref(0)
const monthlyIncome = ref(0)
const monthlyExpenses = ref(0)
const recentTransactions = ref([])

const chartData = ref({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Patrimônio Líquido',
    data: [0, 0, 0, 0, 0, 0],
    borderColor: '#1976D2',
    tension: 0.1
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const fetchDashboardData = async () => {
  try {
    const { data } = await api.get('/dashboard')
    netWorth.value = data.netWorth
    monthlyIncome.value = data.monthlyIncome
    monthlyExpenses.value = data.monthlyExpenses
    recentTransactions.value = data.recentTransactions
    chartData.value.datasets[0].data = data.netWorthHistory
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>