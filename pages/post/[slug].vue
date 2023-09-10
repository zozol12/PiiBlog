<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="py-8">
    <UCard class="max-w-8xl mx-auto p-4 shadow-2xl rounded-lg">
      <header v-if="post" class="text-center items-center mb-6">
        <NuxtImg :src="storage.getThumbnailUrl(post.thumbnail)" class="max-h-96 min-w-full" />
        <h1 class="text-3xl font-semibold">
          {{ post.name }}
        </h1>
      </header>
      <main>
        <div v-if="post">
          <div v-html="md.render(post.content)" />
        </div>
        <div v-else-if="!postFetched" class="text-center">
          <p>Loading post...</p>
        </div>
        <div v-else class="text-center text-red-600">
          <p>Post not found</p>
        </div>
      </main>
      <footer v-if="post" class="mt-6 text-sm ">
        <p>Author: {{ post.created_by }}</p>
        <p>Created on: {{ dateUtils.formatDate(post.created_at) }}</p>
      </footer>
      <!-- Edit button for authenticated users -->
      <div v-if="user" class="flex justify-between mt-4">
        <NuxtLink :to="{ path: 'creator', query: { mode: 'edit', slug: slug } }">
          <UButton class="btn">
            Edit Post
          </UButton>
        </NuxtLink>
        <NuxtLink :to="{ path: 'creator', query: { mode: 'remove', slug: slug } }">
          <UButton class="btn" color="red">
            Remove Post
          </UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">

import type { Database } from '~/utils/supabase'

const storage = useStorageUtils()

const dateUtils = useDateUtils()

const md = useMarkdownUtils()

const route = useRoute()
const slug = ref(route.params.slug)
const post: Ref<any> = ref(null)
const client = useSupabaseClient<Database>()

const postFetched = ref(false) // Initially, hide the post content
const user = useSupabaseUser()

async function fetchPost () {
  const { data, error } = await client
    .from('Posts')
    .select('*')
    .eq('slug', slug.value)
    .single()

  if (error) {
    // console.error('Error fetching post:', error.message)
  } else {
    post.value = data
    // console.log(post.value.name)
  }

  postFetched.value = true
  useSeoMeta({
    title: data?.meta_title,
    ogTitle: data?.meta_title,
    description: data?.meta_description,
    ogDescription: data?.meta_description,
    ogImage: storage.getThumbnailUrl(data?.thumbnail)
  })
};

onMounted(() => {
  fetchPost()
})
</script>
