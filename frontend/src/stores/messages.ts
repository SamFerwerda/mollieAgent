import { defineStore } from 'pinia'

type Message = { role: 'user' | 'bot'; text: string; isApproval?: boolean };

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [] as Array<Message>
  }),
  actions: {
    addMessage(message: Message) {
      this.messages.push(message)
    },
    getAllMessages(){
        return this.messages;
    },
    clearMessages() {
      this.messages = [];
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['messages'],
    key: 'messages_store'
  }
})
