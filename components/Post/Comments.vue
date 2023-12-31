<!-- eslint-disable vue/multi-word-component-names -->
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
const comments = ref<any[]>([]);
const replies = ref<any[]>([]);
const dateUtils = useDateUtils();
const replyContent: Record<number, string> = {};
const replyAuthor: Record<number, string> = {};
const newCommentContent = ref("");
const newCommentAuthor = ref("");
const backend = useBackend();
const langFilter = useLangFilter(); // I hate typescript so much
const config = useConfig();
const toast = useToast();

const fetchComments = async () => {
  try {
    const filters = [{ field: "post_id", value: props.postId, operator: "eq" }];
    const data = await backend.select({ table: "Comments", filters });
    for (const comment of data || []) {
      if (comment.reply_id === null) {
        comments.value.push(comment);
      } else {
        replies.value.push(comment);
      }
    }
  } catch (error) {
    handleFetchCommentsError(error);
  }
};

const createComment = async () => {
  if (!newCommentContent.value || !newCommentAuthor.value) {
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
    reply_id: null,
  };
  try {
    const data = await backend.insert({ table: "Comments", data: newComment });
    comments.value.push(data);
    handleCommentCreated();
  } catch (error) {
    handleCreateCommentError(error);
  }
};

const checkLanguage = (texts: string[]): boolean => {
  for (const text of texts) {
    if (langFilter.LangFilter.hasMatch(text)) {
      toast.add({
        title: "Comment contains inappropriate language",
        color: "red",
      });
      return true;
    }
  }
  return false;
};

const submitReply = async (commentId: number) => {
  if (!replyContent[commentId] || !replyAuthor[commentId]) {
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
    reply_id: commentId,
  };
  try {
    const data = await backend.insert({ table: "Comments", data: newReply });
    const parentComment = comments.value.find(
      (comment) => comment.id === commentId,
    );
    if (parentComment) {
      replies.value.push(data);
      handleReplyCreated();
    }
  } catch (error) {
    handleCreateReplyError(error);
  }
};

const getReplies = (commentId: number): any[] => {
  return replies.value.filter((reply) => reply.reply_id === commentId);
};

const handleFetchCommentsError = (_e: any) => {
  toast.add({
    title: "There was an error fetching comments!",
    color: "red",
  });
};

const handleCommentCreated = () => {
  toast.add({
    title: "Comment added successfully!",
  });
  newCommentContent.value = "";
  newCommentAuthor.value = "";
};

const handleCreateCommentError = (_e: any) => {
  toast.add({
    title: "Could not create a comment!",
    color: "red",
  });
};

const handleReplyCreated = () => {
  toast.add({
    title: "Reply added successfully!",
  });
};

const handleCreateReplyError = (_e: any) => {
  toast.add({
    title: "Could not create a reply!",
    color: "red",
  });
};

fetchComments();
</script>
