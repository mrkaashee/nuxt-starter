<script lang="ts" setup>
const { user } = useUserSession()
</script>

<template>
  <UMain>
    <UContainer>
      <UUser
        v-if="user"
        :avatar="{ src: user.avatar }"
        name="User Name"
        :description="user.email" />
    </UContainer>
  </UMain>
</template>
