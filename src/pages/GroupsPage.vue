<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Groups List -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6">Grupos Financeiros</div>
              <q-btn color="primary" icon="add" label="Novo Grupo" @click="showCreateDialog = true" />
            </div>
            
            <q-list separator>
              <q-item v-for="group in groups" :key="group.id" clickable @click="selectGroup(group)">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ group.name.charAt(0) }}
                  </q-avatar>
                </q-item-section>
                
                <q-item-section>
                  <q-item-label>{{ group.name }}</q-item-label>
                  <q-item-label caption>{{ group.members.length }} membros</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn flat round icon="more_vert">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item clickable v-close-popup @click="editGroup(group)">
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="openInviteDialog(group)">
                          <q-item-section>Convidar</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="confirmDelete(group)">
                          <q-item-section class="text-negative">Excluir</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Group Details -->
      <div class="col-12 col-md-4">
        <q-card v-if="selectedGroup">
          <q-card-section>
            <div class="text-h6">{{ selectedGroup.name }}</div>
            <div class="text-subtitle2 q-mt-md">Membros</div>
            <q-list>
              <q-item v-for="member in selectedGroup.members" :key="member.id">
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white">
                    {{ member.name.charAt(0) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ member.name }}</q-item-label>
                  <q-item-label caption>{{ member.email }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Create/Edit Group Dialog -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingGroup ? 'Editar Grupo' : 'Novo Grupo' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="groupForm.name" label="Nome do Grupo" autofocus />
          <q-input v-model="groupForm.description" label="Descrição" type="textarea" class="q-mt-md" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="saveGroup" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Invite Member Dialog -->
    <q-dialog v-model="showInviteDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Convidar Membro</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="inviteEmail" label="Email" type="email" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Enviar Convite" color="primary" @click="sendInvite" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const groups = ref([])
const selectedGroup = ref(null)
const showCreateDialog = ref(false)
const showInviteDialog = ref(false)
const editingGroup = ref(null)
const inviteEmail = ref('')

const groupForm = ref({
  name: '',
  description: ''
})

const fetchGroups = async () => {
  try {
    const { data } = await api.get('/groups')
    groups.value = data
  } catch (err) {
    console.error('Error fetching groups:', err.message)
    $q.notify({
      type: 'negative',
      message: `Erro ao carregar grupos: ${err.message}`
    })
  }
}

const selectGroup = (group) => {
  selectedGroup.value = group
}

const editGroup = (group) => {
  editingGroup.value = group
  groupForm.value = { ...group }
  showCreateDialog.value = true
}

const openInviteDialog = (group) => {
  selectedGroup.value = group
  inviteEmail.value = ''
  showInviteDialog.value = true
}

const saveGroup = async () => {
  try {
    if (editingGroup.value) {
      await api.put(`/groups/${editingGroup.value.id}`, groupForm.value)
    } else {
      await api.post('/groups', groupForm.value)
    }
    await fetchGroups()
    showCreateDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Grupo salvo com sucesso!'
    })
  } catch (err) {
    console.error('Error saving group:', err.message)
    $q.notify({
      type: 'negative',
      message: `Erro ao salvar grupo: ${err.message}`
    })
  }
}

const sendInvite = async () => {
  try {
    await api.post(`/groups/${selectedGroup.value.id}/invite`, {
      email: inviteEmail.value
    })
    showInviteDialog.value = false
    $q.notify({
      type: 'positive',
      message: 'Convite enviado com sucesso!'
    })
  } catch (err) {
    console.error('Error sending invite:', err.message)
    $q.notify({
      type: 'negative',
      message: `Erro ao enviar convite: ${err.message}`
    })
  }
}

const confirmDelete = (group) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este grupo?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/groups/${group.id}`)
      await fetchGroups()
      if (selectedGroup.value?.id === group.id) {
        selectedGroup.value = null
      }
      $q.notify({
        type: 'positive',
        message: 'Grupo excluído com sucesso!'
      })
    } catch (err) {
      console.error('Error deleting group:', err.message)
      $q.notify({
        type: 'negative',
        message: `Erro ao excluir grupo: ${err.message}`
      })
    }
  })
}

onMounted(() => {
  fetchGroups()
})
</script>