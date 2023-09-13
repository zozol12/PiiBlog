<template>
  <nuxt-link :to="`/post/${post.slug}`">
    <div
      ref="parentDiv"
      class="overflow-hidden rounded-lg border border-black bg-white shadow-2xl transition duration-300 hover:scale-105 dark:border-white"
    >
      <div class="relative h-40 md:h-64" :style="imageContainerStyle">
        <NuxtImg
          :src="storage.getThumbnailUrl(post.thumbnail)"
          :alt="post.name"
          :width="width"
          :height="height"
          class="absolute inset-0 h-full w-full object-cover"
          lazy
        />
        <div class="absolute inset-0 bg-black opacity-30" />
        <div
          class="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-center"
        >
          <div class="px-6 py-4 text-white">
            <h2 class="mb-2 text-2xl font-semibold md:text-3xl">
              {{ post.name }}
            </h2>
            <div>
              <nuxt-link
                v-for="(tag, index) in post.tags"
                :key="index"
                :to="`/?tags=${tag}`"
              >
                <UBadge :label="tag" class="ml-1 mr-1" />
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
const storage = useStorageUtils();
const { post } = defineProps({
  post: {
    type: Object as PropType<{
      slug: string;
      tags: string[];
      name: string;
      thumbnail: string;
      created_at: string;
      created_by: string;
    }>,
    required: true,
  },
});

const parentDiv = ref(); // Create a ref for the parent div

// Computed properties to calculate width and height based on the parent div's dimensions
const width = computed(() => {
  if (parentDiv.value) {
    return parentDiv.value.offsetWidth; // Get the parent div's width
  }
  return null;
});

const height = computed(() => {
  if (parentDiv.value) {
    return parentDiv.value.offsetHeight; // Get the parent div's height
  }
  return null;
});

const imageContainerStyle = computed(() => {
  // Use the computed width and height to set the style for the image container
  return {
    width: `${width.value}px`,
    height: `${height.value}px`,
  };
});
</script>
