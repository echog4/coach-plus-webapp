export const getParams = (url: string) => {
  const u = new URL(url);
  const po: Record<string, string> = {};
  for (const p of u.searchParams) {
    po[p[0]] = p[1];
  }
  return po;
};
