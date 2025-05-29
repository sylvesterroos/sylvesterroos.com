import { getCollection } from "astro:content";

export async function getPublishedBlogPosts() {
  return await getCollection("blog", ({ data }) => !data.draft);
}
