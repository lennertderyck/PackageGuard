import { LOGO_AIKIDO, LOGO_GITHUB, LOGO_NPM_MARK } from "@/src/assets";
import { getPackageVulnerabilitiesInfo } from "@/src/lib/queries";
import { parseRepositoryUrl } from "@/src/lib/utils/general";
import { ArrowUpRight, Code, Globe2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getPackageInfoFromUrl } from "../../../lib/utils/parsers";
import PackageVersionbadge from "../../element/PackageVersionbadge/PackageVersionbadge";
import { AdvisoryList } from "../AdvisoryList/AdvisoryList";

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

  const { scope, packageName: fullPackageName } = packageInfoFromSlug;

  const packageVersion = packageInfoFromSlug.version || "latest";
  const vulnerabilitiesInfo = await getPackageVulnerabilitiesInfo(
    packageInfoFromSlug?.packageName || "",
    packageInfoFromSlug?.version || "latest"
  );
  const npmPackageVersionInfoResponse =
      vulnerabilitiesInfo.about.packageVersion,
    githubAdvisoryResponse = vulnerabilitiesInfo.about.githubAdvisories,
    hasAikidoMalwarePrediction =
      vulnerabilitiesInfo.about.aikidoMalwarePrediction;

  const badgeSource = [
    "/badge",
    fullPackageName,
    "v",
    packageVersion,
    "badge.svg"
  ].join("/");

  const ADVISORIES = [
    {
      name: "NPM",
      about: "Package age",
      url: `https://www.npmjs.com/package/${fullPackageName}?activeTab=versions`,
      resolvedResult: !vulnerabilitiesInfo.reachedAgeTreshold
        ? ["Package (version) is less than 24h old"]
        : [],
      logoAsset: LOGO_NPM_MARK
    },
    {
      name: "NPM",
      about: "Repository info",
      url: `https://www.npmjs.com/package/${fullPackageName}`,
      resolvedResult: !npmPackageVersionInfoResponse?.repository?.url
        ? ["Package has no public repository"]
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
              ? "Found 1 advisory"
              : `Found ${githubAdvisoryResponse.length} advisories`
          ]
        : [],
      logoAsset: LOGO_GITHUB
    },
    {
      name: "Aikido",
      about: "Malware predictions list",
      url: "https://intel.aikido.dev/packages/npm/" + fullPackageName,
      resolvedResult: hasAikidoMalwarePrediction ? ["Malware found"] : [],
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

  const groupedAdvisories = Object.groupBy(ADVISORIES, (advisory) =>
    advisory.resolvedResult.length > 0 ? "ADVISED" : "NONE"
  );

  const sortedAdvisories = ADVISORIES.sort((a, b) => {
    return b.resolvedResult.length - a.resolvedResult.length;
  });

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
                {packageInfoFromSlug.name.scoped}
              </span>
            </h1>
            <PackageVersionbadge>{packageVersion}</PackageVersionbadge>
          </div>
          <ul className="divide-y divide-white/15 border border-white/15 rounded-xl px-2">
            {SOURCES.filter((source) => !!source.url).map(
              (source, sourceIndex) => (
                <li key={sourceIndex} className="py-2">
                  <Link
                    href={source.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:bg-white/5 py-2 px-4 rounded-sm transition-colors"
                  >
                    <div>
                      <source.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white/90 text-sm leading-4">
                        {source.name}
                      </h4>
                      <p className="font-semibold leading-4">{source.label}</p>
                    </div>
                    <div>
                      <ArrowUpRight />
                    </div>
                  </Link>
                </li>
              )
            )}
          </ul>
        </aside>
        <main className="col-span-8">
          <h3 className="text-xl font-bold mb-4">Status</h3>
          <Image src={badgeSource} alt="" width={250} height={46} />
          <h3 className="text-xl font-bold mb-4">Advisories</h3>
          <div className="mb-4">
            <AdvisoryList advisories={groupedAdvisories.ADVISED || []} />
          </div>
          <AdvisoryList advisories={groupedAdvisories.NONE || []} />
        </main>
      </div>
    </main>
  );
};

export default PackageStatusPage;
