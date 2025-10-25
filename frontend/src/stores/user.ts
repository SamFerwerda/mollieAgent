import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null as { name: string; picture: string } | null
  }),
  actions: {
    setUser(user: { name: string; picture: string }) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    getUser(){
        return this.user;
    }
  }
});