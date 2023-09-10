<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'

import type { Database } from '~/utils/supabase'

const router = useRouter()

const mode: string = router.currentRoute.value.query.mode as string || 'create'
const postSlug: string = router.currentRoute.value.query.slug as string || ''
interface PostData {
  name: string;
  slug: string;
  thumbnailFile: File | null;
  thumbnailPath: string;
  content: string;
  meta_title: string;
  meta_description: string;
}
const state = ref<PostData>({
  name: '',
  slug: '',
  content: '',
  thumbnailPath: 'default',
  thumbnailFile: null,
  meta_title: '',
  meta_description: ''
})

async function fetchPostData () {
  try {
    const { data: postData, error: postError } = await client
      .from('Posts')
      .select('*')
      .eq('slug', postSlug)
      .single()

    if (postError) {
      throw postError
    }

    // Populate form fields with fetched data
    if (postData) {
      state.value.name = postData.name
      state.value.slug = postData.slug
      state.value.thumbnailPath = postData.thumbnail
      state.value.content = postData.content
      state.value.meta_title = postData.meta_title
      state.value.meta_description = postData.meta_description
    }
  } catch (error) {
    // console.error(error)
    errorMsg.value = error.message || 'An error occurred while fetching post data'
  }
}
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) { errors.push({ path: 'name', message: 'Required' }) }
  if (!state.slug) { errors.push({ path: 'slug', message: 'Required' }) }
  if (!state.content) { errors.push({ path: 'content', message: 'Required' }) }
  return errors
}

const form = ref()

const user = useSupabaseUser()
const errorMsg = ref(undefined)
const successMsg = ref(null)
const isLoading = ref(false)

// redirect to login page if user is not authenticated
if (!user.value) {
  router.push('/login')
}

const client = useSupabaseClient<Database>()

async function handleThumbnailChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    state.value.thumbnailFile = target.files[0]
    state.value.thumbnailPath = state.value.thumbnailFile.name
    // Upload the thumbnail to Supabase storage
    const { data: thumbnailData, error: thumbnailError } = await client.storage
      .from('thumbnails')
      .upload(state.value.thumbnailPath, state.value.thumbnailFile)

    if (thumbnailError) {
      errorMsg.value = 'Resource with the same name exists already! Using the one that was already uploaded...'
    }
  }
}

async function removePost () {
  const { data, error } = await client.from('Posts').delete().eq('slug', postSlug)

  router.push('/')
}

async function submit () {
  await form.value.validate()
  isLoading.value = true
  try {
    const postData = {
      name: state.value.name,
      slug: state.value.slug,
      content: state.value.content,
      thumbnail: state.value.thumbnailPath,
      meta_title: state.value.meta_title,
      meta_description: state.value.meta_description,
      created_by: user.value.email
    }
    if (mode === 'edit') {
      const { data, error } = await client
        .from('Posts')
        .update(postData)
        .eq('slug', postSlug)
        .select()
      if (error) { throw error } else { successMsg.value = 'Post updated successfully' }
    } else {
      const { data, error } = await client
        .from('Posts')
        .insert(postData)
        .select()
      if (error) { throw error } else { successMsg.value = 'Post created successfully' }
    }
  } catch (error: any) {
    // console.error(error)
    errorMsg.value = error.message || 'An error occurred while creating the post'
  }
  isLoading.value = false
};

// Markdown preview logic
const markdown = useMarkdownUtils()

const storage = useStorageUtils()

const renderedMarkdown = computed(() => {
  // Render the markdown content
  return markdown.render(state.value.content)
})

onMounted(() => {
  if (mode === 'edit') {
    if (!postSlug) {
      // If in edit mode but no postSlug is provided, redirect to home page
      router.push('/')
    }
    // Fetch data only if in edit mode and postSlug is provided
    fetchPostData()
  } else if (mode === 'remove') {
    if (!postSlug) {
      // If in remove mode but no postSlug is provided, redirect to home page
      router.push('/')
    }
    removePost()
  }
})
</script>

<template>
  <div class="shadow-2xl p-8 rounded-xl">
    <h1 class="text-3xl font-semibold mb-8">
      Post Editor
    </h1>
    <UCard class="shadow-2xl rounded-xl">
      <!-- UForm for Post Editing -->
      <UForm ref="form" class="space-y-3" :validate="validate" :state="state" @submit.prevent="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" placeholder="Name of your post. Make sure it's catchy!" />
        </UFormGroup>
        <UFormGroup label="Slug" name="slug">
          <UInput v-model="state.slug" placeholder="your-post-name-like-this-explanatory-not-catchy" />
        </UFormGroup>
        <div class="flex">
          <!-- Text Input Section (Left) -->
          <div class="w-1/2 p-2">
            <UFormGroup label="Content" name="content">
              <UTextarea
                v-model="state.content"
                resize
                placeholder="You can use markdown here... And HTML... And TailwindCSS..."
              />
            </UFormGroup>
          </div>

          <!-- Markdown Preview Section (Right) -->
          <div class="w-1/2 p-2">
            Content Preview
            <div class="bg-gray" v-html="renderedMarkdown" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium">Thumbnail

            <NuxtImg :src="storage.getThumbnailUrl(state.thumbnailPath)" class="max-h-12 m-1" /> {{ state.thumbnailPath }}
          </label>

          <input type="file" accept="image/*" @change="handleThumbnailChange">
        </div>
        <UFormGroup label="Meta title" name="meta_title">
          <UInput v-model="state.meta_title" placeholder="Meta title for browsers!" />
        </UFormGroup>
        <UFormGroup label="Meta description" name="meta_description">
          <UInput v-model="state.meta_description" placeholder="And meta description for browsers" />
        </UFormGroup>
        <UButton block type="submit" :loading="isLoading" class="font-semibold py-2 px-4 rounded-lg focus:outline-none">
          {{ mode === 'edit' ? 'Update Post' : 'Create Post' }}
        </UButton>
      </UForm>

      <div v-if="errorMsg" class="text-red-500">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="text-green-500">
        {{ successMsg }}
      </div>
    </UCard>
  </div>
</template>
