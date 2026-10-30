export function navigationFinished() {
  /* Navigation is never held for view transitions. */
}

export function transitionTo(navigate) {
  navigate();
}
