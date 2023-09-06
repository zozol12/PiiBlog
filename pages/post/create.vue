<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'

import type { Database } from '~/types'

const state = ref({
  name: '',
  slug: '',
  content: '',
  thumbnailFile: null,
  meta_title: '',
  meta_description: '',
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (!state.slug) errors.push({ path: 'slug', message: 'Required' });
  if (!state.content) errors.push({ path: 'content', message: 'Required' });
  return errors;
};

const form = ref();

const user = useSupabaseUser();
const errorMsg = ref(null);
const successMsg = ref(null);

const client = useSupabaseClient<Database>();

const submit = async () => {
  await form.value.validate();

  try {
    let thumbnailUrl = "default";

    if (state.value.thumbnailFile) {
      // Upload the thumbnail to Supabase storage
      const { data: thumbnailData, error: thumbnailError } = await client.storage
        .from('thumbnails')
        .upload(state.value.thumbnailFile.name, state.value.thumbnailFile);

      if (thumbnailError) {
        throw thumbnailError;
      }
      console.log(thumbnailData)
      thumbnailUrl = thumbnailData?.Key;
    }

    const { data, error } = await client
      .from('Posts')
      .insert([
        {
          name: state.value.name,
          slug: state.value.slug,
          content: state.value.content,
          thumbnail: thumbnailUrl,
          meta_title: state.value.meta_title,
          meta_description: state.value.meta_description,
          created_by: user.value.email,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    successMsg.value = 'Post created successfully';
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message || 'An error occurred while creating the post';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="bg-gray-800 rounded-lg p-8 w-96 space-y-6">
      <h1 class="text-2xl font-semibold">Create a New Post</h1>

      <UForm ref="form" :validate="validate" :state="state" @submit.prevent="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Slug" name="slug">
          <UInput v-model="state.slug" />
        </UFormGroup>
        <UFormGroup label="Content" name="content">
          <UTextarea resize v-model="state.content" />
        </UFormGroup>
        <div>
          <label class="block text-sm font-medium text-gray-400">Thumbnail</label>
          <input type="file" accept="image/*" @change="handleThumbnailChange" />
        </div>
        <UFormGroup label="Meta title" name="meta_title">
          <UInput v-model="state.meta_title" />
        </UFormGroup>
        <UFormGroup label="Meta description" name="meta_description">
          <UInput v-model="state.meta_description" />
        </UFormGroup>
        <UButton type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none">
          Create Post
        </UButton>
      </UForm>

      <div v-if="errorMsg" class="text-red-500">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="text-green-500">
        {{ successMsg }}
      </div>
    </div>
  </div>
</template>