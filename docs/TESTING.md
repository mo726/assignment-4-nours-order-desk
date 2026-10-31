# Assignment 3: Testing

## Mission 2 and 3 verification

| Check | Expected result | Actual result | Status |
|---|---|---|---|
| Server profile | Employee 1 name, email, and company come from JSONPlaceholder. | Direct browser load showed Leanne Graham, Sincere@april.biz, and Romaguera-Crona. | Pass |
| Profile independence | Profile failure shows a profile-specific message while other sections remain available. | Implemented; failure was not simulated. | Not tested |
| Server preview | At most three post titles for employee 1 appear after the preview loads. | Direct browser load showed three JSONPlaceholder post titles. | Pass |
| Focused Suspense | Preview fallback appears during the artificial delay while the title and profile remain available. | Reloaded with `domcontentloaded`; the dashboard title and loaded profile were visible while the preview fallback appeared. | Pass |
| Artificial delay | Preview waits two seconds at request time. | The preview work uses `connection()` followed by a two-second delay. The fallback was observed during that wait. | Pass |
| Lint | `npm run lint` completes successfully. | Passed. | Pass |
| Production build | `npm run build` completes successfully. | Passed; Next.js generated the route as partially prerendered with dynamic server-streamed content. | Pass |

## Mission 4 verification

| Check | Expected result | Actual result | Status |
|---|---|---|---|
| Client idle | No client posts request before the first click. | Browser verification observed zero matching requests before clicking. | Pass |
| Client loading | Loading feedback appears and duplicate requests are prevented. | Loading feedback and a disabled button were visible while the request was pending. | Pass |
| Client success | Post titles and bodies render after a successful request. | One matching request occurred after clicking; ten posts with titles and bodies rendered. | Pass |
| Client empty | Empty array shows “No posts found” separately from an error. | The Empty scenario showed “No posts found.” and no client-section error message. | Pass |
| Client error/retry | Failure shows a friendly message and a retry action. | Mission 5 HTTP error scenario verified below. | Pass |

## Mission 5 verification

| Check | Expected result | Actual result | Status |
|---|---|---|---|
| API error class | HTTP failure throws `ApiError` with status and goes through the common response check. | Selecting HTTP error displayed the custom HTTP 503 message, distinguishing it from a network failure. | Pass |
| Success scenario | Real API request returns posts. | Verified in Mission 4; ten posts rendered from the real endpoint. | Pass |
| Slow scenario | Wait two seconds, then request real API; loading feedback remains visible. | Loading feedback and disabled button were visible; ten real posts rendered after about 3.6 seconds total. | Pass |
| HTTP error scenario | A simulated 503 `Response` reaches the shared `response.ok` check and shows an HTTP-specific message. | Simulated response showed “The posts service returned HTTP 503”; this matched the expected behavior. | Pass |
| Empty scenario | A simulated successful empty JSON `Response` reaches the shared parser and shows “No posts found.” | Empty state appeared in the client section without an error message. | Pass |
| Recovery | Switch to Success and retry; posts appear and the error clears. | After the HTTP 503, switching to Success and retrying loaded posts and cleared the client error. | Pass |
| Keyboard focus | Scenario selector and action button are keyboard reachable with visible focus. | At 360px, Tab moved from the scenario selector to the Load posts button; its computed outline was visible. | Pass |
| 360px usability | Content remains readable without horizontal overflow. | At a 360px browser viewport, document and body widths were 345px (the remaining 15px is the browser scrollbar); the further layout remained readable. | Pass |

## Screenshots

The following screenshots were captured from the running app. Loading was captured immediately after navigation commit, while the Suspense fallback was visible.

### Normal state

![Normal dashboard state](./screenshots/normal.png)

### Server preview loading

![Server preview Suspense fallback](./screenshots/server-preview-loading.png)

### Client error

![Client HTTP error state with retry](./screenshots/client-error.png)

### Empty state

![Client empty state](./screenshots/empty-state.png)

### 360px mobile layout and keyboard focus

![Employee Explorer at 360px wide](./screenshots/mobile-360.png)

## Initial inspection

- Branch: `assignment-3-maya-interview`.
- The project uses the Next.js App Router.
- Available scripts: `dev`, `build`, `start`, and `lint`.

## Dependency audit

`npm.cmd audit --json` completed with exit code 1 because it reported vulnerabilities.

- Five high-severity affected packages, all in the ESLint development dependency chain:
  `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`.
- The underlying advisory is a stack-exhaustion denial of service in `braces` when processing deeply nested patterns: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm.
- These are five affected packages tracing to one underlying advisory, not five separate underlying flaws.
- npm proposes changing `eslint-config-next` from 16.4.2 to 14.2.35, flagged as a major-version change. This downgrade needs compatibility review before use.
- No dependencies were changed and no audit fix was run.
- The initial sandboxed audit could not reach the registry; the report above came from the successful retry with registry access.
