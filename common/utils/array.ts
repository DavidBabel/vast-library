export function flatten(list: any[], depth: number) {
  depth = typeof depth === "number" ? depth : Infinity;

  if (!depth) {
    if (Array.isArray(list)) {
      return list.map(i => {
        return i;
      });
    }
    return list;
  }

  return _flatten(list, 1);

  function _flatten(currentList: any[], d: number) {
    return currentList.reduce((acc: any[], item) => {
      if (Array.isArray(item) && d < depth) {
        return acc.push(..._flatten(item, d + 1));
      } else {
        return acc.push(...item);
      }
    }, []);
  }
}
