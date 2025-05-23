<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <!--<q-card-section class="row items-center q-pa-sm bg-primary text-white">
        <div class="text-h6">Controle de Usuários</div>
        <q-space />
        <q-btn color="white" text-color="primary" label="Cadastrar" icon="add" @click="openForm = true" />
      </q-card-section>-->

      <q-card-section>
        <q-table title="Lista de Usuários" :rows="users" :columns="columns" row-key="id" flat dense>
          <template v-slot:top>
            <div class="row items-center justify-between full-width">
              <div class="text-h6">Lista de Usuários</div>
              <q-btn color="primary" icon="add" label="Cadastrar" @click="openForm = true" />
            </div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn flat dense icon="edit" @click="editUser(props.row)" />
              <q-btn flat dense icon="delete" color="negative" @click="deleteUser(props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="openForm">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">{{ form.id ? 'Editar' : 'Cadastrar Usuário' }}</q-card-section>

        <q-card-section>
          <q-input v-model="form.fullName" label="Nome Completo" dense autofocus />
          <q-input v-model="form.email" label="Email" dense type="email" class="q-mt-sm" :rules= "[validarEmail]"/>
          <q-input v-model="form.password" label="Senha" dense type="password" class="q-mt-sm" :rules= "[validarSenha]" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useValidacoes} from 'src/composables/useValidacoes'

const users = ref([])
const { validarEmail, validarSenha } = useValidacoes()

onMounted(async () => {
  try {
    console.log('Loading users...', users.value)
    const response = await api.get('/users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to load users:', error)
  }
})

const columns = [
  { name: 'fullName', label: 'Nome Completo', field: 'fullName', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]
const openForm = ref(false)
const form = ref({ id: null, fullName: '', email: '', password: '' })

function editUser(user) {
  form.value = { ...user }
  openForm.value = true
}

async function deleteUser(id) {
  try {
    await api.delete(`/users/${id}`)
    users.value = users.value.filter(u => u.id !== id)
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

async function saveUser() {
  try {
    if (form.value.id) {
      const response = await api.put(`/users/${form.value.id}`, form.value)
      const idx = users.value.findIndex(u => u.id === form.value.id)
      if (idx !== -1) users.value[idx] = response.data
    } else {
      const response = await api.post('/users', form.value)
      users.value.push(response.data)
    }
    openForm.value = false
    form.value = { id: null, fullName: '', email: '', password: '' }
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}
</script>
