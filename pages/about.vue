<template>
  <div class="py-8">
    <UCard class="animate-in zoom-in duration-700 mx-auto max-w-2xl rounded-lg p-4 shadow-lg">
      <header class="mb-6 text-center">
        <h1 class="text-3xl font-semibold">About Me</h1>
      </header>
      <main>
        <p>Hello, I'm Mikołaj Szmalc, and welcome to my demonstration blog!</p>
        <br />
        <p>
          This blog serves as a showcase of my work and skills in web
          development. It's designed to be lightning-fast, utilizing modern
          technologies to deliver a smooth and responsive experience.
        </p>
        <br />
        <p>I've built this blog using a stack that includes:</p>
        <ul class="list-disc pl-8">
          <li>
            <a
              href="https://nuxt.com/"
              class="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              >Nuxt 3</a
            >
            for building fast and efficient web applications.
          </li>
          <li>
            <a
              href="https://tailwindcss.com/"
              class="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              >Tailwind CSS</a
            >
            for a sleek and responsive design.
          </li>
          <li>
            <a
              href="https://ui.nuxtlabs.com/"
              class="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              >NuxtLabs UI</a
            >
            for UI components to enhance the user experience.
          </li>
          <li>
            <a
              href="https://supabase.io/"
              class="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              >Supabase</a
            >
            w/<a
              href="https://www.postgresql.org/"
              class="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              >Postgres</a
            >
            for data storage and management.
          </li>
        </ul>
        <NuxtImg src="/performance.png" class="mt-4" />
      </main>
      <footer class="mt-6 text-right text-sm">
        <p>&copy; 2023 Mikołaj Szmalc</p>
      </footer>
    </UCard>
  </div>
</template>
<script setup></script>
