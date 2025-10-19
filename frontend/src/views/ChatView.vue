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
          <a
            href="/api/logout"
            class="btn btn-sm btn-outline btn-error"
            title="Logout"
            >
            Logout
          </a>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'max-w-xl p-4 rounded-lg shadow',
          message.role === 'user'
            ? 'ml-auto bg-primary text-white text-right'
            : 'mr-auto bg-base-200 text-left'
        ]"
      >
        {{ message.text }}
      </div>
    </div>

    <!-- Chat Input -->
    <form
      @submit.prevent="sendMessage"
      class="bg-base-200 px-6 py-4 border-t border-base-300"
    >
      <div class="flex max-w-2xl mx-auto w-full">
        <input
          v-model="input"
          type="text"
          placeholder="Type your message..."
          class="input input-bordered w-full rounded-r-none"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <button
          type="submit"
          class="btn btn-primary rounded-l-none"
        >
          Send
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const input = ref('')
const messages = ref([])

onMounted(async () => {
    const userProfile = sessionStorage.getItem('userProfile');
    if (userProfile) {
        user.value = JSON.parse(userProfile);
    }
})

// Sends the message to the backend and updates messages array
const sendMessage = async () => {
  const text = input.value.trim()
  if (!text) return

  // Add user message
  messages.value.push({ role: 'user', text })
  input.value = ''

  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ text })
    })

    if (!res.ok) throw new Error('Message failed')

    const data = await res.json()

    messages.value.push({ role: 'bot', text: data.text })
  } catch (err) {
    console.error('Failed to send message:', err)
    messages.value.push({
      role: 'bot',
      text: '❌ Sorry, something went wrong.'
    })
  }
}
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
