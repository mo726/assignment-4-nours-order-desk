import { getRecentPosts, type Post } from "../data/posts";

export async function RecentPostsPreview() {
  let posts: Post[];

  try {
    posts = await getRecentPosts();
  } catch {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <h2 className="font-semibold">Recent posts unavailable</h2>
        <p className="mt-1 text-sm">
          We couldn’t load the post preview. The rest of the dashboard is still
          available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Server-fetched preview
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Recent posts
        </h2>
      </div>
      <ol className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {post.title}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        Includes an intentional two-second delay for the Suspense loading
        demonstration.
      </p>
    </section>
  );
}
