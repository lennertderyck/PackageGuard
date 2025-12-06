export const getPackageNameFromSlugArray = <T extends string[]>(
  slug: T,
  ignoreItemsFromRight: number = 0
): string => {
  return decodeURIComponent(
    slug.slice(0, slug.length - ignoreItemsFromRight).join("/")
  );
};

export const parsePackageName = (packageName: string) => {
  const scoped = packageName.startsWith("@");
  const [scopeOrName, scopedName] = packageName.split("/");

  return {
    scope: scoped ? scopeOrName : null,
    scopedPackageName: scoped ? scopedName : scopeOrName
  };
};

export const parseRepositoryUrl = (url: string) => {
  const [type, href] = url.split("+");

  return { type, href };
};
