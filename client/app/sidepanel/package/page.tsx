import { getNpmPackageInfo } from "@/src/lib/queries";
import { parsePackageInfoFromSlug } from "@/src/lib/utils/general";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Props {}

const Page: FC<{
  searchParams: Promise<{ name: string; version: string }>;
}> = async ({ searchParams }) => {
  const { name, version = "latest" } = await searchParams;

  const { scope, scopedPackageName } = parsePackageInfoFromSlug(name);
  const npmPackageInfoResponse = await getNpmPackageInfo(name, undefined);

  return (
    <div className="p-1 flex flex-col justify-between h-screen">
      <div className="bg-purple-900/25 p-5 rounded-t-xl rounded-b-sm">
        <h1 className="whitespace-pre-wrap text-balance">
          {scope && (
            <>
              <span className="text-2xl">{scope}</span>
              <br />
            </>
          )}
          <span className=" break-balance max-w-[12ch] font-semibold  leading-6">
            <span className="text-4xl">{scopedPackageName}</span>
            <h2 className="mt-2 inline-block py-1 px-3 bg-purple-950 rounded-full ml-4">
              {npmPackageInfoResponse.version}
            </h2>
          </span>
        </h1>
      </div>
      <div className="flex gap-2 bg-purple-900/25 rounded-b-xl rounded-t-sm">
        <Link
          href={`https://www.npmjs.com/package/${name}/v/${version}`}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center gap-2 py-2 pr-2 pl-4 w-fit "
        >
          <span className="font-bold">Expand</span>
          <ArrowUpRight size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Page;
