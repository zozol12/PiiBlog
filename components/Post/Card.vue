<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg">
    <div class="relative h-40 md:h-64">
      <div :style="backgroundImageStyle" class="h-full bg-cover bg-center absolute inset-0"></div>
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-white text-center px-6">
          <h2 class="text-2xl md:text-3xl font-semibold mb-2">{{ post.name }}</h2>
          <p class="text-sm md:text-base">Post created at: {{ post.created_at }}</p>
          <p class="text-sm md:text-base italic">Post created by: {{ post.created_by }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    backgroundImageStyle: {
      type: Object,
      required: true,
    },
  },
};
</script>