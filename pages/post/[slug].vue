<template>
    <div class="min-h-screen py-8">
      <div class="max-w-8xl mx-auto p-4 bg-slate-900 shadow-lg rounded-lg">
        <header class="text-center mb-6" v-if="post">
          <h1 class="text-3xl font-semibold">{{ post.name }}</h1>
        </header>
        <main>
          <div v-if="post">
            <div v-html="post.content"></div>
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
          <p>Created on: {{ formatDate(post.created_at) }}</p>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

    import type { Database } from '~/types'
    import { formatDate } from '@/utils/dateUtils';

    const route = useRoute();
    const slug = ref(route.params.slug);
    const post: Ref<any> = ref(null);
    const client = useSupabaseClient<Database>();
    const postFetched = ref(false); // Initially, hide the post content

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