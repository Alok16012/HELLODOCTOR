import { getBlogs } from "@/lib/content";
import BlogClient from "./BlogClient";

export const revalidate = 3600;

export default async function Page() {
  const blogs = await getBlogs();
  return <BlogClient blogs={blogs} />;
}
