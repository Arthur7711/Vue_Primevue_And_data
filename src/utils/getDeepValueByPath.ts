const getDeepValueByPath = (
  obj: object,
  path: string[] | undefined
): string | Object => {
  if (!Array.isArray(path)) return obj;
  const currentPropName = path?.shift();
  if (!path.length) return obj[currentPropName];
  else if (typeof obj[currentPropName] === "object") {
    return getDeepValueByPath(obj[currentPropName], path);
  } else return obj[currentPropName];
};

export default getDeepValueByPath;
