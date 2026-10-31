import { Suspense } from 'react';
import { EmployeeBrowserView } from './components/employee-browser-view';
import { EmployeeProfile } from './components/employee-profile';
import { RecentPostsPreview } from './components/recent-posts-preview';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">Assignment 3</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Employee Explorer
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Yehia's employee profile and recent posts, fetched independently
            on the server.
          </p>
        </header>

        <Suspense
          fallback={
            <section
              aria-label="Loading employee profile"
              className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm text-zinc-500">Loading employee profile…</p>
            </section>
          }
        >
          <EmployeeProfile />
        </Suspense>

        <Suspense
          fallback={
            <section
              aria-label="Loading recent posts"
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Server-fetched preview
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Loading recent posts…
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                The rest of the dashboard remains available while this preview
                loads.
              </p>
            </section>
          }
        >
          <RecentPostsPreview />
        </Suspense>

        <EmployeeBrowserView />
      </div>
    </main>
  );
}
