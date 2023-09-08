<script setup lang="ts">
import type { FormError } from '@nuxthq/ui/dist/runtime/types'

import type { Database } from '~/utils/supabase'

const router = useRouter()

const mode: string = router.currentRoute.value.query.mode as string || 'create'
const postSlug: string = router.currentRoute.value.query.slug as string || ''

const state = ref({
  name: '',
  slug: '',
  content: '',
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
    state.value.name = postData.name
    state.value.slug = postData.slug
    state.value.content = postData.content
    state.value.meta_title = postData.meta_title
    state.value.meta_description = postData.meta_description

    // You may need additional logic to handle thumbnail data
  } catch (error) {
    console.error(error)
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

// redirect to login page if user is not authenticated
if (!user.value) {
  router.push('/login')
}

const client = useSupabaseClient<Database>()

function handleThumbnailChange (event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    state.value.thumbnailFile = target.files[0]
  }
}

async function submit () {
  await form.value.validate()

  try {
    let thumbnailUrl = 'default'

    if (state.value.thumbnailFile) {
      // Upload the thumbnail to Supabase storage
      const { data: thumbnailData, error: thumbnailError } = await client.storage
        .from('thumbnails')
        .upload(state.value.thumbnailFile.name, state.value.thumbnailFile)

      if (thumbnailError) {
        throw thumbnailError
      }
      console.log(thumbnailData)
      thumbnailUrl = thumbnailData?.Key
    }
    const postData = {
      name: state.value.name,
      slug: state.value.slug,
      content: state.value.content,
      thumbnail: thumbnailUrl,
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
      console.log(data)
      console.log(error)
      if (error) {
        throw error
      }
      successMsg.value = 'Post updated successfully'
    } else {
      const { data, error } = await client
        .from('Posts')
        .insert(postData)
        .select()

      if (error) {
        throw error
      }
      successMsg.value = 'Post created successfully'
    }
  } catch (error) {
    console.error(error)
    errorMsg.value = error.message || 'An error occurred while creating the post'
  }
};

// Markdown preview logic
const markdown = useMarkdownUtils()

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
            <input type="file" accept="image/*" @change="handleThumbnailChange">
          </label>
        </div>
        <UFormGroup label="Meta title" name="meta_title">
          <UInput v-model="state.meta_title" placeholder="Meta title for browsers!" />
        </UFormGroup>
        <UFormGroup label="Meta description" name="meta_description">
          <UInput v-model="state.meta_description" placeholder="And meta description for browsers" />
        </UFormGroup>
        <UButton block type="submit" class="font-semibold py-2 px-4 rounded-lg focus:outline-none">
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
