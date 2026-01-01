import dayjs from "dayjs";
import { getPackageVulnerabilityTypeFromGithubAdvisory } from "../vendors/github";

export const getNpmPackageVersionInfo = async (
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

export const getNpmPackageInfo = async (packageName: string) =>
  getNpmPackageVersionInfo(packageName, undefined);

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

export const getPackageVulnerabilitiesInfo = async (
  packageName: string,
  version: string
) => {
  const response = await Promise.all([
    getNpmPackageVersionInfo(packageName, version),
    getNpmPackageInfo(packageName),
    getGithubAdvisoryResultForPackage(packageName, version),
    getAikidoMalwarePredictionForPackage(packageName)
  ]);

  const [
    npmPackageVersionInfo,
    npmPackageInfo,
    githubAdvisoryResponse,
    aikidoMalwarePrediction
  ] = response;

  const hasRepositoryUrl = npmPackageVersionInfo?.repository?.url !== undefined;
  const updatedAt = npmPackageInfo.time[npmPackageVersionInfo.version],
    packageIsOlderThan24h = dayjs().diff(dayjs(updatedAt), "hour") > 24;

  const advisorySources = [
    {
      name: "NPM",
      advisories: [
        !hasRepositoryUrl ? { type: "untrusted", reason: "NO_REPO" } : null,
        !packageIsOlderThan24h
          ? { type: "untrusted", reason: "AGE_MIN_DAY" }
          : null
      ].filter(Boolean)
    },
    {
      name: "GITHUB",
      advisories: [
        ...githubAdvisoryResponse.map((advisory) => ({
          type: getPackageVulnerabilityTypeFromGithubAdvisory(advisory),
          reason: null
        }))
      ].filter(Boolean)
    },
    {
      name: "AIKIDO",
      advisories: aikidoMalwarePrediction
        ? [{ type: "malware", reason: "PREDICT" }]
        : []
    }
  ];

  return {
    name: packageName,
    version: version,
    isVulnerable: advisorySources.some(
      (source) => source.advisories.length > 0
    ),
    reachedAgeTreshold: packageIsOlderThan24h,
    advisorySources,
    about: {
      package: npmPackageInfo,
      packageVersion: npmPackageVersionInfo,
      githubAdvisories: githubAdvisoryResponse,
      aikidoMalwarePrediction: aikidoMalwarePrediction || null
    }
  };
};
