<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nuxt-link :to="`/post/${post.slug}`">
    <div class="overflow-hidden rounded-lg border border-black dark:border-white bg-white shadow-2xl">
      <div class="relative h-40 md:h-64">
        <div
          :style="backgroundImageStyle"
          class="absolute inset-0 h-full bg-cover bg-center"
        />
        <div class="absolute inset-0 bg-black opacity-70" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="px-6 text-center text-white">
            <h2 class="mb-2 text-2xl font-semibold md:text-3xl">
              {{ post.name }}
            </h2>
            <p class="text-sm italic md:text-base">
              Post created by: {{ post.created_by }}
            </p>
            <nuxt-link
              v-for="(tag, index) in post.tags"
              :key="index"
              :to="`/?tags=${tag}`"
            >
              <UBadge :label="tag" class="ml-1 mr-1" />
            </nuxt-link>
            <p class="text-sm md:text-base">
              {{ dateUtils.formatDate(post.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
const dateUtils = useDateUtils();

defineProps({
  post: {
    type: Object as PropType<{
      slug: string;
      tags: string[];
      name: string;
      created_at: string;
      created_by: string;
    }>,
    required: true,
  },
  backgroundImageStyle: {
    type: Object,
    required: true,
  },
});
</script>
