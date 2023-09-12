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
          class="max-h-min space-y-4 rounded-xl bg-gray-800 shadow-2xl md:w-1/4"
        >
          <div class="rounded-lg p-4 text-center shadow-md">
            <div class="mb-4 text-center">
              <div class="text-sec text-2xl font-semibold text-white">
                Profile
              </div>
            </div>
            <!-- profile content here -->
          </div>

          <div v-if="user" class="rounded-lg p-4 shadow-md">
            <div class="mb-4 text-center">
              <div class="text-2xl font-semibold text-white">Settings</div>
            </div>
            <!-- settings content here -->
          </div>
          <!-- Clickable tag badges -->
          <div class="rounded-lg p-4 text-center shadow-md">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

const tags: Ref<any[]> = ref([]);
// Fetch tags
async function loadTags() {
  tags.value = await useSupabase().getTags();
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
