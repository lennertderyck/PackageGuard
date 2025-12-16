import { LOGO_AIKIDO, LOGO_GITHUB, LOGO_NPM_MARK } from "@/src/assets";
import {
  getAikidoMalwarePredictions,
  getGithubAdvisoryResultForPackage,
  getNpmPackageInfo
} from "@/src/lib/queries";
import { parseRepositoryUrl } from "@/src/lib/utils/general";
import className from "classnames";
import dayjs from "dayjs";
import { ArrowRight, Code, Globe2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getPackageInfoFromUrl } from "../../../lib/utils/parsers";

const PackageStatusPage: FC<{
  params: Promise<{ packageNameSlug: string[] }>;
}> = async ({ params }) => {
  const { packageNameSlug } = await params;
  const packagePath = packageNameSlug.join("/");
  const packageInfoFromSlug = getPackageInfoFromUrl(`/package/${packagePath}`);

  if (!packageInfoFromSlug) {
    return (
      <main className="mx-auto max-w-7xl py-24 px-24">
        <h1 className="text-3xl font-bold">Package not found</h1>
        <p className="mt-4">
          We could not find the package you are looking for. Please check the
          package name and try again.
        </p>
      </main>
    );
  }

  const {
    scope,
    name: fullPackageName,
    scopedPackageName
  } = packageInfoFromSlug;

  const packageVersion = packageInfoFromSlug.version || "latest";

  const npmPackageVersionInfoResponse = await getNpmPackageInfo(
      packageInfoFromSlug.name,
      packageVersion
    ),
    npmPackageInfoResponse = await getNpmPackageInfo(
      packageInfoFromSlug.name,
      undefined
    ),
    githubAdvisoryResponse = await getGithubAdvisoryResultForPackage(
      fullPackageName,
      packageVersion
    ),
    aikidoMalwarePredictionsResponse = await getAikidoMalwarePredictions(),
    hasAikidoMalwarePrediction = aikidoMalwarePredictionsResponse.some(
      (item: any) => item.package_name === fullPackageName
    ),
    updatedAt =
      npmPackageInfoResponse.time[npmPackageVersionInfoResponse.version],
    packageIsOlderThan24h = dayjs().diff(dayjs(updatedAt), "hour") > 24;

  console.log({ githubAdvisoryResponse });

  const ADVISORIES = [
    {
      name: "NPM",
      about: "Package age",
      url: `https://www.npmjs.com/package/${fullPackageName}?activeTab=versions`,
      resolvedResult: !packageIsOlderThan24h
        ? ["that package is less than 24h old"]
        : [],
      logoAsset: LOGO_NPM_MARK
    },
    {
      name: "NPM",
      about: "Repository info",
      url: `https://www.npmjs.com/package/${fullPackageName}`,
      resolvedResult: !npmPackageVersionInfoResponse?.repository?.url
        ? ["that package has no public repository"]
        : [],
      logoAsset: LOGO_NPM_MARK
    },
    {
      name: "GitHub",
      about: "GitHub Advisory Database",
      url: `https://github.com/advisories?query=${encodeURIComponent(
        `ecosystem:npm ${githubAdvisoryResponse
          .map((advisory) => advisory.ghsa_id)
          .join(" ")}`
      )}`,
      resolvedResult: githubAdvisoryResponse.length
        ? [
            githubAdvisoryResponse.length === 1
              ? "1 advisory"
              : `${githubAdvisoryResponse.length} advisories`
          ]
        : [],
      logoAsset: LOGO_GITHUB
    },
    {
      name: "Aikido",
      about: "Malware predictions list",
      url: "https://intel.aikido.dev/packages/npm/" + fullPackageName,
      resolvedResult: hasAikidoMalwarePrediction ? ["malware"] : [],
      logoAsset: LOGO_AIKIDO
    }
  ];

  const SOURCES = [
    {
      name: "Package",
      label: "npm",
      url: "https://npmjs.com/package/" + fullPackageName,
      icon: Package
    },
    {
      name: "Code",
      label: "GitHub",
      url:
        npmPackageVersionInfoResponse?.repository &&
        npmPackageVersionInfoResponse?.repository.url
          ? parseRepositoryUrl(npmPackageVersionInfoResponse?.repository?.url)
              ?.href
          : null,
      icon: Code
    },
    {
      name: "Homepage",
      label: npmPackageVersionInfoResponse?.homepage
        ? new URL(npmPackageVersionInfoResponse?.homepage).host
        : null,
      url: npmPackageVersionInfoResponse?.homepage,
      icon: Globe2
    }
  ];

  return (
    <main className="mx-auto max-w-7xl py-24 px-24">
      <div className="grid grid-cols-12 gap-16">
        <aside className="col-span-4">
          <div className="mb-8">
            <h1 className="whitespace-pre-wrap text-balance">
              {scope && (
                <>
                  <span className="text-3xl">{scope}/</span>
                  <br />
                </>
              )}
              <span className="text-5xl break-balance max-w-[12ch] font-semibold">
                {scopedPackageName}
              </span>
            </h1>
            <h2 className="mt-2 bg-white/10 p-1 px-4 w-fit rounded-full">
              {packageVersion}
            </h2>
          </div>
          <ul className="divide-y divide-white/20 border border-white/20 rounded-xl px-2">
            {SOURCES.filter((source) => !!source.url).map(
              (source, sourceIndex) => (
                <li key={sourceIndex} className="py-2">
                  <Link
                    href={source.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:bg-white/5 py-2 px-4 rounded-sm transition-colors"
                  >
                    <source.icon size={20} />
                    <div>
                      <h4 className="text-white/90 text-sm leading-4">
                        {source.name}
                      </h4>
                      <p className=" font-semibold leading-4">{source.label}</p>
                    </div>
                  </Link>
                </li>
              )
            )}
          </ul>
        </aside>
        <main className="col-span-8">
          <h3 className="text-xl font-bold mb-4">Status</h3>
          <Image
            src={"/badge/" + fullPackageName + "/badge.svg"}
            alt=""
            width={250}
            height={46}
          />

          <h3 className="text-xl font-bold mb-4">Advisories</h3>
          <div className="*:border *:border-white/25 space-y-4">
            {ADVISORIES.map((advisory, advisoryIndex) => (
              <Link
                key={advisoryIndex}
                href={advisory.url}
                target="_blank"
                rel="noopener noreferrer"
                className={className(
                  advisory.resolvedResult.length === 0 &&
                    "opacity-60 pointer-events-none",
                  "p-5 rounded-xl flex justify-between border border-white/20 align-baseline hover:bg-white/5 transition-colors"
                )}
              >
                <div className="flex gap-5">
                  <Image
                    src={advisory.logoAsset}
                    alt="Logo Aikido"
                    className="size-5 translate-y-1"
                  />
                  <div>
                    <h4>
                      <span className="font-bold">{advisory.name}</span> /{" "}
                      {advisory.about}
                    </h4>
                    <p>
                      {advisory.resolvedResult.length === 0
                        ? "No advisory found"
                        : `Found ${advisory.resolvedResult}`}
                    </p>
                  </div>
                </div>
                {advisory.resolvedResult.length !== 0 && <ArrowRight />}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </main>
  );
};

export default PackageStatusPage;
