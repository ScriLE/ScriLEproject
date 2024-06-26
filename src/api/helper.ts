export type QueryParams = Record<string, string | number | (string | number)[]>;

export const serializeToQuery = (value: QueryParams) => {
  const serializedQueryParams: string[] = Object.keys(value).reduce<string[]>((acc, key) => {
    if (value[key] === undefined) return acc;
    if (Array.isArray(value[key])) {
      acc.push(...(value[key] as (number | string | object)[]).map((item) => {
        if (typeof item === 'object') {
          return `${key}=${JSON.stringify(item)}`;
        }
        return `${key}=${item}`;
      }));
    } else {
      acc.push(`${key}=${value[key]}`);
    }
    return acc;
  }, []);
  return `${serializedQueryParams.join('&')}`;
};
