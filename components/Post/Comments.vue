<template>
  <section>
    <div class="flex flex-col md:flex-row">
      <!-- Comment Section -->
      <div class="w-full md:w-3/4 md:pr-4">
        <h2 class="my-4 text-2xl font-semibold">Comments</h2>
        <UCard
          v-for="comment in comments"
          :key="comment.id"
          class="mb-4 rounded-md"
        >
          <div class="flex flex-col justify-between md:flex-row">
            <div>
              <span class="font-semibold">{{ comment.author }}</span> commented:
            </div>
            <div>{{ dateUtils.formatDate(comment.created_at) }}</div>
          </div>
          <div class="mt-2">{{ comment.content }}</div>
          <!-- Display replies -->
          <UCard
            v-for="reply in getReplies(comment.id)"
            :key="reply.id"
            class="my-2 ml-4"
          >
            <div class="flex flex-col justify-between md:flex-row">
              <div>
                <span class="font-semibold">{{ reply.author }}</span> commented:
              </div>
              <div>{{ dateUtils.formatDate(reply.created_at) }}</div>
            </div>
            <div>{{ reply.content }}</div>
          </UCard>
          <!-- Reply form -->
          <form
            class="mt-2 rounded-md shadow-md"
            @submit.prevent="submitReply(comment.id)"
          >
            <UInput
              v-model="replyAuthor[comment.id]"
              class="w-full rounded p-2"
              type="text"
              :placeholder="'Your Email'"
            />
            <UTextarea
              v-model="replyContent[comment.id]"
              class="mt-2 w-full p-2"
              :placeholder="'Your Reply'"
            />
            <UButton
              block
              :variant="colorMode.value == 'dark' ? 'outline' : 'solid'"
              class="my-4 ml-2"
              type="submit"
            >
              Reply
            </UButton>
          </form>
        </UCard>
      </div>

      <!-- Comment Creator on the Right Side -->
      <div class="mt-4 w-full md:ml-4 md:mt-0 md:w-1/4">
        <h2 class="mb-2 text-2xl font-semibold">Create a Comment</h2>
        <form @submit.prevent="createComment">
          <UInput
            v-model="newCommentAuthor"
            class="w-full rounded p-2"
            type="text"
            placeholder="Your Email"
          />
          <UTextarea
            v-model="newCommentContent"
            class="w-full rounded p-2 pt-4"
            placeholder="Your comment..."
          />

          <UButton
            block
            :variant="colorMode.value === 'dark' ? 'outline' : 'solid'"
            class="my-4 ml-2"
            type="submit"
          >
            Add Comment
          </UButton>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  postId: {
    type: Number as PropType<number>,
    required: true,
  },
});

const colorMode = useColorMode();

const comments: Ref<any[]> = ref([]);
const replies: Ref<any[]> = ref([]);
const dateUtils = useDateUtils();
const replyContent: Record<number, string> = {};
const replyAuthor: Record<number, string> = {};
const newCommentContent = ref("");
const newCommentAuthor = ref("");
const client = useSupabaseClient();
const filter = useLangFilter(); // I hate typescript so much
const config = useConfig();
const toast = useToast();
// Function to fetch comments for the specified post_id
const fetchComments = async () => {
  const { data, error } = await client
    .from("Comments")
    .select("*")
    .eq("post_id", props.postId)
    .order("created_at", { ascending: true });

  if (error) {
    toast.add({
      title: "There was unknown error fetching posts!",
      color: "red",
    });
  } else {
    for (const comment of data || []) {
      if (comment.reply_id === null) {
        // Top-level comment, add to comments array
        comments.value.push(comment);
      } else {
        // Reply, add to replies array
        replies.value.push(comment);
      }
    }
  }
};

// Function to create a new comment
const createComment = async () => {
  if (!newCommentContent.value || !newCommentAuthor.value) {
    // Ensure both comment content and author name are provided
    toast.add({ title: "Fill in all fields first!", color: "red" });
    return;
  }
  if (checkLanguage([newCommentContent.value, newCommentAuthor.value])) {
    return;
  }
  if (config.demoErrors) {
    toast.add({ title: "You cannot do it in demo!", color: "red" });
    return;
  }
  const newComment: any = {
    content: newCommentContent.value,
    author: newCommentAuthor.value,
    post_id: props.postId,
    reply_id: null, // Top-level comment has no reply_id
  };

  const { data, error } = await client
    .from("Comments")
    .insert(newComment)
    .select();

  if (error) {
    toast.add({
      title: "Could not create a comment!",
      color: "red",
    });
  } else {
    // Add the newly created comment to the comments list
    comments.value.push(data[0]);
    toast.add({ title: "Comment added successfully!" });
  }

  // Clear the new comment form
  newCommentContent.value = "";
  newCommentAuthor.value = "";
};

// Function to check for inappropriate language
const checkLanguage = (texts: string[]): boolean => {
  for (const text of texts) {
    if (filter.LangFilter.hasMatch(text)) {
      toast.add({
        title: "Comment contains inappropriate language",
        color: "red",
      });
      return true;
    }
  }
  return false;
};

// Function to submit a reply
const submitReply = async (commentId: number) => {
  if (commentId === 0) {
    // no comment
  } else {
    // Create a reply to an existing comment
    if (!replyContent[commentId] || !replyAuthor[commentId]) {
      // Ensure both reply content and author name are provided
      return;
    }
    if (checkLanguage([replyAuthor[commentId], replyContent[commentId]])) {
      return;
    }
    if (config.demoErrors) {
      toast.add({ title: "You cannot do it in demo!", color: "red" });
      return;
    }
    const newReply: any = {
      content: replyContent[commentId],
      author: replyAuthor[commentId],
      post_id: props.postId,
      reply_id: commentId, // Set the reply_id to the comment we're replying to
    };

    const { data, error } = await client
      .from("Comments")
      .insert(newReply)
      .select();

    if (error) {
      toast.add({
        title: "Could not create a reply!",
        color: "red",
      });
    } else {
      // Find the parent comment and add the newly created reply to it
      const parentComment = comments.value.find(
        (comment) => comment.id === commentId,
      );
      if (parentComment) {
        replies.value.push(data[0]);
        toast.add({
          title: "Reply added successfully!",
        });
      }
    }
  }
};

// Function to get replies for a specific comment
const getReplies = (commentId: number): any[] => {
  return replies.value.filter((reply) => reply.reply_id === commentId);
};
fetchComments();
</script>
