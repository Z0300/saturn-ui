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
    if (typeof window !== "undefined") {
      window.location.href = opts.to;
    }
  }
}
