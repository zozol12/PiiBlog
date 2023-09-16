<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div class="animate-in zoom-in space-y-4 duration-700 md:w-11/12">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Placeholder for posts -->
      <div v-if="shouldShowNoPostsFound" class="text-xl text-red-500">
        No Posts found matching to your search :(
      </div>

      <PostPlaceholder
        v-for="index in postLimit"
        v-if="shouldShowPlaceholders"
        :key="index"
      />

      <PostCard
        v-for="(post, index) in filteredPosts"
        :key="index"
        :post="post"
      />
    </div>
    <!-- Load More Button -->
    <div v-if="hasMorePosts" class="text-center">
      <UButton
        :loading="isLoading"
        class="rounded-lg px-4 py-2 font-semibold transition duration-75 focus:outline-none"
        @click="loadMorePosts"
      >
        {{ isLoading ? "Loading..." : "Load More" }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
type Post = Database["public"]["Tables"]["Posts"]["Row"];

const backend = useBackend();
const postLimit: number = 4;

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

// TODO useBackend.vue integration

const loadMorePosts = async () => {
  if (isLoading.value || !hasMorePosts.value) {
    return;
  }

  isLoading.value = true;

  const filters = [];
  // Build an array of filter conditions based on query parameters
  if (query.tags) {
    filters.push({ field: "tags", value: [query.tags], operator: "contains" });
  }
  if (query.search) {
    filters.push({
      field: "name",
      value: `%${query.search}`,
      operator: "ilike",
    });
  }
  if (query.author) {
    filters.push({
      field: "created_by",
      value: `%${query.author}`,
      operator: "ilike",
    });
  }
  // Use selectSupabase to fetch posts
  const newPosts = await backend.select({
    table: "Posts",
    offset: loadedPosts.value,
    limit: postLimit,
    orderByField: "created_at",
    ascendingDate: false,
    queryOptions: "slug, tags, name, thumbnail, created_at, created_by",
    filters,
  });

  if (newPosts.length === 0) {
    hasMorePosts.value = false;
  } else {
    visiblePosts.value = [...visiblePosts.value, ...newPosts];
    loadedPosts.value += newPosts.length;

    if (newPosts.length < postLimit) {
      hasMorePosts.value = false;
    }
  }

  isLoading.value = false;
  initialLoad.value = true;
};
// Initial load
loadMorePosts();

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
    query.tags = newQuery.tags || "";
    query.search = newQuery.search || "";
    query.author = newQuery.author || "";

    // Reset values and search with new query
    visiblePosts.value = [];
    loadedPosts.value = 0;

    initialLoad.value = false;
    hasMorePosts.value = true;

    loadMorePosts();
  },
);
</script>
