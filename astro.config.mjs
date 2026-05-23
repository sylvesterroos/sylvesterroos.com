// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://sylvesterroos.com",
  integrations: [mdx(), sitemap(), icon()],
  server: { host: true },

  vite: {
    server: {
      allowedHosts: ["odysseus.allosaurus-snapper.ts.net"],
    },
  },
});
