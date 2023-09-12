<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-2xl">
    <div class="relative h-40 md:h-64">
      <!-- Placeholder background -->
      <div class="absolute inset-0 h-full bg-gray-400 dark:bg-gray-500" />
      <div class="absolute inset-0 bg-black opacity-50" />
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Placeholder content -->
        <div class="px-6 text-center text-white">
          <!-- Placeholder title -->
          <h2 class="mb-2 text-2xl font-semibold md:text-3xl">Loading...</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostPlaceholder",
};
</script>
