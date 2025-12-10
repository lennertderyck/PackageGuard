import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface Props {}

const Page: FC<{
  searchParams: Promise<{ name: string; version: string }>;
}> = async ({ searchParams }) => {
  console.log("Sidepanel package page loaded with params:", await searchParams);

  const { name, version = "latest" } = await searchParams;

  return (
    <div className="p-1 flex flex-col justify-between h-screen">
      <div className="bg-purple-900/25 p-3 rounded-t-xl rounded-b-sm">
        <h1 className="text-lg">
          <span className="font-bold">{name}</span>
          <span>/{version}</span>
        </h1>
      </div>
      <Link
        href={`https://www.npmjs.com/package/${name}/v/${version}`}
        target="_blank"
        rel="noreferrer"
        className="flex justify-end gap-2 bg-purple-900/25 p-3 rounded-b-xl rounded-t-sm"
      >
        <span className="font-bold">Expand</span>
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );
};

export default Page;
