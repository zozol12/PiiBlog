<template>
  <UCard>
    <template #header>
      Login
    </template>
    <UForm
      ref="form"
      :state="state"
      class="space-y-3"
      @submit.prevent="signIn"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton :loading="isLoading" type="submit" class="font-semibold py-2 mt-4 px-4 rounded-lg focus:outline-none">
        {{ isLoading ? 'Logging in...' : 'Submit' }}
      </UButton>
      <ULink class="ml-4" to="/register">
        Don't have an account?
      </ULink>
      <UAlert v-if="errorMsg" title="Error" color="red" variant="solid" class="mt-4">
        <template #title>
          Error
        </template>
        <template #description>
          {{ errorMsg }}
        </template>
      </UAlert>
      <UAlert v-else-if="successMsg" title="Success" color="green" variant="solid" class="mt-4">
        <template #title>
          Success
        </template>
        <template #description>
          {{ successMsg }}
        </template>
      </UAlert>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
const state = ref({
  email: '',
  password: ''
})
const errorMsg = ref(null)
const successMsg = ref(null)
const isLoading = ref(false)
const form = ref()

async function signIn () {
  isLoading.value = true
  try {
    await useLoginUtils().signIn(state.value.email, state.value.password)
  } catch (error) {
    errorMsg.value = error.message || 'An error occurred while logging in'
  }
  isLoading.value = false
};
</script>

<style>

</style>
