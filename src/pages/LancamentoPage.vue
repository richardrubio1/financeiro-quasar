<template>
    <q-page padding>
        <q-card>
            <q-card-section>
                <q-table flat dense :rows="lancamentos" :columns="columns" row-key="id">
                    <template v-slot:top>
                        <div class="row items-center justify-between full-width">
                            <div class="text-h6">Lançamentos</div>
                            <q-btn color="primary" icon="add" label="Novo Lançamento" @click="abrirFormulario" />
                        </div>
                    </template>

                    <template v-slot:body-cell-actions="props">
                        <q-td align="center">
                            <q-btn flat dense icon="edit" @click="editarLancamento(props.row)" />
                            <q-btn flat dense icon="delete" color="negative" @click="deletarLancamento(props.row.id)" />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>

        <!-- Formulário de Lançamento -->
        <q-dialog v-model="formAberto" persistent>
            <q-card style="min-width: 600px; max-width: 90vw;">
                <q-card-section>
                    <div class="text-h6">{{ modoEdicao ? 'Editar Lançamento' : 'Novo Lançamento' }}</div>
                    <q-input v-model="form.descricao" label="Descrição" dense class="q-mt-md" />
                    <q-input v-model.number="form.valor" label="Valor Total" type="number" dense class="q-mt-md" />
                    <q-select v-model="form.natureza" :options="['À Vista', 'Cartão']" label="Natureza" dense
                        class="q-mt-md" />
                    <q-select v-model="form.categoria_id" :options="categorias" label="Categoria" option-value="id"
                        option-label="nome" dense class="q-mt-md" />
                    <q-select v-model="form.cartao_id" :options="cartoes" label="Cartão" option-value="id"
                        option-label="nome" dense class="q-mt-md" />
                    <q-select v-model="form.recorrencia_id" :options="recorrencias" label="Recorrência"
                        option-value="id" option-label="frequencia" dense class="q-mt-md" />
                    <q-separator class="q-my-md" />

                    <div class="row items-center justify-between q-mb-sm">
                        <div class="text-subtitle2">Itens Lançados</div>
                        <q-btn flat dense icon="add" label="Adicionar Item" @click="adicionarItem" />
                    </div>

                    <q-table dense flat hide-bottom :rows="form.itens" :columns="columnsItens" row-key="uid">
                        <template v-slot:body-cell="props">
                            <q-td :props="props">
                                <template v-if="props.col.name === 'actions'">
                                    <q-btn flat dense icon="delete" color="negative"
                                        @click="removerItem(props.row.uid)" />
                                </template>
                                <template v-else>
                                    <q-input v-model="props.row[props.col.name]"
                                        :type="['quantidade', 'preco_unitario', 'preco_total'].includes(props.col.name) ? 'number' : 'text'"
                                        dense borderless class="q-pa-none" @blur="recalcularTotais" />

                                </template>
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" @click="cancelarFormulario" />
                    <q-btn flat label="Salvar" color="primary" @click="salvarLancamento" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { Dialog, Notify, uid } from 'quasar'

const lancamentos = ref([])
const categorias = ref([])
const cartoes = ref([])
const recorrencias = ref([])

const formAberto = ref(false)
const modoEdicao = ref(false)

const form = ref({
    descricao: '',
    valor: 0,
    natureza: '',
    categoria_id: null,
    cartao_id: null,
    recorrencia_id: null,
    itens: []
})

const columns = [
    { name: 'descricao', label: 'Descrição', field: 'descricao' },
    { name: 'valor', label: 'Valor', field: 'valor' },
    { name: 'natureza', label: 'Natureza', field: 'natureza' },
    { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

const columnsItens = [
    { name: 'nome', label: 'Item', align: 'left' },
    { name: 'quantidade', label: 'Qtd', align: 'center' },
    { name: 'unidade', label: 'Unidade', align: 'center' },
    { name: 'preco_unitario', label: 'Preço Unit.', align: 'center' },
    { name: 'preco_total', label: 'Total', align: 'center' },
    { name: 'actions', label: '', align: 'center' }
]

function adicionarItem() {
    form.value.itens.push({
        uid: uid(),
        nome: '',
        unidade: '',
        quantidade: 1,
        preco_unitario: 0,
        preco_total: 0
    })
}

function removerItem(id) {
    form.value.itens = form.value.itens.filter(item => item.uid !== id)
    recalcularTotais()
}

function recalcularTotais() {
    let total = 0
    form.value.itens.forEach(item => {
        item.preco_total = (item.quantidade || 0) * (item.preco_unitario || 0)
        total += item.preco_total
    })
    form.value.valor = total
}

function abrirFormulario() {
    form.value = {
        descricao: '',
        valor: 0,
        natureza: '',
        categoria_id: null,
        cartao_id: null,
        recorrencia_id: null,
        itens: []
    }
    modoEdicao.value = false
    formAberto.value = true
}

function cancelarFormulario() {
    formAberto.value = false
    modoEdicao.value = false
}

async function carregarLancamentos() {
    const { data } = await api.get('/lancamentos?_preload=categoria')
    lancamentos.value = data
}

async function salvarLancamento() {
    try {
        await api.post('/lancamentos', form.value)
        Notify.create({ type: 'positive', message: 'Lançamento salvo com sucesso!' })
        formAberto.value = false
        await carregarLancamentos()
    } catch (err) {
        Notify.create({ type: 'negative', message: 'Erro ao salvar lançamento.' })
        console.error(err)
    }
}

async function deletarLancamento(id) {
    Dialog.create({
        title: 'Excluir Lançamento?',
        message: 'Confirma a exclusão?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        await api.delete(`/lancamentos/${id}`)
        Notify.create({ type: 'positive', message: 'Excluído com sucesso!' })
        await carregarLancamentos()
    })
}

onMounted(async () => {
    await carregarLancamentos()
    categorias.value = (await api.get('/categorias')).data
    cartoes.value = (await api.get('/cartoes')).data
    recorrencias.value = (await api.get('/recorrencias')).data
})
</script>
