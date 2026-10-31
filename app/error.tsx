'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/80 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600 dark:text-red-300">Error</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Something went wrong</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          The employee directory could not be loaded.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
