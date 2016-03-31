export function signIn() {
  alert("not yet implemented");
}

export function startHRD(id) {
  swap(updateEntity, "lock", id, toggleHRD, true);
}

export function cancelHRD(id) {
  swap(updateEntity, "lock", id, toggleHRD, false);
}

export function hrdSignIn() {
   alert("not yet implemented");
}
