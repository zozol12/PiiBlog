<template>
    <div class="min-h-screen py-8">
      <div class="container mx-auto">
        <h1 class="text-3xl font-semibold mb-8">Blog</h1>
  
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <!-- Blog Feed -->
          <div class="md:w-3/4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PostCard
                v-for="(post, index) in visiblePosts"
                :key="index"
                :post="post"
                :backgroundImageStyle="getBackgroundImageStyle(post.thumbnail)"
              />
            </div>
            <!-- Load More Button -->
            <div class="text-center">
              <button
                v-if="hasMorePosts"
                @click="loadMorePosts"
                :disabled="isLoading"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
              >
                {{ isLoading ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          </div>
  
          <!-- Side Panel -->
          <div class="md:w-1/4 space-y-4">
            <div class="p-4 rounded-lg shadow-md">
              <div class="text-center mb-4">
                <div class="text-2xl font-semibold">Profile</div>
              </div>
              <!-- Add profile content here -->
            </div>
  
            <div class="p-4 rounded-lg shadow-md">
              <div class="text-center mb-4">
                <div class="text-2xl font-semibold">Settings</div>
              </div>
              <!-- Add settings content here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
const client = useSupabaseClient();
const postLimit = 6;

const visiblePosts = ref([]);
let loadedPosts = 0;
let isLoading = ref(false);
let hasMorePosts = ref(true);

const loadMorePosts = async () => {
  if (isLoading.value || !hasMorePosts.value) return;

  isLoading.value = true;

  const { data: newPosts, error } = await client
    .from('Posts')
    .select('name, thumbnail, created_at, created_by')
    .range(loadedPosts, loadedPosts + postLimit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    // Handle error
    console.error(error);
  } else {
    if (newPosts.length === 0) {
      // No more posts to load
      hasMorePosts.value = false;
    } else {
      visiblePosts.value = [...visiblePosts.value, ...newPosts];
      loadedPosts += newPosts.length;
    }
  }

  isLoading.value = false;
};

// Initial load
loadMorePosts();

const getBackgroundImageStyle = (thumbnail_name) => {
  if (thumbnail_name) {
    const storage = client.storage.from('thumbnails');
    const backgroundImageUrl = storage.getPublicUrl(thumbnail_name).data.publicUrl;
    return { backgroundImage: `url('${backgroundImageUrl}')` };
  }
  return null;
};

onMounted(() => {
  // You can trigger `loadMorePosts` when the user scrolls or performs an action to load more posts.
  // For example:
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMorePosts();
    }
  });
});
</script>