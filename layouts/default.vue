<template>
    <div class="  min-h-screen flex flex-col">
      <!-- Header -->
      <header class="p-4">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-semibold">
            <nuxt-link to="/">PiiBlog</nuxt-link>
          </h1>
          <nav>
            <ul class="flex space-x-4">
              <li>
                <nuxt-link
                  to="/about"
                  class="hover:underline transition duration-300"
                >
                  About
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="/profile"
                  class="hover:underline transition duration-300"
                >
                  Profile
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  
      <!-- Content -->
      <main class="container mx-auto flex-1 p-4">
        <slot />
      </main>
  
      <!-- Footer -->
      <footer class="bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
          <!-- Social Buttons -->
          <div class="flex space-x-4">
            <a
              href="https://twitter.com/piiblog"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/favicon.ico"
                alt="Twitter"
                class="w-6 h-6  hover:text-blue-400 transition duration-300"
              />
            </a>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
              <img
                src="/favicon.ico"
                alt="RSS"
                class="w-6 h-6  hover:text-orange-400 transition duration-300"
              />
            </a>
          </div>
  
          <!-- Copyright -->
          <p class="text-gray-500">&copy; 2023 PiiNut</p>
        </div>
      </footer>
    </div>
  </template>
  