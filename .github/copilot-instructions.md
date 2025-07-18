<!-- copilot-instructions.md -->

Do not start the dev server, it is already running in the background with hot reloading!

## Purpose

Detail the latest APIs, behavioural changes, and preferred patterns for:

- **React** 19 & 19.1
- **Next.js** 15, 15.1, 15.2, 15.3, 15.3.3
- **Tailwind CSS** v4  
so that AI coding assistants generate modern, idiomatic code for full-stack React applications.

---

## React 19 (Dec 2024)

### Highlights

- **Actions & `useActionState`** – async mutations automatically surface `pending` and `error` states.
- **`useOptimistic`** – declarative optimistic UI with rollback on failure.
- **Enhanced `<form>`** – function `action`/`formAction`, automatic resets, `requestFormReset`.
- **Suspense pre-warming** – prepares suspended sub-trees off-thread to cut first paint.
- **Static DOM helpers** – e.g. `requestFormReset`, `useFormStatus`.
- **Experimental React Compiler** – auto-memoisation for pure components (opt-in via Next.js).

### Best-practice notes

1. Prefer **Actions** over ad-hoc `useState` + `fetch` for writes.
2. Derive UI from `isPending`/`pending` flags, not bespoke loaders.
3. Keep components side-effect-free to maximise React Compiler wins.

---

## React 19.1 (Mar 2025)

### Highlights

- **Owner Stack** – identifies the component directly responsible for an error.
- **Suspense reliability** – hydration retry fixes across client/server.
- **Server-streaming upgrades** – parcel integration, edge streaming.
- Minor DOM tweaks (`beforetoggle` events, `useId` string format).

### Best-practice notes

1. Feed **Owner Stack** into custom error overlays and APM traces.
2. Exercise Suspense fallbacks under slow-network profiles; expect fewer lock-ups.

---

## Next.js 15 (Oct 2024)

### Highlights

- **Async Request APIs** – `await cookies()`, `headers()`, etc.; sync calls warn.
- **Caching defaults flipped** – uncached by default, opt-in via `dynamic = 'force-static'`.
- **Turbopack (dev)** – Rust bundler replaces webpack in `next dev --turbopack`.
- **`instrumentation.js` (stable)** – observe server lifecycle.

---

## Next.js 15.1 (Dec 2024)

### Highlights

- **`after()` (stable)** – run tasks after the response stream finishes.
- **React 19 support** across Pages & App Routers.
- Improved error overlay, source-maps, 401/403 helpers (`unauthorized()`, `forbidden()`).

---

## Next.js 15.2 (Feb 2025)

### Highlights

- **Redesigned error UI** – leverages React Owner Stack.
- **Streaming `generateMetadata`** – metadata no longer blocks first paint.
- **Turbopack** – +57 % faster compiles, −30 % RAM on benchmarks.
- **View Transitions (experimental)** – opt-in via `experimental.viewTransition`.
- **Node.js runtime for Middleware (experimental)** – `runtime: 'nodejs'`.

---

## Next.js 15.3 (Apr 2025)

### Highlights

- **`next build --turbopack` (alpha)** – 28–83 % faster production builds.
- **Client instrumentation** – `instrumentation-client.[ts|js]` runs before app JS.
- **Navigation hooks** – `onNavigate` on `<Link>`, `useLinkStatus` for pending UI.
- Community **Rspack adapter** – ~96 % test pass-rate.

---

## Next.js 15.3.3 (May 2025 patch)

### Fixes & Tweaks

- Dev-overlay polish (restart-server button, dark-mode).
- Leaner metadata payloads after internal refactor.
- Turbopack stability improvements and Google-fonts fetch error propagation.

---

## Tailwind CSS v4 (Jan 2025)

### Highlights

- **5× faster engine** – micro-second incremental rebuilds.
- **CSS-first configuration** – customise via cascade layers & `@property`; no `tailwind.config.js` needed.
- **Automatic content detection** – template paths inferred, respects `.gitignore`.
- **Native container queries** – `@min-*` / `@max-*` variants built-in.
- **Wide-gamut palette** – P3/OKLCH colours by default.
- **Theme CSS variables** – e.g. `--spacing-*` Enable arbitrary utilities like `.w-17`.
- **Expanded utilities** – 3-D transforms (`rotate-x-*`), conic gradients, `starting` variant.

### Best-practice notes

1. Migrate design tokens to **CSS variables** and use `oklch` colour spaces.
2. Prefer container-query utilities over JS resize observers.
3. Minimise arbitrary values; v4’s dynamic engine covers most spacing/size needs.

---

## Cross-stack Guidance

