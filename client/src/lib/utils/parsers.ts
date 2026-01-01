import { match } from "path-to-regexp";

export interface PackageNameInfo {
  packageName: string;
  name: {
    scoped: string;
    canonical: string;
  };
  scope: string | null;
  version: string | null;
}

export const getPackageInfoFromUrl = (
  path = window.location.pathname
): PackageNameInfo | null => {
  const fn = match("/package{/:scope}/:name{/v/:version}");
  const result = fn(path);

  if (!result) return null;
  else {
    const scope = result.params.scope ? String(result.params.scope) : null;
    const name = String(result.params.name);

    const fullPackageName = scope ? `${scope}/${name}` : name;
    const packageNameScoped = fullPackageName.startsWith("@")
      ? name
      : fullPackageName;
    const packageNameCanonical =
      fullPackageName +
      (result.params.version ? `@${result.params.version}` : "");

    return {
      packageName: fullPackageName,
      name: {
        scoped: packageNameScoped,
        canonical: packageNameCanonical
      },
      scope,
      version: result.params.version ? String(result.params.version) : null
    };
  }
};
