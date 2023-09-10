<template>
  <div class="py-8">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <!-- Blog Feed -->
        <div class="md:w-3/4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Placeholder for posts -->

            <PostPlaceholder v-for="index in 6" v-if="shouldShowPlaceholders" :key="index" />

            <PostCard
              v-for="(post, index) in visiblePosts"
              :key="index"
              :post="post"
              :background-image-style="storage.getBackgroundImageStyle(post.thumbnail)"
            />
          </div>
          <!-- Load More Button -->
          <div
            v-if="hasMorePosts"
            class="text-center"
          >
            <UButton
              :loading="isLoading"
              class=" font-semibold py-2 px-4 rounded-lg focus:outline-none"
              @click="loadMorePosts"
            >
              {{ isLoading ? 'Loading...' : 'Load More' }}
            </UButton>
          </div>
        </div>

        <!-- Side Panel -->
        <div class="bg-gray-800 md:w-1/4 space-y-4 max-h-min shadow-2xl rounded-xl">
          <div class="p-4 rounded-lg shadow-md text-center">
            <div class="text-center mb-4">
              <div class="text-2xl font-semibold text-sec text-white">
                Profile
              </div>
            </div>
            <!-- profile content here -->
          </div>

          <div v-if="user" class="p-4 rounded-lg shadow-md">
            <div class="text-center mb-4">
              <div class="text-2xl font-semibold text-white">
                Settings
              </div>
            </div>
            <!-- settings content here -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { Database } from '~/utils/supabase'

const client = useSupabaseClient<Database>()
const postLimit: number = 6

const visiblePosts: Ref<any[]> = ref([])
const loadedPosts: Ref<number> = ref(0)
const isLoading: Ref<boolean> = ref(false)
const hasMorePosts: Ref<boolean> = ref(true)
const user = useSupabaseUser()

async function loadMorePosts () {
  if (isLoading.value || !hasMorePosts.value) { return }

  isLoading.value = true

  const { data: newPosts, error } = await client
    .from('Posts')
    .select('slug, name, thumbnail, created_at, created_by')
    .range(loadedPosts.value, loadedPosts.value + postLimit - 1)
    .order('created_at', { ascending: false })

  if (error) {
    // Handle error
    // console.error(error)
  } else if (newPosts.length === 0) {
    // No more posts to load
    hasMorePosts.value = false
  } else {
    // Append new posts to visiblePosts array
    visiblePosts.value = [...visiblePosts.value, ...newPosts]

    // Increment loadedPosts counter
    loadedPosts.value += newPosts.length

    // If newPosts.length is less than postLimit, then there are no more posts to load
    if (newPosts.length < postLimit) {
      hasMorePosts.value = false
    }
  }

  isLoading.value = false
};

// Initial load
loadMorePosts()

const storage = useStorageUtils()

const shouldShowPlaceholders = computed(() => {
  // Return true to show placeholders if loadedPosts is 0
  return loadedPosts.value === 0
})

onMounted(() => {
  // load more posts on scroll
  // window.addEventListener('scroll', () => {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //     loadMorePosts();
  //   }
  // });
})
</script>