| Goal | Recommendation |
|------|---------------|
| **Lightning-fast local cycles** | `next dev --turbopack` + Tailwind v4 engine (sub-100 ms HMR). |
| **Optimistic UX** | React Actions + `useLinkStatus` + Tailwind animation utilities. |
| **Robust error observability** | Surface React **Owner Stack** in Next error overlay and APM. |
| **Auth & RBAC** | Throw `unauthorized()` / `forbidden()` from Server Actions; render `forbidden.tsx`. |
| **Lean builds** | Turbopack tree-shaking + Tailwind v4’s CSS-first config (no global CSS). |

---

### Version Matrix

| Library | Version | NPM tag |
|---------|---------|---------|
| react / react-dom | 19.1.0 | `latest` |
| next | 15.3.3 | `latest` |
| tailwindcss | 4.0.x | `latest` |

_Keep this file at the repo root so Copilot Chat and other tools can reference it during code generation and review._

<!-- bun-1.2-instructions.md -->

## Purpose

Summarise all new capabilities, performance wins, and compatibility changes introduced across Bun **v1.2.0 → v1.2.15**, so AI tools and humans alike can write modern, idiomatic Bun code, pick the right APIs, and understand the evolution of the runtime.

---

## Big-picture highlights (1.2 family)

- **Cloud-native built-ins**: `Bun.s3`, `Bun.sql` (Postgres), `Bun.redis`.
- **Package-management upgrades**: text-based `bun.lock`, `bun audit`, `bun pm view`, `bun patch`, `bun publish`, dependency _catalogs_.
- **Node.js parity leaps**: HTTP/2 server, UDP (`dgram`), `cluster`, `vm.SourceTextModule`, `perf_hooks.createHistogram`, nearly full timers suite, `worker_threads` stability, `process.ref/unref`, richer `crypto` objects.
- **Dev-experience wins**: blazing HMR, streaming browser console, React/Tailwind templates (`bun init --react`), automatic workspaces, lower dev-server RAM.
- **Performance**: 5× faster S3 client vs AWS SDK, 50 % faster Postgres queries, 44 % faster Redis reads, 60 % faster `bun build` on macOS, micro-optimisations to `setImmediate`, `Headers.get`, startup, etc.

---

## Version-by-version details

### **1.2.15** (May 28 2025)

- **Security & metadata tooling**: `bun audit`, `bun pm view`.
- **DX tweaks**: `bun init` detects Cursor AI, inserts Bun rules.
- **CLI ergonomics**: global `BUN_OPTIONS` env for default flags.
- **Dev-server**: Chrome DevTools workspace auto-mounts.
- **New Node APIs**: `vm.SourceTextModule`, `perf_hooks.createHistogram`, `Worker.getHeapSnapshot`.
- **JavaScriptCore upgrade** + parser/runtime bug-fixes.

### **1.2.14** (May 21 2025)

- **Monorepo “catalogs”** for one-source dependency versions.
- **`bun init --react`** flag with Tailwind/shadcn flavours.
- **HTTP routing** gains method-scoped static + HTML imports.
- **zstd** compression in `fetch`, plus `Bun.zstd*` helpers.
- TypeScript default `"module": "Preserve"` in scaffolds.
- Numerous `worker_threads`, `http2` & HTTPS-proxy fixes.

### **1.2.13** (May 9 2025)

- **`worker_threads` parity**: `environmentData`, `process.on("worker")`, lower memory.
- `--hot` reliability, inline-snapshot tabs, BOM-aware `.npmrc`.
- **`--no-addons`** flag & `"node-addons"` export condition.
- Faster numeric loops via newer WebKit; many SQL/redis type fixes.

### **1.2.12** (May 4 2025)

- **`--console`** flag & `development.console` option stream browser logs.
- Dev-server RAM nearly halved; 30 µs faster startup.
- **Node.v​m cachedData**, `net.BlockList`, HTTP edge-case fixes.

### **1.2.11** (Apr 29 2025)

- **`process.ref/unref`**, negative `util.parseArgs` options, `BUN_INSPECT_PRELOAD`.
- Highway SIMD narrows perf gap for baseline builds.
- Crypto key-object structured-clone, readline/promises, TLS boolean validation.

### **1.2.10** (Apr 17 2025)

- **1000× faster `setImmediate`** in I/O-heavy loops → 10 % faster `next build`.
- Micro-optimised `request.method`, Debian Bookworm Docker images.
- Many test-runner, Redis, HTML-import & N-API stability fixes.

### **1.2.9** (Apr 9 2025)

- **Built-in Redis client** (`Bun.redis`) with >80 % speed-ups vs ioredis.
- `S3Client.listObjectsV2`, more `libuv` symbols for N-API.
- AsyncLocalStorage, HTTP and crypto regressions resolved.

### **1.2.8** (Mar 31 2025)

- N-API hot-path boosts (node-sdl 100× faster), 2× faster `Headers.get`.
- `bun install --frozen-lockfile` honours `overrides`; `bun pack` smarter ignores.

