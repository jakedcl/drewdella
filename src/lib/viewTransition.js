let resolvePending = null;

const VT_MAX_MS = 120;

export function navigationFinished() {
  const resolve = resolvePending;
  resolvePending = null;
  resolve?.();
}

export function transitionTo(navigate) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (
    reduced ||
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function"
  ) {
    navigate();
    return;
  }

  document.startViewTransition(
    () =>
      new Promise((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          if (resolvePending === finish) resolvePending = null;
          resolve();
        };
        resolvePending = finish;
        navigate();
        window.setTimeout(finish, VT_MAX_MS);
      })
  );
}
