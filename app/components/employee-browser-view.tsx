'use client';

import { useRef, useState } from 'react';
import { ApiError, getClientPosts, type PostScenario } from '../data/client-posts';
import type { Post } from '../data/posts';

type RequestState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

const scenarioLabels: Record<PostScenario, string> = {
  success: 'Success — real API',
  slow: 'Slow — 2-second delay, then real API',
  'http-error': 'HTTP error — simulated 503',
  empty: 'Empty — simulated empty response',
};

function isPostScenario(value: string): value is PostScenario {
  return Object.hasOwn(scenarioLabels, value);
}

export function EmployeeBrowserView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [scenario, setScenario] = useState<PostScenario>('success');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const loadPosts = async () => {
    if (requestInProgress.current) {
      return;
    }
    requestInProgress.current = true;
    setRequestState('loading');
    setRequestState('loading');
    setErrorMessage(null);
    setPosts([]);

    try {
      const result = await getClientPosts(scenario);
      setPosts(result);
      setRequestState(result.length === 0 ? 'empty' : 'success');
    } catch (error) {
      setPosts([]);
      setErrorMessage(
        error instanceof ApiError
          ? `The posts service returned HTTP ${error.status}. This is an HTTP response, not a network failure.`
          : 'We couldn’t reach the posts service. Check your connection and try again.',
      );
      setRequestState('error');
    } finally {
      requestInProgress.current = false;
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Browser fetching
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Explore all posts
        </h2>
      </div>

      <div className="mb-4 max-w-xl">
        <label
          htmlFor="post-scenario"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          Demo scenario
        </label>
        <select
          id="post-scenario"
          value={scenario}
          onChange={(event) => {
            if (isPostScenario(event.target.value)) {
              setScenario(event.target.value);
            }
          }}
          disabled={requestState === 'loading'}
          className="min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {(Object.keys(scenarioLabels) as PostScenario[]).map((value) => (
            <option key={value} value={value}>
              {scenarioLabels[value]}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          HTTP error and Empty create local demo responses; JSONPlaceholder does
          not return those simulated results. Slow waits two seconds before
          requesting the real API.
        </p>
      </div>

      {requestState === 'idle' ? (
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
          Load Yehia&apos;s posts when you&apos;re ready. No posts are requested
          until you choose to load them.
        </p>
      ) : null}

      {requestState === 'loading' ? (
        <div
          role="status"
          className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-200" />
          <span>Loading posts…</span>
        </div>
      ) : null}

      {requestState === 'empty' ? (
        <p
          role="status"
          className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          No posts found.
        </p>
      ) : null}

      {requestState === 'error' ? (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-200"
        >
          {errorMessage}
        </p>
      ) : null}

      {requestState === 'success' ? (
        <ol className="mb-4 space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {post.body}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      <button
        type="button"
        onClick={() => void loadPosts()}
        disabled={requestState === 'loading'}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {requestState === 'loading'
          ? 'Loading posts…'
          : requestState === 'error'
            ? 'Retry'
            : 'Load posts'}
      </button>
    </section>
  );
}
