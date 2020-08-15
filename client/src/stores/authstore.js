import { writable } from "svelte/store";

export let user = writable(localStorage.getItem("user") || null);
export let successMessage = writable(null);
export let failureMessage = writable(null);