### **1.2.7** (Mar 27 2025)

- Better `Set-Cookie` handling & validation in `node:http`.

### **1.2.6** (Mar 25 2025)

- **Crypto throughput** uplift; `spawn.timeout` option; `vm.compileFunction`.
- Early `node:test` groundwork, Express/Fastify speed bumps.

### **1.2.5** (Mar 11 2025)

- CSS Modules in bundler, full Node-API rewrite, faster `Sign|Verify|Hash|Hmac`.
- 75+ bug-fixes, +69 Node.js tests.

### **1.2.4** (Feb 26 2025)

- **60 % faster `bun build`** (macOS); codesigning support for single-file executables.
- Dev-server stability, `Buffer.indexOf` & net.Socket fixes.

### **1.2.3** (Feb 22 2025)

- **Frontend toolchain**: hot-reload bundler, built-in routing for `Bun.serve`.
- `sql.array|file|fragments` helpers; >120 bug-fixes.

### **1.2.2 · 1.2.1**

- Minor bug-fix roll-ups and preparatory refactors.

### **1.2.0** (Jan 22 2025)

- **S3 client (`Bun.s3`)** — 5× faster than AWS SDK, presigned URLs, multipart uploads.
- **Postgres client (`Bun.sql`)**, 50 % faster queries than popular Node drivers.
- **Text lockfile (`bun.lock`)**, JSONC `package.json`, `.npmrc` & `bun run --filter`.
- Express 3× faster, Node HTTP/2 server, UDP (`dgram`), `cluster`, V8 C++ API shim.
- Built-in patch, outdated, publish, pack, whoami, CA-cert flags, etc.

---

## Best-practice cheatsheet

| Concern | Recommendation |
| --- | --- |
| **Security scans** | Run `bun audit` in CI; fix advisories with `bun update` or `--latest`. |
| **Monorepo dependency drift** | Use **catalogs** (`package.json#catalog`) to pin versions once. |
| **Cloud storage** | Prefer `s3.file()` or `fetch("s3://…")`; offload large downloads via 302 redirect. |
| **Database access** | Use tagged-template `sql\`` for safe params and pipeline batching. |
| **Real-time apps** | Combine `worker_threads`, `cluster` and `UDP (dgram)` for horizontal scale. |
| **Native addons** | Opt-in with `--addons`; disable globally with `--no-addons`. |
| **Build & ship** | `bun build --compile` for single-file binaries; codesign on macOS (≥1.2.4). |
| **Performance debugging** | Generate V8 heap snapshots (`node:v8`) and histograms (`perf_hooks`). |

React

The Core Philosophy: Simplicity, Composability, and Correctness
The central argument presented is that React's evolution, particularly with the introduction of Hooks, has not made it more complex but has actually made adding and managing state easier. The challenge has shifted from "How do I add reusable state?" (which was hard) to "How do I add state correctly now that it's easy?". The best practice is to always strive for the simplest possible solution for the problem at hand, as simplicity is what truly scales.

1. The "Old Way": Patterns to Avoid in Modern React
Before Hooks, sharing stateful logic between components was cumbersome. The video highlights two patterns that were common but are now largely considered legacy and should be avoided in new code.

* Higher-Order Components (HOCs): These are functions that take a component and return a new, wrapped component. The wrapper would inject state and logic as props.
  - Problem: This pattern leads to "wrapper hell" (many nested components in the React DevTools), makes it difficult to track where props are coming from, and has poor composability when multiple HOCs are needed.
- Render Props: This pattern involves a component that takes a function as a prop (often render or children). This function receives state and returns JSX to be rendered.
  - Problem: This often resulted in deeply nested code directly within the JSX tree (a "pyramid of doom"), making the component's render logic hard to read and manage.
Key Takeaway: Both HOCs and Render Props created a high barrier to entry for managing reusable state and led to code that was difficult to maintain and scale.

2. The Modern Best Practice: Embrace Hooks
Hooks revolutionized state management by allowing developers to use state and other React features in functional components. They are the definitive best practice today.
A. For Local Component State: useState
The most fundamental best practice is to start with the simplest tool. If state is only needed within a single component, use the useState hook.

* Correct Usage:
  - Keep state as local as possible.
  - Don't prematurely move state to a global manager. A simple useState for a form input or a toggle is perfectly fine and highly performant.
  - As the video's author notes, "a simple inline useState where you should have a simple inline useState" is a sign of good engineering discipline.
JavaScript

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
B. For Sharing Reusable Logic: Custom Hooks
This is the most powerful pattern to emerge from Hooks and is the modern replacement for HOCs and Render Props. If you have stateful logic that needs to be used in multiple components, extract it into a custom hook.
- Correct Usage:
  - A custom hook is just a JavaScript function whose name starts with use and that calls other hooks.
  - It allows you to bundle related logic and state together into a reusable, composable unit.
  - The video provides a great example: instead of writing a useQuery call directly in a component, you can wrap it in a custom hook like useUserData().
