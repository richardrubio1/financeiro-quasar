<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="login-card q-pa-lg" style="width: 400px">
      <q-card-section class="text-center">
        <h4 class="text-h5 q-mt-none q-mb-md">Sistema Financeiro</h4>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Registro" />
        </q-tabs>
      </q-card-section>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <q-form @submit="handleLogin" class="q-gutter-md">
            <q-input
              filled
              v-model="loginForm.email"
              label="Email"
              type="email"
              :rules="[val => !!val || 'Email é obrigatório', emailRule]"
            />
            <q-input
              filled
              v-model="loginForm.password"
              label="Senha"
              :type="isPwd ? 'password' : 'text'"
              :rules="[val => !!val || 'Senha é obrigatória']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div>
              <q-btn label="Entrar" type="submit" color="primary" class="full-width" />
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="register">
          <q-form @submit="handleRegister" class="q-gutter-md">
            <q-input
              filled
              v-model="registerForm.name"
              label="Nome completo"
              :rules="[val => !!val || 'Nome é obrigatório']"
            />
            <q-input
              filled
              v-model="registerForm.email"
              label="Email"
              type="email"
              :rules="[val => !!val || 'Email é obrigatório', emailRule]"
            />
            <q-input
              filled
              v-model="registerForm.password"
              label="Senha"
              :type="isPwd ? 'password' : 'text'"
              :rules="[val => !!val || 'Senha é obrigatória', passwordRule]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div>
              <q-btn label="Registrar" type="submit" color="primary" class="full-width" />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from 'src/composables/useAuth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { login, register } = useAuth()

const tab = ref('login')
const isPwd = ref(true)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: ''
})

const emailRule = val => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[^\s@]{2,}$/
  return emailPattern.test(val) || 'Email inválido'
}

const passwordRule = val => {
  return val.length >= 8 || 'A senha deve ter no mínimo 8 caracteres'
}

const handleLogin = async () => {
  try {
    await login(loginForm.value)
    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!'
    })
  } catch (err) {
    console.error('Login error:', err.message)
    $q.notify({
      type: 'negative',
      message: `Erro ao fazer login: ${err.message}`
    })
  }
}

const handleRegister = async () => {
  try {
    await register(registerForm.value)
    $q.notify({
      type: 'positive',
      message: 'Registro realizado com sucesso!'
    })
  } catch (err) {
    console.error('Registration error:', err.message)
    $q.notify({
      type: 'negative',
      message: `Erro ao registrar: ${err.message}`
    })
  }
}
</script>

<style lang="scss" scoped>
.login-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>