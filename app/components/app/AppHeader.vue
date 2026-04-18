<script lang="ts" setup>
const { loggedIn, clear } = useUserSession()
</script>

<template>
  <UHeader>
    <template #right>
      <UButton v-if="!loggedIn" label="Login" to="/login" />
      <UButton v-else label="LogOut" @click="clear()" />
    </template>
  </UHeader>
</template>
