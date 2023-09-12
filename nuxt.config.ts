import tailwindTypography from "@tailwindcss/typography";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  tailwindcss: {
    config: {
      content: [],
      plugins: [tailwindTypography],
      theme: {
        extend: {
          colors: {
            secondary: "#00ff00",
            info: "#0000ff",
          },
        },
      },
    },
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxtjs/robots",
    //    '@nuxtjs/html-validator',
    "nuxt-icon",
    "@nuxt/image",
    "@nuxtjs/eslint-module",
  ],
  ui: {
    global: true,
    icons: ["simple-icons", "hero-icons"],
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/post/*", "/register", "/about", "/privacy"], // remove register if not in development
    },
  },
});
