<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="email" label="Email" type="email" />
        <q-input filled v-model="password" label="Senha" type="password" class="q-mt-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Entrar" color="primary" @click="login" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3334/login', {
      email: email.value,
      password: password.value
    })
    
    // Salva o token localmente
    localStorage.setItem('token', response.data.token)

    // Redireciona para o dashboard ou rota inicial
    router.push('/')
  } catch (error) {
    console.error('Erro ao fazer login:', error)
  }
}
</script>
