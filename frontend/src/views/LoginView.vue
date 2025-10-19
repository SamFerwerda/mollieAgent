<template>
    <div
        class="min-h-screen bg-gradient-to-br from-purple-100  to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">

        <div
            class="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-2xl rounded-3xl p-10 md:p-16 max-w-2xl w-full border border-white/40 dark:border-gray-700 transition-all duration-300">

            <div class="text-center">
                <!-- Header -->
                <h1 class="pb-8 text-5xl text-gray-800 dark:text-white drop-shadow">
                    Welcome to MollieGPT
                </h1>

                <!-- Description -->
                <p class="pb-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    MollieGPT is your AI-powered assistant designed to help you manage your Mollie account without
                    having to understand the technical aspects. It will
                    allow you to describe the changes you want to make to your customers and it will
                    do it for you!
                </p>
                <div class="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" checked="checked" />
                    <div class="collapse-title font-semibold">How does it work?</div>
                    <div class="collapse-content text-sm">
                        MollieGPT is build using the Open AI Agents SDK which means your questions are analyzed by an LLM (Large Language Model) 
                        to understand your intent. After that, it will generate an answer or perform an action on your behalf. For the Agents to 
                        work properly with mollie, we will need to connect your mollie account first. This can be done using the API key!
                    </div>
                </div>
                <div class="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div class="collapse-title font-semibold">Can an agent change something without consent?</div>
                    <div class="collapse-content text-sm">
                        The agents are build in such a way that they will require your <b>approval</b> before they will make any changes to your mollie account. This way
                        you will not suddenly find unexpected changes in your account. Example: You ask the agent to update a customers subscription. The agent will show you the changes it wants to make
                        and if you approve it, it will go ahead and make the change.
                    </div>
                </div>
                <div class="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div class="collapse-title font-semibold">Can anyone use it?</div>
                    <div class="collapse-content text-sm">Right now the service is invite-only and not publicly available. If the service proves to be valuable, I will consider expanding access in the future.</div>
                </div>
                <!-- Google Login Button -->
                <div class="pt-4">
                    <a href="/api/google/login"
                        class="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-full shadow-md hover:shadow-xl hover:bg-gray-50 transition-all font-semibold text-base">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
                        Sign in with Google
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>
