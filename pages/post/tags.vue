<template>
  <div class="animate-in zoom-in duration-700">
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

const user = useSupabaseUser();
const toast = useToast();
const form = ref();
const config = useConfig();
const backend = useBackend(); // Initialize your backend

// redirect to login page if user is not authenticated
if (!user.value) {
  await navigateTo("/login");
}

const modalOpen = ref(false);

// Fetch tags
async function loadTags() {
  try {
    const tagData = await backend.getTags(); // Use your backend function to get tags
    tags.value = tagData || [];
  } catch (error) {
    // Handle error if needed
  }
}

onMounted(() => {
  loadTags();
});

// Create Tag
async function createTag() {
  if (config.demoErrors) {
    toast.add({ title: "You cannot do it in demo!", color: "red" });
    return;
  }
  if (newTagName.value) {
    try {
      await backend.insert({ table: "Tags", data: { name: newTagName.value } }); // Use your backend function to create a tag
      newTagName.value = "";
      loadTags();
      toast.add({ title: "Tag created successfully" });
    } catch (error) {
      // Handle error if needed
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
  if (config.demoErrors) {
    toast.add({ title: "You cannot do it in demo!", color: "red" });
    return;
  }
  if (editingTag.value && editedTag.value.name) {
    try {
      await backend.update({
        table: "Tags",
        value: editingTag.value.id,
        data: { name: editedTag.value.name },
      });
      editingTag.value = null; // Close the edit modal
      modalOpen.value = false;
      loadTags(); // Reload the tags list
      toast.add({ title: "Tag updated successfully" });
    } catch (error) {
      // Handle error if needed
    }
  }
}

// Delete Tag
async function deleteTag(tag: any) {
  if (config.demoErrors) {
    toast.add({ title: "You cannot do it in demo!", color: "red" });
    return;
  }
  try {
    await backend.delete("Tags", "id", tag.id); // Use your backend function to delete a tag
    loadTags();
    toast.add({ title: "Tag deleted successfully" });
  } catch (error) {
    // Handle error if needed
  }
}
</script>
