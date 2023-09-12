<template>
  <div>
    <h1 class="mb-8 text-3xl font-semibold">Manage Tags</h1>

    <!-- Create Tag -->
    <UForm :state="form" class="space-y-3" @submit.prevent="createTag">
      <UFormGroup label="Tag Name" name="name">
        <UInput v-model="newTagName" placeholder="New Tag Name" />
      </UFormGroup>
      <UButton type="submit"> Create Tag </UButton>
    </UForm>

    <!-- List of Tags -->
    <ul class="mt-4 space-y-2">
      <li
        v-for="tag in tags"
        :key="tag.id"
        class="flex items-center justify-between rounded-lg p-4 shadow-md"
      >
        <span class="text-lg">{{ tag.name }}</span>
        <div class="space-x-2">
          <UButton
            class="rounded-lg px-4 py-2 text-white focus:outline-none"
            @click="editTag(tag)"
          >
            Edit
          </UButton>
          <UButton
            color="red"
            class="rounded-lg px-4 py-2 focus:outline-none"
            @click="deleteTag(tag)"
          >
            Delete
          </UButton>
        </div>
      </li>
    </ul>

    <!-- Edit Tag Modal -->
    <UModal v-model="modalOpen">
      <h2 class="m-4 text-xl font-semibold">Edit Tag</h2>
      <UForm :state="editedTag" class="m-4" @submit.prevent="updateTag">
        <UFormGroup label="Tag Name" name="name">
          <UInput v-model="editedTag.name" placeholder="Edit Tag Name" />
        </UFormGroup>
        <UButton block type="submit" class="mt-4"> Update </UButton>
      </UForm>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxthq/ui/dist/runtime/types";

const newTagName: Ref<string> = ref("");
const tags: Ref<any[]> = ref([]);

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const form = ref();

// redirect to login page if user is not authenticated
if (!user.value) {
  await navigateTo("/login");
}

const modalOpen = ref(false);

// Fetch tags
async function loadTags() {
  const { data, error } = await client.from("Tags").select("*");
  if (error) {
    // console.error('Error fetching tags:', error.message)
  } else {
    tags.value = data;
    // console.log(tags.value)
  }
}

onMounted(() => {
  loadTags();
});

// Create Tag
async function createTag() {
  if (newTagName.value) {
    const { data, error } = await client
      .from("Tags")
      .upsert(
        { name: newTagName.value }, // Provide an array of objects to upsert
      )
      .select();
    if (error) {
      // console.error('Error creating tag:', error.message)
    } else {
      newTagName.value = "";
      loadTags();
    }
  }
}

// Handle tag editing
const editingTag: any = ref(null); // Store the tag being edited
const editedTag: Ref<any> = ref({}); // Store the edited tag

function editTag(tag: any) {
  editingTag.value = tag;
  editedTag.value = { ...tag };
  modalOpen.value = true;
}

async function updateTag() {
  if (editingTag.value && editedTag.value.name) {
    const { error } = await client
      .from("Tags")
      .update({ name: editedTag.value.name })
      .eq("id", editingTag.value.id);

    if (error) {
      // console.error('Error updating tag:', error.message)
    } else {
      editingTag.value = null; // Close the edit modal
      loadTags(); // Reload the tags list
    }
  }
}

// Delete Tag
async function deleteTag(tag: any) {
  const { error } = await client.from("Tags").delete().eq("id", tag.id);
  if (error) {
    // console.error('Error deleting tag:', error.message)
  } else {
    loadTags();
  }
}
</script>
