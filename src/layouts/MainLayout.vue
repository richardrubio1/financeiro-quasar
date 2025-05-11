<template>
  <q-layout view="lHh Lpr lFf">
   <q-header elevated class="bg-primary text-white">
  <q-toolbar>
    <q-toolbar-title shrink class="cursor-pointer" @click="$router.push('/')">Controlled Finance</q-toolbar-title>
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

    <!-- Sair -->
    <q-space />
    <q-btn flat label="Sair" @click="logout" />
  </q-toolbar>
</q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuth } from 'src/composables/useAuth'
const { logout } = useAuth()
</script>
