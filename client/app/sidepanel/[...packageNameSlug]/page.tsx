import { getPackageInfoFromUrl } from "@/src/lib/utils/parsers";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Props {}

const Page: FC<{
  params: Promise<{ packageNameSlug: string[] }>;
}> = async ({ params }) => {
  const { packageNameSlug } = await params;
  const packagePath = packageNameSlug.join("/");
  const packageInfoFromSlug = getPackageInfoFromUrl(`/package/${packagePath}`);

  console.log(packageInfoFromSlug);

  return (
    <div className="p-1 flex flex-col justify-between h-screen">
      <div className="bg-purple-900/25 p-5 rounded-t-xl rounded-b-sm">
        <h1 className="whitespace-pre-wrap text-balance">
          {packageInfoFromSlug?.scope && (
            <>
              <span className="text-2xl">{packageInfoFromSlug?.scope}</span>
              <br />
            </>
          )}
          <span className=" break-balance max-w-[12ch] font-semibold  leading-6">
            <span className="text-4xl">{packageInfoFromSlug?.name.scoped}</span>
            <h2 className="mt-2 inline-block py-1 px-3 bg-purple-950 rounded-full ml-4">
              {packageInfoFromSlug?.version}
            </h2>
          </span>
        </h1>
      </div>
      <div className="flex gap-2 bg-purple-900/25 rounded-b-xl rounded-t-sm">
        <Link
          href={`https://www.npmjs.com/package/${packageInfoFromSlug?.packageName}/v/${packageInfoFromSlug?.version}`}
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
