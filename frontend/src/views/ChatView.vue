<template>
  <div class="flex flex-col h-screen bg-base-100">

    <!-- Navbar -->
    <div class="navbar bg-base-200 shadow-md px-6">
      <div class="flex-1">
        <h1 class="text-xl font-bold text-primary">Mollie Agent Chat</h1>
      </div>
      <div class="flex-none">
        <div v-if="user" class="flex items-center gap-3">
          <img :src="user.picture" referrerpolicy="no-referrer" alt="Profile" class="w-8 h-8 rounded-full" />
          <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
          <a href="/api/logout" class="btn btn-sm btn-outline btn-error" title="Logout">
            Logout
          </a>
        </div>
      </div>
    </div>

    <!-- Messages that allow markdown -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-for="(message, index) in messages" :key="index" :class="[
        'max-w-xl p-4 rounded-lg shadow',
        message.role === 'user'
          ? 'ml-auto bg-primary text-white text-right'
          : 'mr-auto bg-base-200 text-left'
      ]">
        <div v-html="message.text"></div>
        <div v-if="message.isApproval && index === messages?.length - 1" class="mt-4">
          <button class="btn btn-success btn-sm mr-2" @click="() => approve(true)">Approve</button>
          <button class="btn btn-error btn-sm" @click="() => approve(false)">Decline</button>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <form @submit.prevent="sendMessage" class="bg-base-200 px-6 py-4 border-t border-base-300">
      <div class="flex max-w-2xl mx-auto w-full">
        <input v-model="input" type="text" placeholder="Type your message..."
          class="input input-bordered w-full rounded-r-none" @keydown.enter.exact.prevent="sendMessage" />
        <button type="submit" class="btn btn-primary rounded-l-none">
          Send
        </button>
      </div>
    </form>

    <!-- clear chat history -->
    <div class="p-4 border-t border-base-300 bg-base-200 text-center">
      <button class="btn btn-warning btn-sm" @click="async () => clearSession()">
        Clear Chat History
      </button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessagesStore } from '../stores/messages'
import { sendMessageToServer, clearChatSession } from '../helpers/backend'
import { useProfileStore } from '../stores/user'
import { storeToRefs } from 'pinia'

const user = ref(null)
const input = ref('')
const { addMessage, clearMessages } = useMessagesStore();
const { messages } = storeToRefs(useMessagesStore());
const { getUser } = useProfileStore();

onMounted(async () => {
  user.value = getUser();
});

const approve = async (approval) => {
  addMessage({ role: 'user', text: approval ? 'Approved' : 'Declined' });
  const response = await sendMessageToServer(approval ? 'yes' : 'no');
  addMessage(response);
};

const clearSession = async () => {
  const success = await clearChatSession();
  if (success) {
    clearMessages();
  } else {
    alert('Failed to clear chat session.');
  }
};

// Sends the message to the backend and updates messages array
const sendMessage = async () => {
  const message = input.value.trim()
  if (!message) return

  addMessage({ role: 'user', text: message });
  input.value = ''

  const response = await sendMessageToServer(message);
  addMessage(response);
};

</script>

<style scoped>
/* Scrollbar styling (optional) */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
</style>
