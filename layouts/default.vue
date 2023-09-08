<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 text-white p-4 space-x-4 m-4 rounded-xl">
      <div class="container mx-auto flex justify-between">
        <!-- Left side Header -->
        <div class="flex items-center ml-4">
          <h1 class="text-2xl font-semibold">
            <nuxt-link to="/">
              PiiBlog
            </nuxt-link>
          </h1>
          <nav>
            <ul class="flex">
              <li>
                <nuxt-link to="/about" class="hover:underline transition duration-300 ml-4">
                  about
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/privacy" class="hover:underline transition duration-300 ml-4">
                  privacy
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Right side Header -->
        <div class="flex items-center ml-4">
          <UButton v-if="user" class="py-2 px-4 mr-4" @click="router.push('/profile')">
            <Icon name="heroicons:user-solid" /> Profile
          </UButton>

          <UButton
            aria-label="Theme"
            class="py-2 px-4 mr-4"
            @click="isDark = !isDark"
          >
            <Icon :name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'" />
          </UButton>
          <div v-if="user">
            <UButton color="red" class="py-2 px-4 mr-4" @click="logout">
              <Icon name="heroicons:lock-closed-solid" /> Logout
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
          <a href="https://x.com/" target="_blank" aria-label="Our X profile" rel="noopener noreferrer">
            <Icon name="simple-icons:x" />
          </a>
          <a href="https://linkedin.com/in/mikolaj-szmalc" aria-label="Our linkedin profile" target="_blank" rel="noopener noreferrer">
            <Icon name="simple-icons:linkedin" />
          </a>
          <a href="https://facebook.com/" target="_blank" aria-label="Our facebook profile" rel="noopener noreferrer">
            <Icon name="simple-icons:facebook" />
          </a>
          <a href="/rss.xml" target="_blank" aria-label="Our RSS feed" rel="noopener noreferrer">
            <Icon name="simple-icons:rss" />
          </a>
        </div>

        <!-- Copyright -->
        <p class="text-gray-200">
          &copy; 2023 PiiNut
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const colorMode = useColorMode()

const router = useRouter()

const user = useSupabaseUser()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const isAuthenticated = ref(false) // Replace with your authentication logic

const logout = () => {
  isAuthenticated.value = false
}

useSeoMeta({
  title: 'PiiBlog',
  ogTitle: 'PiiBlog',
  description: 'PiiBlog. Created for demonstration purposes.',
  ogDescription: 'PiiBlog. Created for demonstration purposes.',
  ogImage: 'https://example.com/image.png'
})
</script>

<style>
label {
  color: white;
  font-weight: bold;
}
</style>
