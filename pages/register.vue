<script setup lang="ts">
const state: Ref<any> = ref({
  email: undefined,
  password: undefined,
});

const errorMsg: Ref<string | undefined> = ref(undefined);
const successMsg: Ref<string | undefined> = ref(undefined);
const isLoading = ref(false);

const form = ref();
// Sign Up logic
async function signUp() {
  isLoading.value = true;
  try {
    await useSupabase().signUp(state.value.email, state.value.password);
    successMsg.value = "Check your email to confirm";
  } catch (_e: any) {
    const error: Error = _e;
    errorMsg.value = error.message;
  }

  isLoading.value = false;
}
</script>

<template>
  <UCard>
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
      <UAlert v-if="errorMsg" title="Error" color="red" variant="solid">
        <template #description>
          {{ errorMsg }}
        </template>
      </UAlert>
      <UAlert
        v-else-if="successMsg"
        title="Success"
        color="green"
        variant="solid"
      >
        <template #description>
          {{ successMsg }}
        </template>
      </UAlert>
    </UForm>
  </UCard>
</template>

<style></style>
