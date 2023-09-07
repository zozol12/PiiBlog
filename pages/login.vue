<template>
    <UCard>
      <template #header>Login</template>
      <UForm
        ref="form"
        :state="state"
        @submit.prevent="signIn"
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
        <ULink to="/register"> Don't have an account?</ULink>
        <UAlert title="Error" color="red" variant="solid" v-if="errorMsg">
          <template #title>Error</template>
          <template #description>{{ errorMsg }}</template>
        </UAlert>
        <UAlert title="Success" color="green" variant="solid" v-else-if="successMsg">
          <template #title>Success</template>
          <template #description>{{ successMsg }}</template>
        </UAlert>
      </UForm>
    </UCard>
  </template>
  
  <script setup>
  
  const router = useRouter();
  const state = ref({
    email: '',
    password: '',
  });
  const errorMsg = ref(null);
  const successMsg = ref(null);
  const isLoading = ref(false);
  const client = useSupabaseClient();
  const form = ref();
  
  async function signIn() {
    isLoading.value = true;
    try {
      const { error } = await client.auth.signInWithPassword({
        email: state.value.email,
        password: state.value.password,
      });
      if (error) throw error;
      router.push("/profile");
    } catch (error) {
      errorMsg.value = error.message || 'An error occurred while logging in';
    }
    isLoading.value = false;
  };
  </script>

<style>

</style>