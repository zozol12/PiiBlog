<template>
  <div class="animate-in zoom-in p-8 shadow-2xl duration-700">
    <h1 class="mb-8 text-3xl font-semibold">Profile</h1>
    <div class="space-y-4">
      <UTabs :items="items">
        <template #item="{ item }">
          <UCard
            @submit.prevent="
              () =>
                onSubmit(item.key === 'account' ? accountForm : passwordForm)
            "
          >
            <template #header>
              <h3 class="text-lg font-semibold leading-6">
                {{ item.label }}
              </h3>
              <p class="mt-1 text-sm text-gray-400">
                {{ item.description }}
              </p>
            </template>
            <div v-if="item.key === 'account'" class="space-y-3">
              <UFormGroup label="Email" name="email">
                <UInput v-model="accountForm.email" disabled />
              </UFormGroup>
            </div>
            <div v-else-if="item.key === 'password'" class="space-y-3">
              <UFormGroup label="Current Password" name="current" required>
                <UInput
                  v-model="passwordForm.currentPassword"
                  type="password"
                  disabled
                  required
                />
              </UFormGroup>
              <UFormGroup label="New Password" name="new" required>
                <UInput
                  v-model="passwordForm.newPassword"
                  type="password"
                  disabled
                  required
                />
              </UFormGroup>
            </div>
            <template #footer>
              <div
                class="flex flex-col items-center justify-between gap-y-6 text-center md:flex-row"
              >
                <UButton disabled type="submit">
                  Save {{ item.key === "account" ? "Account" : "Password" }}
                </UButton>

                <NuxtLink to="/post/creator">
                  <UButton class="rounded-lg font-semibold focus:outline-none">
                    Create New Post
                  </UButton>
                </NuxtLink>

                <NuxtLink to="/post/tags">
                  <UButton class="rounded-lg font-semibold focus:outline-none">
                    Modify Tags
                  </UButton>
                </NuxtLink>

                <UButton
                  color="red"
                  class="rounded-lg font-semibold focus:outline-none"
                  @click="logout"
                >
                  Logout
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const state = ref({
  email: user.value ? user.value.email : "",
});
const items = [
  {
    key: "account",
    label: "Account",
    description:
      "Make changes to your account here. Click save when you're done.",
  },
  {
    key: "password",
    label: "Password",
    description:
      "Change your password here. After saving, you'll be logged out.",
  },
];
const accountForm = reactive({ email: state.value.email });
const passwordForm = reactive({ currentPassword: "", newPassword: "" });

async function logout() {
  try {
    await useBackend().signOut();
  } catch (error) {
    // console.error(error)
  }
}
</script>
