<template>
  <UCard class="animate-in zoom-in duration-700">
    <template #header> Login </template>
    <UForm ref="form" :state="state" class="space-y-3" @submit.prevent="signIn">
      <UFormGroup label="Email (hint: example@example.com)" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password (hint: example)" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton
        :loading="isLoading"
        type="submit"
        class="mt-4 rounded-lg px-4 py-2 font-semibold focus:outline-none"
      >
        {{ isLoading ? "Logging in..." : "Submit" }}
      </UButton>
      <ULink class="ml-4" to="/register"> Don't have an account? </ULink>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
const state = ref({
  email: "",
  password: "",
});
const isLoading = ref(false);
const form = ref();
const toast = useToast();

async function signIn() {
  isLoading.value = true;
  try {
    await useBackend().signIn(state.value.email, state.value.password);
  } catch (_e: any) {
    const error: Error = _e;
    toast.add({
      title: error.message || "An error occurred while logging in",
      color: "red",
    });
  }
  isLoading.value = false;
}
</script>

<style></style>
