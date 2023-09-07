<template>
  <div class="min-h-screen text-white p-8">
    <h1 class="text-3xl font-semibold mb-8">Profile</h1>
    <div class="space-y-4">
      <UTabs :items="items">
        <template #item="{ item }">
          <UCard @submit.prevent="() => onSubmit(item.key === 'account' ? accountForm : passwordForm)">
            <template #header>
              <h3 class="text-lg font-semibold leading-6 text-white">{{ item.label }}</h3>
              <p class="mt-1 text-sm text-gray-400">{{ item.description }}</p>
            </template>
            <div v-if="item.key === 'account'" class="space-y-3">
              <UFormGroup label="Email" name="email">
                <UInput v-model="accountForm.email" />
              </UFormGroup>
            </div>
            <div v-else-if="item.key === 'password'" class="space-y-3">
              <UFormGroup label="Current Password" name="current" required>
                <UInput v-model="passwordForm.currentPassword" type="password" required />
              </UFormGroup>
              <UFormGroup label="New Password" name="new" required>
                <UInput v-model="passwordForm.newPassword" type="password" required />
              </UFormGroup>
            </div>
            <template #footer>
              <UButton type="submit">
                Save {{ item.key === 'account' ? 'Account' : 'Password' }}
              </UButton>
            </template>
          </UCard>
        </template>
      </UTabs>

      <!-- Create Post Button -->
      <div class="text-center">
        <NuxtLink to="/post/creator">
          <UButton class=" text-white font-semibold py-2 px-4 rounded-lg focus:outline-none">
            Create New Post
          </UButton>
        </NuxtLink>
      </div>

      <!-- Logout Button -->
      <div class="text-center">
        <UButton @click="logout" color="red" class=" text-white font-semibold py-2 px-4 rounded-lg focus:outline-none">
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const user = useSupabaseUser();
const state = ref({
  email: user.value ? user.value.email : '',
});
const items = [
  {
    key: 'account',
    label: 'Account',
    description: 'Make changes to your account here. Click save when you\'re done.',
  },
  {
    key: 'password',
    label: 'Password',
    description: 'Change your password here. After saving, you\'ll be logged out.',
  },
];
const accountForm = reactive({ email: state.email });
const passwordForm = reactive({ currentPassword: '', newPassword: '' });

const client = useSupabaseClient();

async function onSubmit(form) {
  console.log('Submitted form:', form);
};

async function logout() {
  try {
    await client.auth.signOut();
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
};
</script>