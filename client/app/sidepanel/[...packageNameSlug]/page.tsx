import { LOGO_AIKIDO, LOGO_GITHUB, LOGO_NPM_MARK } from "@/src/assets";
import PackageVersionbadge from "@/src/components/element/PackageVersionbadge/PackageVersionbadge";
import { AdvisoryList } from "@/src/components/ui/AdvisoryList/AdvisoryList";
import { getPackageVulnerabilitiesInfo } from "@/src/lib/queries";
import { getPackageInfoFromUrl } from "@/src/lib/utils/parsers";
import { AdvisorySource } from "@/src/types/advisory";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Props {}

const Page: FC<{
  params: Promise<{ packageNameSlug: string[] }>;
}> = async ({ params }) => {
  const { packageNameSlug } = await params;
  const packagePath = packageNameSlug.join("/");
  const packageInfoFromSlug = getPackageInfoFromUrl(`/${packagePath}`);
  const packageVersion = packageInfoFromSlug?.version || "latest";
  const badgeSource = [
    "/badge",
    packageInfoFromSlug?.packageName,
    "v",
    packageVersion,
    "badge.svg"
  ].join("/");

  const vulnerabilitiesInfo = await getPackageVulnerabilitiesInfo(
    packageInfoFromSlug?.packageName || "",
    packageInfoFromSlug?.version || "latest"
  );
  const npmPackageVersionInfoResponse =
      vulnerabilitiesInfo.about.packageVersion,
    githubAdvisoryResponse = vulnerabilitiesInfo.about.githubAdvisories,
    hasAikidoMalwarePrediction =
      vulnerabilitiesInfo.about.aikidoMalwarePrediction;

  const ADVISORIES: AdvisorySource[] = [
    {
      name: "NPM",
      about: "Package age",
      url: `https://www.npmjs.com/package/${packageInfoFromSlug?.packageName}?activeTab=versions`,
      resolvedResult: !vulnerabilitiesInfo.reachedAgeTreshold
        ? ["Package (version) is less than 24h old"]
        : [],
      logoAsset: LOGO_NPM_MARK
    },
    {
      name: "NPM",
      about: "Repository info",
      url: `https://www.npmjs.com/package/${packageInfoFromSlug?.packageName}`,
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
      url:
        "https://intel.aikido.dev/packages/npm/" +
        packageInfoFromSlug?.packageName,
      resolvedResult: hasAikidoMalwarePrediction ? ["Malware found"] : [],
      logoAsset: LOGO_AIKIDO
    }
  ];

  const groupedAdvisories = Object.groupBy(ADVISORIES, (advisory) =>
    advisory.resolvedResult.length > 0 ? "ADVISED" : "NONE"
  );

  const sortedAdvisories = groupedAdvisories?.ADVISED?.sort((a, b) => {
    return b.resolvedResult.length - a.resolvedResult.length;
  });

  return (
    <div className="p-1 flex flex-col h-screen">
      <div className="bg-white/10 p-5 rounded-t-xl rounded-b-sm">
        <h1 className="whitespace-pre-wrap text-balance">
          {packageInfoFromSlug?.scope && (
            <>
              <span className="text-2xl">{packageInfoFromSlug?.scope}</span>
              <br />
            </>
          )}
          <span className="break-balance max-w-[12ch] leading-6">
            <span className="text-4xl font-semibold">
              {packageInfoFromSlug?.name.scoped}
            </span>
            <PackageVersionbadge className="inline-block align-top ml-4">
              {packageInfoFromSlug?.version}
            </PackageVersionbadge>
          </span>
        </h1>
      </div>
      <div className="flex-1 p-5">
        <Image
          src={badgeSource}
          alt=""
          className="w-full"
          width={300}
          height={46}
        />
        <h3 className="text-xl font-bold mb-4">Advisories</h3>
        <div className="mb-4">
          <AdvisoryList advisories={groupedAdvisories.ADVISED || []} />
        </div>
        <AdvisoryList advisories={groupedAdvisories.NONE || []} />
      </div>
      <div className="flex gap-2 bg-white/10 rounded-b-xl rounded-t-sm">
        <Link
          href={`/package/${packageInfoFromSlug?.packageName}/v/${packageInfoFromSlug?.version}`}
          target="_blank"
          rel="noreferrer"
          className="flex justify-end items-center gap-2 py-2 pr-2 pl-4 w-full "
        >
          <span className="font-bold">Expand</span>
          <ArrowUpRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Page;
