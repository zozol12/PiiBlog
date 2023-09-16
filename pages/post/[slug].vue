<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="py-8">
    <UCard class="max-w-8xl mx-auto rounded-lg p-4 shadow-2xl">
      <header v-if="post" class="mb-6 items-center text-center">
        <NuxtImg
          :src="storage.getThumbnailUrl(post.thumbnail)"
          class="max-h-96 min-w-full"
        />
        <h1 class="text-3xl font-semibold">
          {{ post.name }}
        </h1>
      </header>
      <main>
        <div v-if="post">
          <div
            class="prose dark:prose-invert lg:prose-xl"
            v-html="md.render(post.content)"
          />
        </div>
        <div v-else-if="!postFetched" class="text-center">
          <p>Loading post...</p>
        </div>
        <div v-else class="text-center text-red-600">
          <p>Post not found</p>
        </div>
      </main>
    </UCard>
    <UCard v-if="post" class="my-4 shadow-md">
      <div class="flex flex-row justify-between">
        <p>Created by: {{ post.created_by }}</p>
        <p>{{ dateUtils.formatDate(post.created_at) }}</p>
      </div>
      <!-- Edit button for authenticated users -->
      <div v-if="user" c class="mt-4 flex justify-between">
        <NuxtLink
          :to="{ path: 'creator', query: { mode: 'edit', slug: slug } }"
        >
          <UButton variant="outline"> Edit Post </UButton>
        </NuxtLink>
        <NuxtLink
          :to="{ path: 'creator', query: { mode: 'remove', slug: slug } }"
        >
          <UButton color="red" variant="outline"> Remove Post </UButton>
        </NuxtLink>
      </div>
    </UCard>
    <!-- Comment section -->
    <PostComments v-if="post" :post-id="post.id" />
  </div>
</template>

<script setup lang="ts">
const config = useConfig();
const storage = useStorageUtils();
const dateUtils = useDateUtils();
const md = useMarkdownUtils();
const route = useRoute();

const slug = ref(route.params.slug);
const post: Ref<any> = ref(null);

const postFetched = ref(false); // Initially, hide the post content
const user = useSupabaseUser();

const backend = useBackend();

async function fetchPost() {
  let data;
  const filters = [{ field: "slug", value: slug.value }];
  try {
    const posts = await backend.select({ table: "Posts", filters, limit: 1 });
    data = posts[0];
    post.value = data;
  } catch (_e) {}

  postFetched.value = true;
  useSeoMeta({
    title: `${config.blogName} | ${data?.meta_title}`,
    ogTitle: `${config.blogName} | ${data?.meta_title}`,
    description: `${config.blogName} | ${data?.meta_description}`,
    ogDescription: `${config.blogName} | ${data?.meta_description}`,
    ogImage: `${config.blogName} ${storage.getThumbnailUrl(data?.thumbnail)}`,
  });
}

onMounted(() => {
  fetchPost();
});
</script>
