export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-700 dark:border-zinc-800 dark:border-t-zinc-200" />
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Loading employees...</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Fetching the latest employee data from the server.</p>
      </div>
    </main>
  );
}
