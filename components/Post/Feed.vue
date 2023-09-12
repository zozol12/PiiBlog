<template>
  <div class="space-y-4 md:w-3/4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Placeholder for posts -->
      <div v-if="shouldShowNoPostsFound" class="text-xl text-red-500">
        No Posts found matching to your search :(
      </div>
      <PostPlaceholder
        v-for="index in 6"
        v-if="shouldShowPlaceholders"
        :key="index"
      />

      <PostCard
        v-for="(post, index) in filteredPosts"
        :key="index"
        :post="post"
        :background-image-style="
          storage.getBackgroundImageStyle(post.thumbnail)
        "
      />
    </div>
    <!-- Load More Button -->
    <div v-if="hasMorePosts" class="text-center">
      <UButton
        :loading="isLoading"
        class="rounded-lg px-4 py-2 font-semibold focus:outline-none"
        @click="loadMorePosts"
      >
        {{ isLoading ? "Loading..." : "Load More" }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
type Post = Database["public"]["Tables"]["Posts"]["Row"];

const client = useSupabaseClient<Database>();
const postLimit: number = 6;

const visiblePosts: Ref<Post[]> = ref([]);
const loadedPosts: Ref<number> = ref(0);
const isLoading: Ref<boolean> = ref(false);

const initialLoad: Ref<boolean> = ref(false);
const hasMorePosts: Ref<boolean> = ref(true);

const route = useRoute();

// Define a query object to filter posts based on query parameters
const query: any = {
  tags: route.query.tags || "",
  search: route.query.search || "",
  author: route.query.author || "",
};

async function loadMorePosts() {
  if (isLoading.value || !hasMorePosts.value) {
    return;
  }

  isLoading.value = true;

  const postQuery = client
    .from("Posts")
    .select("slug, tags, name, thumbnail, created_at, created_by")
    .range(loadedPosts.value, loadedPosts.value + postLimit - 1)
    .order("created_at", { ascending: false });

  if (query.tags !== "") {
    postQuery.contains("tags", [query.tags]); // Filter by tags if not empty
  }

  if (query.search !== "") {
    postQuery.ilike("name", `%${query.search}%`); // Filter by name if not empty
  }

  if (query.author !== "") {
    postQuery.ilike("created_by", `%${query.author}%`); // Filter by author if not empty
  }

  try {
    const { data: newPosts, error } = await postQuery;

    if (error) {
      throw error;
    }

    if (newPosts.length === 0) {
      hasMorePosts.value = false;
    } else {
      visiblePosts.value = [...visiblePosts.value, ...newPosts];
      loadedPosts.value += newPosts.length;

      if (newPosts.length < postLimit) {
        hasMorePosts.value = false;
      }
    }
  } catch (error) {
    // Handle the error appropriately (e.g., show an error message)
    // console.error('Error loading posts:', error.message)
  }
  isLoading.value = false;
  initialLoad.value = true;
}
// Initial load
loadMorePosts();

const storage = useStorageUtils();

const shouldShowPlaceholders = computed(() => {
  return loadedPosts.value === 0 && isLoading.value;
});

const shouldShowNoPostsFound = computed(() => {
  return loadedPosts.value === 0 && initialLoad.value;
});

const filteredPosts = computed(() => {
  return visiblePosts.value.filter((post) => {
    const tagMatch = !query.tags || post.tags.includes(query.tags);
    const nameMatch =
      !query.search ||
      post.name.toLowerCase().includes(query.search.toLowerCase());
    const authorMatch =
      !query.author ||
      post.created_by.toLowerCase().includes(query.author.toLowerCase());

    return tagMatch && nameMatch && authorMatch;
  });
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.tags) {
      query.tags = newQuery.tags;
    }
    if (newQuery.search) {
      query.search = newQuery.search;
    }
    if (newQuery.author) {
      query.author = newQuery.author;
    }

    // Reset values and search with new query
    visiblePosts.value = [];
    loadedPosts.value = 0;

    initialLoad.value = false;
    hasMorePosts.value = true;

    loadMorePosts();
  },
);
</script>
