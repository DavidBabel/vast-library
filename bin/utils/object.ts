import { extractFirst } from "./build";

export function extractKeys(baseObject: any) {
  const keys = [];
  if (
    baseObject &&
    typeof baseObject === "object" &&
    !Array.isArray(baseObject)
  ) {
    Object.keys(baseObject).forEach(key => {
      keys.push(key);
      keys.push(...extractKeys(baseObject[key]));
    });
  }
  return keys;
}

export function flatAttrs(attrs: any[]) {
  return attrs.reduce((stack, next) => {
    if (typeof next === "string") {
      stack.push(next);
    } else {
      stack.push(extractFirst(next).name);
    }

    return stack;
  }, []);
}

export function extractAttrs(baseObject: any) {
  const attrs = [];
  if (
    baseObject &&
    typeof baseObject === "object" &&
    !Array.isArray(baseObject)
  ) {
    Object.keys(baseObject).forEach(key => {
      if (key === "attrs") {
        attrs.push(...flatAttrs(baseObject[key]));
      }
      attrs.push(...extractAttrs(baseObject[key]));
    });
  }
  return attrs;
}
