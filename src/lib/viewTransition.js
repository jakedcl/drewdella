let resolvePending = null;

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
        resolvePending = resolve;
        navigate();
        window.setTimeout(() => {
          if (resolvePending === resolve) {
            resolvePending = null;
            resolve();
          }
        }, 700);
      })
  );
}
