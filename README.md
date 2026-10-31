# Employee Explorer — Assignment 3

**Student:** Mohamad Sayed Ahmad
**Framework:** Next.js 16.4.2 (App Router)

Employee Explorer is a one-page dashboard demonstrating server-side data fetching, focused Suspense streaming, client-side requests, and API failure handling.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Dashboard

- The server-rendered profile fetches user/employee ID 1 from `https://jsonplaceholder.typicode.com/users/1` and shows the name, email, and company.
- The server-rendered recent-post preview fetches posts for ID 1 and displays up to three titles inside its own Suspense boundary.
- The preview includes an intentional two-second request-time delay to demonstrate the Suspense fallback. This is a learning simulation, not API latency.
- **Explore all posts** does not make a browser request until **Load posts** is clicked. The **Demo scenario** selector applies to the next load or retry:
  - **Success:** requests real posts from JSONPlaceholder.
  - **Slow:** waits two seconds, then requests real posts.
  - **HTTP error:** creates a local simulated HTTP 503 response.
  - **Empty:** creates a local successful JSON response containing an empty array.

The HTTP error and empty responses are simulations, not responses returned by JSONPlaceholder. The app requires a network connection for the profile and real-post requests. Profile-specific error handling is intentionally kept separate from the browser section.

## Validate

```bash
npm run lint
npm run build
```

## Assignment notes and evidence

- [Interview explanations](./docs/INTERVIEW.md)
- [Testing results and screenshots](./docs/TESTING.md)
- [Screenshots](./docs/screenshots/)
