/**
 * A module-level router singleton used for programmatic navigation
 * outside of React components (e.g. axios interceptors).
 *
 * Usage:
 *   import { navigate } from "@/lib/navigate";
 *   navigate({ to: "/login" });
 */

let _navigate: ((opts: { to: string; replace?: boolean }) => void) | null =
  null;

export function registerNavigate(
  fn: (opts: { to: string; replace?: boolean }) => void,
) {
  _navigate = fn;
}

export function navigate(opts: { to: string; replace?: boolean }) {
  if (_navigate) {
    _navigate(opts);
  } else {
    // SSR fallback — should not normally be reached on the client
    if (typeof window !== "undefined") {
      window.location.href = opts.to;
    }
  }
}
