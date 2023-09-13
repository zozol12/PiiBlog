<template>
  <div class="flex min-h-screen flex-col">
    <header
      class="animate-in zoom-in mx-4 mt-4 space-x-4 rounded-xl bg-gray-800 p-4 pb-0 text-white transition duration-700 md:p-4"
    >
      <div
        class="container mx-auto flex flex-col items-center justify-between md:flex-row"
      >
        <!-- Mobile Menu -->
        <div class="flex w-full items-center justify-between md:hidden">
          <UButton class="text-xl" aria-label="Theme" @click="isDark = !isDark">
            <Icon
              :name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'"
            />
          </UButton>
          <h1 class="text-2xl font-semibold">
            <nuxt-link to="/"> {{ config.blogName }} </nuxt-link>
          </h1>
          <UButton
            class="text-2xl text-white"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Icon name="heroicons:bars-3-solid" />
          </UButton>
        </div>

        <!-- Desktop Left side Header (Logo and Navigation) -->
        <div class="hidden items-center md:flex">
          <h1 class="text-2xl font-semibold duration-1000 hover:scale-105">
            <nuxt-link
              to="/"
              @mouseover="logoTextHover = true"
              @mouseout="logoTextHover = false"
            >
              <span
                class="transition duration-1000"
                :class="{ 'text-primary': logoTextHover }"
                >{{ config.blogName.substring(0, 3) }}</span
              >{{ config.blogName.substring(3) }}
            </nuxt-link>
          </h1>
          <nav class="md:ml-4">
            <ul class="flex">
              <li class="transition duration-1000 hover:scale-105">
                <nuxt-link to="/" class="ml-4 hover:animate-pulse">
                  home
                </nuxt-link>
              </li>
              <li class="transition duration-1000 hover:scale-105">
                <nuxt-link to="/about" class="ml-4 hover:animate-pulse">
                  about
                </nuxt-link>
              </li>
              <li class="transition duration-1000 hover:scale-105">
                <nuxt-link to="/privacy" class="ml-4 hover:animate-pulse">
                  privacy
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Mobile & Desktop Search Input (Always visible) -->
        <SearchInput class="transition duration-500" />

        <!-- Desktop Right side Header (Buttons and Theme Toggle) -->
        <div class="mt-4 flex items-center md:mt-0">
          <UButton
            v-if="user"
            class="mr-4 px-4 py-2 transition duration-500 max-md:hidden"
            variant="outline"
            @click="profile"
          >
            <Icon name="heroicons:user-solid" class="transition duration-500" />
            Profile
          </UButton>

          <UButton
            aria-label="Theme"
            class="mr-4 rounded-full px-4 py-2 transition duration-500 max-md:hidden"
            variant="outline"
            @click="isDark = !isDark"
          >
            <Icon
              class="transition duration-500"
              :name="isDark ? 'heroicons:moon-solid' : 'heroicons:sun-solid'"
            />
          </UButton>
        </div>
      </div>

      <!-- Mobile Menu (hidden by default) -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <nav>
          <ul class="mt-4">
            <li>
              <nuxt-link
                class="block px-4 py-2 hover:bg-gray-600"
                to="/"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                home
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                class="block px-4 py-2 hover:bg-gray-600"
                to="/about"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                about
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                class="block px-4 py-2 hover:bg-gray-600"
                to="/privacy"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                privacy
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                v-if="user"
                class="block px-4 py-2 hover:bg-gray-600"
                to="/profile"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                profile
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto flex-1 p-4 transition duration-500">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="animate-in fade-in bg-gray-800 p-4 duration-700">
      <div class="container mx-auto flex items-center justify-between">
        <!-- Social UButtons -->
        <div class="flex space-x-4 text-white">
          <a
            href="https://x.com/"
            target="_blank"
            aria-label="Our X profile"
            rel="noopener noreferrer"
          >
            <Icon name="simple-icons:x" />
          </a>
          <a
            href="https://linkedin.com/in/mikolaj-szmalc"
            aria-label="Our linkedin profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="simple-icons:linkedin" />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            aria-label="Our facebook profile"
            rel="noopener noreferrer"
          >
            <Icon name="simple-icons:facebook" />
          </a>
          <a
            href="/rss.xml"
            target="_blank"
            aria-label="Our RSS feed"
            rel="noopener noreferrer"
          >
            <Icon name="simple-icons:rss" />
          </a>
        </div>

        <!-- Copyright -->
        <p v-if="config.copyRightNotice" class="text-gray-200">
          &copy; 2023 PiiNut
        </p>
      </div>
    </footer>
      <UNotifications />
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});
const config = useConfig();
const colorMode = useColorMode();

const user = useSupabaseUser();
const storage = useStorageUtils();

const logoTextHover = ref(false);

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
const mobileMenuOpen = ref(false);

async function profile() {
  try {
    await navigateTo("/profile");
  } catch (error) {
    // console.error(error)
  }
}

const route = useRoute();

watch(
  () => route.fullPath,
  (newRoute) => {
    // format title to look a little good :>
    let title = "";
    if (newRoute !== "/") {
      title = newRoute
        .replaceAll("/", " | ")
        .replaceAll("?", " ")
        .replaceAll("=", ": ");
    }

    useSeoMeta({
      title: `${config.blogName} ${title}`,
      ogTitle: `${config.blogName} ${title}`,
      description: config.blogDesc,
      ogDescription: config.blogDesc,
      ogImage: storage.getThumbnailUrl(),
    });
  },
  { immediate: true },
);
</script>

<style></style>
