import {
  getPackageInfoFromUrl,
  PackageNameInfo
} from "@/src/lib/utils/parsers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const DESTINATIONS: Record<string, (input: PackageNameInfo) => string> = {
  badge: (input) =>
    `/badge/${input.packageName}/v/${input.version || "latest"}/badge.svg`,
  info: (input) =>
    `/package/${input.packageName}/v/${input.version || "latest"}`
};

export const GET = async (request: NextRequest) => {
  // Only supports NPM registry pakage url formats for now
  const sourceParameter = request.nextUrl.searchParams.get("source");
  const destinationParameter =
    request.nextUrl.searchParams.get("t") ||
    request.nextUrl.searchParams.get("target");
  const source = sourceParameter ? new URL(sourceParameter) : null;

  if (!source) {
    return Response.json(
      { error: "Missing source parameter" },
      { status: 400 }
    );
  }

  const info = getPackageInfoFromUrl(source.pathname);

  if (!destinationParameter)
    return Response.json(
      {
        source: sourceParameter,
        package: info,
        destination: destinationParameter
      },
      { status: 200 }
    );

  redirect(
    DESTINATIONS[destinationParameter](info!) || DESTINATIONS["info"](info!)
  );
};
