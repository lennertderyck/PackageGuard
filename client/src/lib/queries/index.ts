export const getNpmPackageInfo = async (packageName: string) => {
  return (await (
    await fetch(`https://registry.npmjs.org/${packageName}/latest`, {
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

export const getGithubAdvisoryResult = async (packageName: string) => {
  const TYPE = "malware";

  return (await (
    await fetch(
      `https://api.github.com/advisories?ecosystem=npm&affects=${encodeURI(
        packageName
      )}&type=${TYPE}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_TOKEN_GITHUB}`,
          "X-GitHub-Api-Version": "2022-11-28"
        }
      }
    )
  ).json()) as unknown as GitHubSecurity.AdvisoryResponse[];
};