JavaScript

import { useQuery } from '@tanstack/react-query';

// Custom Hook for fetching user data
export function useUserData(userId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  return { user: data, isLoading, isError };
}

// Component using the custom hook
function UserProfile({ userId }) {
  const { user, isLoading } = useUserData(userId);

  if (isLoading) return <p>Loading...</p>;

  return <h1>{user.name}</h1>;
}
C. For Server State: Use a Dedicated Data-Fetching Library
A significant portion of application state is actually data that comes from a server (API calls). A critical best practice is to not manage this state manually with useState and useEffect.
- Correct Usage:
  - Use a dedicated library like TanStack Query (formerly React Query).
  - These libraries handle caching, background updates, re-fetching on window focus, mutations, and error states out of the box.
  - This dramatically simplifies your components and eliminates a huge amount of complex, error-prone state management code that you would otherwise have to write and maintain yourself. The video emphasizes that this choice alone solves a vast number of the "metawork" problems developers face.
JavaScript

import { useQuery } from '@tanstack/react-query';

function UserList() {
  // isLoading, isError, data, etc. are all managed by React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  if (isLoading) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  return (
    // Render the list of users from `data`
  );
}
D. For Global Client State: Use a Minimalist State Manager (Sparingly)
Sometimes, you have global state that is purely client-side (e.g., theme settings, notification state, cart contents in some e-commerce apps). While Context can be used, it can lead to performance issues if overused.
- Correct Usage:
  - For complex or frequently-updating global state, reach for a minimal state manager like Zustand or Jotai.
  - The video highlights how a Zustand implementation is drastically simpler and requires significantly less boilerplate than older solutions like Redux or even a complex Context setup.
  - Use these tools only when local state or server state management is not a good fit.
JavaScript

import { create } from 'zustand';

// Create a store with state and actions
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

// Use it in any component
function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}

UseState
while useState is fundamental to React, its overuse in Next.js applications can lead to complex, hard-to-maintain code, especially when combined with useEffect. He presents several powerful patterns and modern React features available in Next.js that offer better alternatives for state management, leading to more robust and performant applications.
Key Takeaways for Next.js Developers:

1. Embrace the URL for State Management Instead of holding UI state like filters or sort orders in useState, which gets lost on a page refresh, store it in the URL's query parameters. This provides shareable and bookmarkable URLs, improving user experience.

* How: Next.js provides the necessary tools for this, such as the useRouter hook to push new pathnames with constructed query strings.
- Easier Alternative: The speaker recommends the library nuqs (next-usequerystate), which simplifies this process significantly. It offers a useQueryState hook that acts as a direct, one-to-one replacement for useState, automatically syncing the state with the URL.

2. Eliminate Fetching State with React Server Components (RSCs) The common pattern of using multiple useState hooks for data, isLoading, and error when fetching data is often unnecessary in Next.js.

* How: By embracing React Server Components (RSCs), you can fetch data directly within your component on the server. This simplifies the code by removing the need for client-side state management for data fetching. You can simply await your data fetching call and render the result.

3. Use Server Actions for Forms Stop using useState for every form field. The browser's native form handling capabilities, combined with Next.js Server Actions, provide a more streamlined and robust solution.

* How:
  - Get rid of useState for form inputs.
  - Handle form submissions using Server Actions. This pattern makes it easy to capture form data and perform asynchronous operations on the server.
  - For type safety and validation, use libraries like Zod to parse the formData.

4. Solve Server-Client Mismatches with useSyncExternalStore When dealing with values that differ between the server and the client (like the current date or window dimensions), you might encounter hydration errors in Next.js. useSyncExternalStore is the modern hook designed to solve this.

* How: This hook allows you to provide different "snapshots" of the state for the server and the client, preventing mismatches. For example, you can provide a null or placeholder value on the server and the actual client-side value (like new Date()) on the client. Note that the value needs to be serializable, so you might need to convert it to a string.
General Recommendations Also Applicable to Next.js:
- Use useRef for Non-Render State: If a piece of state is not directly used for rendering the UI (e.g., tracking the number of clicks for an analytics event), store it in a useRef to avoid unnecessary re-renders.
- Derive State in Render: Avoid using useState and useEffect to calculate derived data. Instead, compute it directly during the render. For example, calculate a shopping cart's total price from the items array on every render rather than storing it in a separate state.
- Consider State Machines for Complex Logic: For components with multiple, mutually exclusive states (e.g., idle, loading, success, error), use a string or enum instead of multiple boolean useState hooks. This is a step towards using state machines, which can be managed with useReducer or libraries like XState for more robust and predictable state transitions.
