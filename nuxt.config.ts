import tailwindTypography from "@tailwindcss/typography";
import tailwindAnimate from "tailwindcss-animate";
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
      plugins: [tailwindTypography, tailwindAnimate],
      theme: {
        extend: {
          screens: {
            xs: "350px",
          },
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
