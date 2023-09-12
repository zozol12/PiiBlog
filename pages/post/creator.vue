<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import type { FormError } from "@nuxthq/ui/dist/runtime/types";

const route = useRoute();
const supabase = useSupabase();

const mode: string = (route.query.mode as string) || "create";
const postSlug: string = (route.query.slug as string) || "";

const state = ref<any>({
  name: "",
  slug: "",
  content: "",
  tags: [],
  thumbnail: "default",
  thumbnailFile: null,
  meta_title: "",
  meta_description: "",
});

async function fetchPostData() {
  try {
    const { data: postData, error: postError } = await client
      .from("Posts")
      .select("*")
      .eq("slug", postSlug)
      .single();

    if (postError) {
      throw postError;
    }

    // Populate form fields with fetched data
    if (postData) {
      state.value.name = postData.name;
      state.value.slug = postData.slug;
      state.value.thumbnail = postData.thumbnail;
      state.value.tags = postData.tags;
      state.value.content = postData.content;
      state.value.meta_title = postData.meta_title;
      state.value.meta_description = postData.meta_description;
    }
  } catch (_e: any) {
    const error: Error = _e;
    // console.error(error)
    errorMsg.value =
      error.message || "An error occurred while fetching post data";
  }
}
const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) {
    errors.push({ path: "name", message: "Required" });
  }
  if (!state.slug) {
    errors.push({ path: "slug", message: "Required" });
  }
  if (!state.content) {
    errors.push({ path: "content", message: "Required" });
  }
  return errors;
};

const form = ref();

const user = useSupabaseUser();

const errorMsg: Ref<string | undefined> = ref(undefined);
const successMsg: Ref<string | undefined> = ref(undefined);
const isLoading = ref(false);

// redirect to login page if user is not authenticated
if (!user.value) {
  await navigateTo("/login");
}

const client = useSupabaseClient<Database>();

async function handleThumbnailChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    state.value.thumbnailFile = target.files[0];
    state.value.thumbnail = state.value.thumbnailFile.name;
    // Upload the thumbnail to Supabase storage
    const { data: thumbnailData, error: thumbnailError } = await client.storage
      .from("thumbnails")
      .upload(state.value.thumbnail, state.value.thumbnailFile);

    if (thumbnailError) {
      errorMsg.value =
        "Resource with the same name exists already! Using the one that was already uploaded...";
    }
  }
}

async function removePost() {
  await client.from("Posts").delete().eq("slug", postSlug);

  await navigateTo("/");
}
type Tags = Database["public"]["Tables"]["Tags"][];
const tags: Tags = await supabase.getTags();

async function submit() {
  await form.value.validate();
  isLoading.value = true;
  const tagsList = tags.map((tag) => tag.name);
  try {
    const postData = {
      name: state.value.name,
      slug: state.value.slug,
      content: state.value.content,
      tags: tagsList,
      thumbnail: state.value.thumbnail,
      meta_title: state.value.meta_title,
      meta_description: state.value.meta_description,
      created_by: user.value.email,
    };
    if (mode === "edit") {
      const { data, error } = await client
        .from("Posts")
        .update(postData)
        .eq("slug", postSlug)
        .select();
      if (error) {
        throw error;
      } else {
        successMsg.value = "Post updated successfully";
      }
    } else {
      const { data, error } = await client
        .from("Posts")
        .insert(postData)
        .select();
      if (error) {
        throw error;
      } else {
        successMsg.value = "Post created successfully";
      }
    }
  } catch (_e: any) {
    const error: Error = _e;
    // console.error(error)
    errorMsg.value =
      error.message || "An error occurred while creating the post";
  }
  isLoading.value = false;
}

// Markdown preview logic
const markdown = useMarkdownUtils();

const storage = useStorageUtils();

const renderedMarkdown = computed(() => {
  // Render the markdown content
  return markdown.render(state.value.content);
});

onMounted(async () => {
  if (mode === "edit") {
    if (!postSlug) {
      // If in edit mode but no postSlug is provided, redirect to home page
      await navigateTo("/");
    }
    // Fetch data only if in edit mode and postSlug is provided
    fetchPostData();
  } else if (mode === "remove") {
    if (!postSlug) {
      // If in remove mode but no postSlug is provided, redirect to home page
      await navigateTo("/");
    }
    removePost();
  }
});
</script>

<template>
  <div class="animate-in zoom-in rounded-xl p-8 shadow-2xl duration-700">
    <h1 class="mb-8 text-3xl font-semibold">Post Editor</h1>
    <UCard class="rounded-xl shadow-2xl">
      <!-- UForm for Post Editing -->
      <UForm
        ref="form"
        class="space-y-3"
        :validate="validate"
        :state="state"
        @submit.prevent="submit"
      >
        <UFormGroup label="Name" name="name">
          <UInput
            v-model="state.name"
            placeholder="Name of your post. Make sure it's catchy!"
          />
        </UFormGroup>
        <UFormGroup label="Slug" name="slug">
          <UInput
            v-model="state.slug"
            placeholder="your-post-name-like-this-explanatory-not-catchy"
          />
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
        <USelectMenu
          v-model="state.tags"
          multiple
          searchable
          placeholder="Select tags"
          option-attribute="name"
          :options="tags"
        />
        <div>
          <label class="block text-sm font-medium"
            >Thumbnail

            <NuxtImg
              :src="storage.getThumbnailUrl(state.thumbnail)"
              class="m-1 max-h-12"
            />
            {{ state.thumbnail }}
          </label>

          <input type="file" accept="image/*" @change="handleThumbnailChange" />
        </div>
        <UFormGroup label="Meta title" name="meta_title">
          <UInput
            v-model="state.meta_title"
            placeholder="Meta title for browsers!"
          />
        </UFormGroup>
        <UFormGroup label="Meta description" name="meta_description">
          <UInput
            v-model="state.meta_description"
            placeholder="And meta description for browsers"
          />
        </UFormGroup>
        <UButton
          block
          type="submit"
          :loading="isLoading"
          class="rounded-lg px-4 py-2 font-semibold focus:outline-none"
        >
          {{ mode === "edit" ? "Update Post" : "Create Post" }}
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
