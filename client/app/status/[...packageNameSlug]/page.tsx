import LogoAikido from "@/src/assets/logos/vendors/LOGO_AIKIDO.svg";
import LogoGithub from "@/src/assets/logos/vendors/LOGO_GITHUB.svg";
import { getPackageInfo } from "@/src/lib/queries";
import {
  getPackageNameFromSlugArray,
  parsePackageName,
  parseRepositoryUrl
} from "@/src/lib/utils/general";
import className from "classnames";
import { ArrowRight, Code, Globe2, Package } from "lucide-react";
import { RouteMatcher } from "next/dist/server/route-matchers/route-matcher";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface Props extends RouteMatcher {}

const Page: FC<{ params: Promise<{ packageNameSlug: string[] }> }> = async ({
  params
}) => {
  const { packageNameSlug } = await params;

  const fullPackageName = getPackageNameFromSlugArray(packageNameSlug);
  const { scope, scopedPackageName } = parsePackageName(fullPackageName);
  const packageResponse = await getPackageInfo(fullPackageName);

  const aikidoResponse = await (
    await fetch("https://malware-list.aikido.dev/malware_predictions.json")
  ).json();

  const hasAikidoMalwarePrediction = aikidoResponse.some(
    (item: any) => item.package_name === fullPackageName
  );

  const githubAdvisoryResponse = (await (
    await fetch(
      `https://api.github.com/advisories?ecosystem=npm&affects=${encodeURI(
        fullPackageName
      )}&type=malware`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_TOKEN_GITHUB}`,
          "X-GitHub-Api-Version": "2022-11-28"
        }
      }
    )
  ).json()) as unknown as GitHubSecurity.AdvisoryResponse[];

  const ADVISORIES = [
    {
      name: "GitHub",
      about: "GitHub Advisory Database",
      url: "https://github.com/advisories?query=" + fullPackageName,
      resolvedResult: githubAdvisoryResponse?.map(
        (gitHubadvisory) => gitHubadvisory.type
      ),
      logoAsset: LogoGithub
    },
    {
      name: "Aikido",
      about: "Malware predictions list",
      url: "https://intel.aikido.dev/packages/npm/" + fullPackageName,
      resolvedResult: hasAikidoMalwarePrediction ? ["malware"] : [],
      logoAsset: LogoAikido
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
      url: parseRepositoryUrl(packageResponse?.repository.url).href,
      icon: Code
    },
    {
      name: "Homepage",
      label: new URL(packageResponse?.homepage).host,
      url: packageResponse?.homepage,
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
            <h2 className="mt-2">version {packageResponse.version}</h2>
          </div>
          <ul className="divide-y divide-white/20 border border-white/20 rounded-xl px-2">
            {SOURCES.map((source) => (
              <li key={source.name} className="py-2">
                <Link
                  href={source.url}
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
            ))}
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
            {ADVISORIES.map((advisory) => (
              <Link
                key={advisory.name}
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

export default Page;
