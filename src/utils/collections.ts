import { getCollection } from "astro:content";

export async function getPublishedBlogPosts() {
  const filterDrafts = import.meta.env.PROD;
  return await getCollection("blog", ({ data }) => filterDrafts ? !data.draft : true);
}
