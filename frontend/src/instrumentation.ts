/**
 * Next.js server bootstrap hook. Runs once per runtime before any request is
 * handled.
 *
 * WHY THIS EXISTS
 * ---------------
 * Node 22+ (and by default in Node 25) exposes a global `localStorage` that is
 * only functional when the process is started with `--localstorage-file=<path>`.
 * Without that flag you get an object whose methods are undefined:
 *
 *     typeof localStorage        // "object"
 *     typeof localStorage.getItem // "undefined"
 *
 * Server-side code across the ecosystem — including Next's own dev overlay in
 * `next-server/app-page.runtime.dev.js` — feature-detects with
 * `typeof localStorage !== "undefined"` and then calls `localStorage.getItem`.
 * On Node 25 that guard passes and the call throws, so every route 500s in
 * `next dev` with "localStorage.getItem is not a function". Production builds
 * are unaffected, which is why `next build` and `next start` work fine.
 *
 * Removing the broken global restores the behaviour every other Node version
 * has on the server: `localStorage` simply does not exist, so those guards
 * correctly take the no-op branch. This is server-only and cannot affect the
 * real `window.localStorage` in the browser.
 *
 * The proper long-term fix is to run a Node version this stack supports — see
 * `.nvmrc` (Node 22 LTS). This hook makes newer Node versions survivable too.
 */
export async function register() {
  if (typeof window !== "undefined") return;

  const store = (globalThis as { localStorage?: unknown }).localStorage;
  if (!store) return;

  const isBroken =
    typeof (store as Storage).getItem !== "function" ||
    typeof (store as Storage).setItem !== "function";

  if (isBroken) {
    delete (globalThis as { localStorage?: unknown }).localStorage;
  }
}
