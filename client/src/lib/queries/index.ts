interface PackageInfo {
  name: string;
  version: string;
  repository: {
    url: string;
  };
  homepage: string;
}

export const getPackageInfo = async (packageName: string) => {
  return (await (
    await fetch(`https://registry.npmjs.org/${packageName}/latest`, {
      cache: "no-store"
    })
  ).json()) as unknown as Promise<PackageInfo>;
};
