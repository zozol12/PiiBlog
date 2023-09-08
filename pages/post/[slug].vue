<template>
  <div class="min-h-screen py-8">
    <div class="max-w-8xl mx-auto p-4 shadow-2xl rounded-lg">
      <header class="text-center mb-6" v-if="post">
        <h1 class="text-3xl font-semibold">{{ post.name }}</h1>
      </header>
      <main>
        <div v-if="post">
          <div v-html="md.render(post.content)"></div>
        </div>
        <div v-else-if="!postFetched" class="text-center">
          <p>Loading post...</p>
        </div>
        <div v-else class="text-center text-red-600">
          <p>Post not found</p>
        </div>
      </main>
      <footer class="mt-6 text-sm " v-if="post">
        <p>Author: {{ post.created_by }}</p>
        <p>Created on: {{ dateUtils.formatDate(post.created_at) }}</p>
      </footer>
      <!-- Edit button for authenticated users -->
      <div v-if="user">
        <NuxtLink :to="{ path: 'creator', query: { mode: 'edit', slug: slug } }">
          <button class="btn">Edit Post</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">

import type { Database } from '~/utils/supabase'

const dateUtils = useDateUtils();

const md = useMarkdownUtils();

const route = useRoute();
const slug = ref(route.params.slug);
const post: Ref<any> = ref(null);
const client = useSupabaseClient<Database>();

const postFetched = ref(false); // Initially, hide the post content
const user = useSupabaseUser();

async function fetchPost() {
  const { data, error } = await client
    .from('Posts')
    .select('*')
    .eq('slug', slug.value)
    .single();

  if (error) {
    console.error('Error fetching post:', error.message);
  } else {
    post.value = data;
    console.log(post.value.name)
  }

  postFetched.value = true;
};

onMounted(() => {
  fetchPost();
});
</script>