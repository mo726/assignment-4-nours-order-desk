import type { Post } from "./posts";

export type PostScenario = "success" | "slow" | "http-error" | "empty";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getScenarioResponse(scenario: PostScenario): Promise<Response> {
  if (scenario === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (scenario === "http-error") {
    return new Response("Service unavailable", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }

  if (scenario === "empty") {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return fetch("https://jsonplaceholder.typicode.com/posts?userId=1");
}

export async function getClientPosts(scenario: PostScenario): Promise<Post[]> {
  const response = await getScenarioResponse(scenario);

  if (!response.ok) {
    throw new ApiError(
      `The posts service returned HTTP ${response.status}.`,
      response.status,
    );
  }

  const posts: Post[] = await response.json();
  return posts;
}
