<script setup>
const state = ref({
  email: undefined,
  password: undefined
})

const errorMsg = ref(null)
const successMsg = ref(null)
const isLoading = ref(false)

const client = useSupabaseClient()

const form = ref()
// Sign Up logic
async function signUp () {
  isLoading.value = true
  try {
    // Do something with state.value
    const { data, error } = await client.auth.signUp({
      email: state.value.email, password: state.value.password
    })
    if (error) { throw error }
    successMsg.value = 'Check your email to confirm'
  } catch (error) {
    errorMsg.value = error.message
  }

  isLoading.value = false
}
</script>

<template>
  <UCard>
    <template #header>
      Register
    </template>
    <UForm
      ref="form"
      :state="state"
      @submit.prevent="signUp"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton :loading="isLoading" type="submit" class="font-semibold py-2 px-4 rounded-lg focus:outline-none">
        {{ isLoading ? 'Logging in...' : 'Submit' }}
      </UButton>
      <ULink to="/login">
        Already have an account?
      </ULink>
      <UAlert v-if="errorMsg" title="Error" color="red" variant="solid">
        <template #description>
          {{ errorMsg }}
        </template>
      </UAlert>
      <UAlert v-else-if="successMsg" title="Success" color="green" variant="solid">
        <template #description>
          {{ successMsg }}
        </template>
      </UAlert>
    </UForm>
  </UCard>
</template>

<style>

</style>
