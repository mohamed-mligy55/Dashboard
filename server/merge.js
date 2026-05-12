/**
 * Deep-merge plain objects for PATCH (nested name / address preserved).
 */
export function deepMerge(target, source) {
  if (source == null || typeof source !== "object") return target;
  const base =
    target != null && typeof target === "object" && !Array.isArray(target)
      ? { ...target }
      : {};
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = base[key];
    if (
      sv != null &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv != null &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      base[key] = deepMerge(tv, sv);
    } else if (sv !== undefined) {
      base[key] = sv;
    }
  }
  return base;
}
