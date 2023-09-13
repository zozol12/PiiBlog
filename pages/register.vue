<script setup lang="ts">
const state: Ref<any> = ref({
  email: undefined,
  password: undefined,
})
const toast = useToast()
const isLoading = ref(false)

const form = ref()
// Sign Up logic
async function signUp() {
  isLoading.value = true;
  try {
    await useSupabase().signUp(state.value.email, state.value.password)
    toast.add({ title: "Check your email to confirm!"})
  } catch (_e: any) {
    const error: Error = _e
    toast.add({ title: error.message || "An error occurred while creating the post", color: 'red' })
  }

  isLoading.value = false
}
</script>

<template>
  <UCard class="animate-in zoom-in duration-700">
    <template #header> Register </template>
    <UForm ref="form" :state="state" @submit.prevent="signUp">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton
        :loading="isLoading"
        type="submit"
        class="rounded-lg px-4 py-2 font-semibold focus:outline-none"
      >
        {{ isLoading ? "Logging in..." : "Submit" }}
      </UButton>
      <ULink to="/login"> Already have an account? </ULink>
    </UForm>
  </UCard>
</template>

<style></style>
