import { match } from "path-to-regexp";

export const getPackageInfoFromUrl = (path = window.location.pathname) => {
  const fn = match("/package{/:scope}/:name{/v/:version}");
  const result = fn(path);

  if (!result) return null;
  else {
    const scope = result.params.scope ? String(result.params.scope) : null;
    const name = String(result.params.name);
    const fullPackageName = scope ? `${scope}/${name}` : name;

    return {
      name: fullPackageName,
      scope,
      scopedPackageName: fullPackageName.startsWith("@")
        ? name
        : fullPackageName,
      version: result.params.version ? String(result.params.version) : null,
      parsed:
        fullPackageName +
        (result.params.version ? `@${result.params.version}` : "")
    };
  }
};
