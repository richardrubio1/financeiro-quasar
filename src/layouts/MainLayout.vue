<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title shrink class="cursor-pointer" @click="$router.push('/')">
          Sistema Financeiro
        </q-toolbar-title>

        <!-- Groups -->
        <q-btn flat label="Grupos" @click="$router.push('/groups')" />

        <!-- Cadastros -->
        <q-btn-dropdown label="Cadastros" flat dense>
          <q-list>
            <q-item clickable v-ripple to="/cadastros/usuarios">
              <q-item-section>Usuários</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/cadastros/categorias">
              <q-item-section>Categorias</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Lançamentos -->
        <q-btn-dropdown flat label="Lançamentos">
          <q-list>
            <q-item clickable v-ripple to="/lancamentos">
              <q-item-section>Lançar</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- User Menu -->
        <q-space />
        <q-btn-dropdown flat :label="user?.name || 'Menu'">
          <q-list>
            <q-item clickable v-ripple @click="logout">
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuth } from 'src/composables/useAuth'
const { logout, user } = useAuth()
</script>