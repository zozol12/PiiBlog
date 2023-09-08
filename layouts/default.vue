<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 text-white p-4 space-x-4 m-4 rounded-xl">
      <div class="container mx-auto flex justify-between">

        <!-- Left side Header -->
        <div class="flex items-center ml-4">
          <h1 class="text-2xl font-semibold">
            <nuxt-link to="/">PiiBlog</nuxt-link>
          </h1>
          <nav>
            <ul>
              <li>
                <nuxt-link to="/about" class="hover:underline transition duration-300 ml-4">About Us</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        
        <!-- Right side Header -->
        <div class="flex items-center ml-4">
          <nuxt-link v-if="user" to="/profile" class="hover:underline transition duration-300 mr-4">
            Profile
          </nuxt-link>

            <UButton
              :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />

          <div v-if="user">
            <UButton @click="logout" color="red" class="py-2 px-4 ml-4" >
              <label>Logout</label>
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto flex-1 p-4">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Social UButtons -->
        <div class="flex space-x-4">
          <a href="https://twitter.com/piiblog" target="_blank" rel="noopener noreferrer">
            <img src="/favicon.ico" alt="Twitter" class="w-6 h-6 hover:text-blue-400 transition duration-300" />
          </a>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            <img src="/favicon.ico" alt="RSS" class="w-6 h-6 hover:text-orange-400 transition duration-300" />
          </a>
        </div>

        <!-- Copyright -->
        <p class="text-gray-200">&copy; 2023 PiiNut</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const user = useSupabaseUser();

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const isAuthenticated = ref(false); // Replace with your authentication logic

const logout = () => {
  isAuthenticated.value = false;
};

useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});
</script>

<style>
label {
  color: white;
  font-weight: bold;
}
</style>