import tailwindTypography from "@tailwindcss/typography";
import tailwindAnimate from "tailwindcss-animate";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    headNext: true,
  },
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
    "@nuxtjs/partytown",
    "nuxt-icon",
    "@nuxt/image",
    "@nuxt/ui",
    "nuxt-speedkit",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxtjs/robots",
    //    '@nuxtjs/html-validator',
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
