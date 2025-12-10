import { match } from "path-to-regexp";

export const getPackageInfoFromUrl = (
    pathname: string = window.location.pathname
) => {
    const fn = match("/package/:name{/v/:version}");
    const result = fn(pathname);

    if (!result) return null;
    else {
        return {
            name: String(result.params.name),
            version: result.params.version
                ? String(result.params.version)
                : null,
            parsed:
                result.params.name +
                (result.params.version ? `@${result.params.version}` : "")
        };
    }
};
