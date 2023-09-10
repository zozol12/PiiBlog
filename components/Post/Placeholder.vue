<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-2xl">
    <div class="relative h-40 md:h-64">
      <!-- Placeholder background -->
      <div class="h-full bg-gray-400 dark:bg-gray-500 absolute inset-0" />
      <div class="absolute inset-0 bg-black opacity-50" />
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Placeholder content -->
        <div class="text-white text-center px-6">
          <!-- Placeholder title -->
          <h2 class="text-2xl md:text-3xl font-semibold mb-2">
            Loading...
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostPlaceholder'
}
</script>
