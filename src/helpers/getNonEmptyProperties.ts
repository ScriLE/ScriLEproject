export const getNonEmptyProperties = (obj: any) => {
  if(!(obj instanceof Object)) return obj;

  return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
    if(obj[key] !== '')
      acc[key] = obj[key];
    return acc;
  }, {});
};