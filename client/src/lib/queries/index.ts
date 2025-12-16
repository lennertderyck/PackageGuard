export const getNpmPackageInfo = async (
  packageName: string,
  packageVersion: string | undefined
) => {
  const slug = packageVersion
    ? `${packageName}/${packageVersion}`
    : packageName;

  return (await (
    await fetch(`https://registry.npmjs.org/${slug}`, {
      cache: "no-store"
    })
  ).json()) as unknown as Promise<Npm.PackageInfo>;
};

export const getAikidoMalwarePredictions = async () => {
  return (await (
    await fetch("https://malware-list.aikido.dev/malware_predictions.json", {
      cache: "no-store"
    })
  ).json()) as unknown as Promise<Aikido.MalwarePrediction[]>;
};

export const getAikidoMalwarePredictionForPackage = async (
  packageName: string
) => {
  return (await getAikidoMalwarePredictions()).find(
    (scannedPackage) => scannedPackage.package_name === packageName
  );
};

export const getGithubAdvisoryResultForPackage = async (
  packageName: string,
  version?: string
) => {
  return (await (
    await fetch(
      `https://api.github.com/advisories?ecosystem=npm&affects=${encodeURI(
        version ? `${packageName}@${version}` : packageName
      )}&type=malware&type=reviewed`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_TOKEN_GITHUB}`,
          "X-GitHub-Api-Version": "2022-11-28"
        }
      }
    )
  ).json()) as unknown as GitHubSecurity.AdvisoryResponse[];
};
