<script setup lang="ts">
import type * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const toast = useToast()
const loading = ref(false)

const fields = ref<AuthFormField[]>([
  { name: 'username', type: 'text', label: 'Username', required: true },
  { name: 'password', type: 'password', label: 'Password', required: true }
])

type Schema = z.output<typeof schemas.accounts.register>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)

  loading.value = true
  try {
    await $fetch('/api/accounts/register', {
      method: 'POST',
      body: payload.data,
    })

    toast.add({
      title: 'Account created successfully!',
      icon: 'i-lucide-check-circle',
      color: 'primary',
    })
    navigateTo('/login')
  }
  catch (error: unknown) {
    const err = error as { data?: { statusText?: string }, message?: string }
    const message
      = err?.data?.statusText
        || err?.message
        || 'An unexpected error occurred. Please try again.'

    toast.add({
      title: 'Registration failed',
      description: message,
      icon: 'i-lucide-x-circle',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UMain class="flex flex-col items-center justify-center">
    <UPageCard class="max-w-md w-full">
      <UAuthForm
        :schema="schemas.accounts.register"
        title="Register"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :loading
        :fields="fields"
        :submit="{ label: 'Submit', color: 'primary', variant: 'subtle' }"
        class="max-w-md"
        @submit="onSubmit">
        <template #description>
          Already have an account?
          <ULink to="/login" class="text-primary font-medium">Log in</ULink>.
        </template>

        <template #footer>
          By creating an account, you agree to our
          <ULink to="#" class="text-primary font-medium">Terms of Service</ULink>
          and
          <ULink to="#" class="text-primary font-medium">Privacy Policy</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </UMain>
</template>
