import { filters, normalizeFilter } from "./state.js";

export function readFilterFromLocation(location) {
  const [, filter = filters.all] = location.hash.split("/");
  return normalizeFilter(filter);
}

export function ensureRoute(location) {
  if (!location.hash) {
    location.hash = "#/all";
  }
}
