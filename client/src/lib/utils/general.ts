export const getPackageNameFromSlugArray = <T extends string[]>(
  slug: T,
  ignoreItemsFromRight: number = 0
): string => {
  return decodeURIComponent(
    slug.slice(0, slug.length - ignoreItemsFromRight).join("/")
  );
};

export const parsePackageInfoFromSlug = (packgeNameSlug: string) => {
  const scoped = packgeNameSlug.startsWith("@");
  const [scopeOrName, scopedName] = packgeNameSlug.split("/");

  return {
    scope: scoped ? scopeOrName : null,
    scopedPackageName: scoped ? scopedName : scopeOrName
  };
};

export const parseRepositoryUrl = (url: string) => {
  const [type, href] = url.split("+");

  return { type, href };
};
