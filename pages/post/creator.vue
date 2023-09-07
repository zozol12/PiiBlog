<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'

import type { Database } from '~/types'

const router = useRouter();

const mode: string = router.currentRoute.value.query.mode as string || 'create';
const postSlug: string = router.currentRoute.value.query.slug as string || '';


const state = ref({
  name: '',
  slug: '',
  content: '',
  thumbnailFile: null,
  meta_title: '',
  meta_description: '',
});

async function fetchPostData() {
  try {
    const { data: postData, error: postError } = await client
      .from('Posts')
      .select('*')
      .eq('slug', postSlug)
      .single();

    if (postError) {
      throw postError;
    }

    // Populate form fields with fetched data
    state.value.name = postData.name;
    state.value.slug = postData.slug;
    state.value.content = postData.content;
    state.value.meta_title = postData.meta_title;
    state.value.meta_description = postData.meta_description;

    // You may need additional logic to handle thumbnail data

  } catch (error) {
    console.error(error);
    errorMsg.value = error.message || 'An error occurred while fetching post data';
  }
}
const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: 'name', message: 'Required' });
  if (!state.slug) errors.push({ path: 'slug', message: 'Required' });
  if (!state.content) errors.push({ path: 'content', message: 'Required' });
  return errors;
};

const form = ref();

const user = useSupabaseUser();
const errorMsg = ref(undefined);
const successMsg = ref(null);

const client = useSupabaseClient<Database>();

function handleThumbnailChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    state.value.thumbnailFile = target.files[0];
  }
}

async function submit() {
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
    if (mode === 'edit') {

      const { data, error } = await client
        .from('Posts')
        .update(
          {
            name: state.value.name,
            slug: state.value.slug,
            content: state.value.content,
            thumbnail: thumbnailUrl,
            meta_title: state.value.meta_title,
            meta_description: state.value.meta_description,
          })
        .eq('slug', postSlug)
        .select();

      if (error) {
        throw error;
      }
    } else {
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
    }
    successMsg.value = 'Post created successfully';
  } catch (error) {
    console.error(error);
    errorMsg.value = error.message || 'An error occurred while creating the post';
  }
};

onMounted(() => {
  if (mode === 'edit') {
    if (!postSlug) {
      // If in edit mode but no postSlug is provided, redirect to home page
      router.push('/');
    }
    // Fetch data only if in edit mode and postSlug is provided
    fetchPostData();
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="rounded-lg p-8 w-10/12 space-y-6">
      <h1 class="text-2xl font-semibold">{{ mode === 'edit' ? 'Edit Post' : 'Create a New Post' }}</h1>

      <UForm ref="form" :validate="validate" :state="state" @submit.prevent="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" placeholder="Name of your post. Make sure it's catchy!" />
        </UFormGroup>
        <UFormGroup label="Slug" name="slug">
          <UInput v-model="state.slug" placeholder="your-post-name-like-this-explanatory-not-catchy" />
        </UFormGroup>
        <UFormGroup label="Content" name="content">
          <UTextarea resize v-model="state.content" placeholder="You can use markdown here!" />
        </UFormGroup>
        <div>
          <label class="block text-sm font-medium text-gray-400">Thumbnail</label>
          <input type="file" accept="image/*" @change="handleThumbnailChange" />
        </div>
        <UFormGroup label="Meta title" name="meta_title">
          <UInput v-model="state.meta_title" placeholder="Meta title for browsers!" />
        </UFormGroup>
        <UFormGroup label="Meta description" name="meta_description">
          <UInput v-model="state.meta_description" placeholder="And meta description for browsers" />
        </UFormGroup>
        <UButton type="submit" class="text-white font-semibold py-2 px-4 rounded-lg focus:outline-none">
          {{ mode === 'edit' ? 'Update Post' : 'Create Post' }}
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