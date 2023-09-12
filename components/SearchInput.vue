<template>
  <UInput
    v-model="q"
    name="q"
    placeholder="Search Blog..."
    icon="i-heroicons-magnifying-glass-20-solid"
    :ui="{ icon: { trailing: { pointer: '' } } }"
    class="xs:m-2"
    @keydown.enter="handleSubmit"
  >
    <template #trailing>
      <UButton
        v-show="q !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="clearSearch"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const q = ref("");
// TODO Change reload
const handleSubmit = async () => {
  await navigateTo({ path: "/", query: { search: q.value } });
};

const clearSearch = () => {
  q.value = "";
};
</script>
