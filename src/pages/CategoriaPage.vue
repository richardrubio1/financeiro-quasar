<template>
    <q-page padding>
        <q-card>
            <q-card-section>
                <q-table flat dense :rows="categorias" :columns="columns" row-key="id">
                    <template v-slot:top>
                        <div class="row items-center justify-between full-width">
                            <div class="text-h6">Categorias Cadastradas</div>
                            <q-btn color="primary" icon="add" label="Cadastrar" @click="abrirFormulario" />
                        </div>
                    </template>

                    <template v-slot:body-cell-actions="props">
                        <q-td align="center">
                            <q-btn flat dense icon="edit" @click="editarCategoria(props.row)" />
                            <q-btn flat dense icon="delete" color="negative" @click="deletarCategoria(props.row.id)" />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>

        <!-- Formulário de Categoria -->
        <q-dialog v-model="formAberto">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{ modoEdicao ? 'Editar Categoria' : 'Nova Categoria' }}</div>
                    <q-input v-model="form.nome" label="Nome da Categoria" dense autofocus
                        :rules="[val => !!val || 'Informe o nome']" class="q-mt-md" />
                    <q-select v-model="form.tipoId" :options="tipos" label="Tipo" option-label="nome" option-value="id"
                        emit-value map-options class="q-mt-md" :rules="[val => !!val || 'Selecione o tipo']" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" @click="cancelarFormulario" />
                    <q-btn flat label="Salvar" color="primary" @click="salvarCategoria" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { Notify, Dialog } from 'quasar'

//const form = ref({ nome: '', tipo_id: null })
const tipos = ref([])
const categorias = ref([])
const formAberto = ref(false)
const modoEdicao = ref(false)

const form = ref({ nome: '', tipoId: null })

const columns = [
    // { name: 'id', label: '#', align: 'left', field: 'id' },
    { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
    {
        name: 'tipo',
        label: 'Tipo',
        align: 'left',
        field: row => {
            //console.log('Linha da tabela:', row)
            return row.tipo?.nome || ''
        }
    },
    { name: 'actions', label: 'Ações', align: 'center', field: 'actions' }
]
async function abrirFormulario() {
    form.value = { nome: '', tipoId: null }        // limpa o formulário
    modoEdicao.value = false         // desativa modo de edição
    formAberto.value = true          // abre o dialog
}
async function cancelarFormulario() {
    form.value = { nome: '', tipoId: null } // limpa o formulário
    formAberto.value = false         // fecha o dialog
    modoEdicao.value = false         // desativa modo de edição
}

async function carregarTipos() {
    const { data } = await api.get('/tipos')
    tipos.value = data
    console.log('tipos recebidos:', tipos.value)
}

async function carregarCategorias() {
    const { data } = await api.get('/categorias?_preload=tipo')
    categorias.value = data
    console.log('categorias recebidas:', categorias.value)
}

async function salvarCategoria() {
    try {

        console.log('Enviando categoria:', form.value)
        await api.post('/categorias', form.value)
        formAberto.value = false // fecha o dialog
        await carregarCategorias()
    } catch (erro) {
        console.error('Erro ao salvar categoria:', erro)
    }

}

async function deletarCategoria(id) {
    Dialog.create({
        title: 'Confirmação',
        message: 'Tem certeza que deseja excluir esta categoria?',
        persistent: true,
        ok: {
            label: 'Sim',
            color: 'negative'
        },
        cancel: {
            label: 'Cancelar',
            flat: true
        }
    }).onOk(async () => {
        try {
            await api.delete(`/categorias/${id}`)

            Notify.create({
                type: 'positive',
                message: 'Categoria excluída com sucesso!',
                position: 'bottom-right',
                timeout: 3000,
            })

            await carregarCategorias()
        } catch (erro) {
            console.error('Erro ao excluir categoria:', erro)

            Notify.create({
                type: 'negative',
                message: 'Erro ao excluir categoria. Ela pode estar vinculada a lançamentos.',
                position: 'bottom-right',
                timeout: 5000,
            })
        }
    })
}

onMounted(() => {
    carregarTipos()
    carregarCategorias()
})
</script>
