<template>
  <div class="py-8">
    <div class="container mx-auto">
      <div
        class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0"
      >
        <!-- Blog Feed -->
        <PostFeed />

        <!-- Side Panel -->
  <div
    class="animate-in bottom-0 right-0 flex flex-col space-y-4 rounded-xl bg-gray-800 shadow-2xl duration-700 md:w-1/4 h-[440px]"
  >
    <div class="rounded-lg p-4 flex-grow text-center shadow-md">
      <div class="mb-4 text-center">
        <div class="text-sec text-2xl font-semibold text-white">
          Author
        </div>
      </div>
      PiiNut Industries
      <!-- profile content here -->
    </div>
    <div v-if="user" class="rounded-lg p-4 flex-grow shadow-md">
      <div class="mb-4 text-center">
        <div class="text-2xl font-semibold text-white">Settings</div>
      </div>
      <!-- settings content here -->
    </div>
    <!-- Clickable tag badges -->
    <div class="rounded-lg p-4 justify-start text-center shadow-md">
      <div class="mb-4 text-center">
        <div class="text-sec text-2xl font-semibold text-white">
          Tags / Categories
        </div>
      </div>
      <router-link
        v-for="(tag, index) in tags"
        :key="index"
        :to="`/?tags=${tag.name}`"
      >
        <UBadge :label="tag.name" class="ml-1 mr-1" />
      </router-link>
    </div>
    <div class="flex-shrink-0 rounded-lg p-8 text-center">
      <UButton v-if="user" color="red" class="px-4 py-2" @click="logout">
        <Icon name="heroicons:lock-closed-solid" /> Logout
      </UButton>
      <UButton v-else-if="config.showLoginButton" class="px-4 py-2" @click="login">
        <Icon name="heroicons:lock-closed-solid" /> Login
      </UButton>
    </div>
  </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useConfig()
const user = useSupabaseUser();

const tags: Ref<any[]> = ref([]);
// Fetch tags
async function loadTags() {
  tags.value = await useSupabase().getTags();
}

async function logout() {
  try {
    await useSupabase().signOut();
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
