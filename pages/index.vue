<template>
  <div class="py-8">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <!-- Blog Feed -->
        <PostFeed class="col-span-2 mb-4" />

        <!-- Side Panel -->
        <div class="md:col-span-1">
          <div
            class="animate-in bottom-0 right-0 flex h-[480px] flex-col rounded-xl bg-gray-800 shadow-2xl duration-700"
          >
            <div class="flex flex-col rounded-lg p-4 text-center text-white">
              <div class="mb-4 text-center">
                <div class="text-2xl font-semibold text-white">Author</div>
              </div>
              PiiNut
              <NuxtImg
                class="mt-6 self-center rounded-xl"
                src="piinut-high-resolution-color-logo.webp"
                format="webp"
                loading="lazy"
                height="256"
                width="341"
                alt="Author Logo"
                lazy
              />
            </div>

            <div class="rounded-lg p-8 text-center">
              <UButton
                v-if="user"
                color="red"
                variant="outline"
                class="px-4 py-2"
                @click="logout"
              >
                <Icon name="heroicons:lock-closed-solid" /> Logout
              </UButton>
              <UButton
                v-else-if="config.showLoginButton"
                variant="outline"
                class="px-4 py-2"
                @click="login"
              >
                <Icon name="heroicons:lock-closed-solid" /> Login
              </UButton>
            </div>
          </div>
          <!-- Clickable tag badges -->
          <div class="mt-4 rounded-lg p-4 text-center">
            <div class="mb-4 text-center">
              <div
                class="text-sec text-2xl font-semibold transition duration-100"
              >
                Tags / Categories
              </div>
            </div>
            <UButton
              v-for="(tag, index) in tags"
              :key="index"
              class="m-1 transition duration-500"
              :variant="colorMode.value === 'dark' ? 'outline' : 'solid'"
              :to="`/?tags=${tag.name}`"
            >
              {{ tag.name }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useConfig();
const user = useSupabaseUser();

const tags: Ref<any[]> = ref([]);
// Fetch tags
async function loadTags() {
  tags.value = await useBackend().getTags();
}
const colorMode = useColorMode();

async function logout() {
  try {
    await useBackend().signOut();
  } catch (error) {
    // console.error(error)
  }
}

async function login() {
  try {
    await navigateTo("/login");
  } catch (error) {
    // console.error(error)
  }
}

onMounted(() => {
  // load more posts on scroll
  // window.addEventListener('scroll', () => {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //     loadMorePosts();
  //   }
  // });
  loadTags();
});
</script>
