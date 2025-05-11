<template>
    <q-page padding>
        <q-card class="q-pa-md" flat bordered>
            <q-card-section>
                <div class="text-h6">Cadastro de Categorias</div>
            </q-card-section>

            <q-separator />

            <q-form @submit.prevent="salvar">
                <div class="q-gutter-md">
                    <q-input v-model="form.nome" label="Nome da Categoria" filled />

                    <q-select v-model="form.tipo_id" :options="tipos" option-label="name" option-value="id" label="Tipo"
                        filled />

                    <q-btn label="Salvar" type="submit" color="primary" />
                </div>
            </q-form>
        </q-card>
        <q-table title="Categorias Cadastradas" :rows="categorias" :columns="columns" row-key="id" flat bordered
            class="q-mt-lg" />
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { axios } from 'axios'   // Importando axios do boot
import type { QTableColumn } from 'quasar'
const form = ref({ nome: '', tipo_id: null })
const tipos = ref([])
const categorias = ref([])

const columns: QTableColumn[] = [
  { name: 'id', label: '#', align: 'left', field: 'id' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'left',
    field: 'tipo_id'
   /* format: (val: any, row: any) => {
  console.log('row recebido:', row)
  return row.tipo && row.tipo.name ? row.tipo.name : ''
}*/
  },
  { name: 'actions', label: 'Ações', align: 'center', field: 'actions' }
]
async function carregarTipos() {
    const { data } = await axios.get('/tipos')
    tipos.value = data
}

async function carregarCategorias() {
    const { data } = await axios.get('/categorias?_preload=tipo')
    categorias.value = data
}

async function salvar() {
    await axios.post('/categorias', form.value)
    form.value = { nome: '', tipo_id: null }
    await carregarCategorias()
}

onMounted(() => {
    carregarTipos()
    carregarCategorias()
})
</script>
