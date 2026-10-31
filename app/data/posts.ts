import { connection } from "next/server";

export type Post = {
  id: number;
  title: string;
  body: string;
};

export async function getRecentPosts(): Promise<Post[]> {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?userId=1",
  );

  if (!response.ok) {
    throw new Error(`Unable to load recent posts (HTTP ${response.status}).`);
  }

  const posts: Post[] = await response.json();
  return posts.slice(0, 3);
}
