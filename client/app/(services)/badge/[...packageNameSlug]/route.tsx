import {
  getAikidoMalwarePredictionForPackage,
  getGithubAdvisoryResultForPackage,
  getNpmPackageInfo
} from "@/src/lib/queries";
import dayjs from "dayjs";
import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import satori from "satori";
import { getPackageInfoFromUrl } from "../../../../src/lib/utils/parsers";

// - I am a developer -> redirect
// - I am not a developer ->
//  lies.
//  (what where you doing on NPM then?)

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ packageNameSlug: string[] }> }
) => {
  const { packageNameSlug } = await params;

  const fontPath = path.join(
    process.cwd(),
    "src/assets/fonts/AlbertSans-Medium.ttf"
  );

  const joinedPackageName = packageNameSlug.slice(0, -1).join("/");
  const packageInfo = getPackageInfoFromUrl(`/package/${joinedPackageName}`);

  const githubAdvisoryResult = await getGithubAdvisoryResultForPackage(
      packageInfo?.parsed || ""
    ),
    aikidoMalwarePrediction = await getAikidoMalwarePredictionForPackage(
      joinedPackageName
    ),
    npmPackageVersionInfo = await getNpmPackageInfo(packageInfo?.name || ""),
    npmPackageInfo = await getNpmPackageInfo(packageInfo?.name || ""),
    hasGithubAdvisory = githubAdvisoryResult.length > 0,
    hasAikidoMalwarePrediction = !!aikidoMalwarePrediction,
    updatedAt = npmPackageInfo.time[npmPackageVersionInfo.version],
    packageIsOlderThan24h = dayjs().diff(dayjs(updatedAt), "hour") > 24;

  const factors = [
    {
      descr: "Vulnerabilities found",
      condition: hasGithubAdvisory || hasAikidoMalwarePrediction
    },
    {
      descr: "Less than 24h old",
      condition: !packageIsOlderThan24h
    }
  ];

  const factor = factors.filter((factor) => factor.condition === true);
  const isSafe = factor.length === 0;
  const label =
    factor.length === 0
      ? "No advisories found"
      : factor.length === 1
      ? factor[0].descr
      : "Vulnerabilities found";

  const fontData = readFileSync(fontPath);
  const svg = await satori(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: "Roboto",
        fontWeight: 400,
        color: "white",
        backgroundColor: "#010023",
        borderRadius: 9999
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        {!isSafe && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={32}
            height={32}
            fill="currentColor"
            style={{ marginLeft: 20, marginRight: 10 }}
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>
        )}
        {isSafe && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={32}
            height={32}
            fill="currentColor"
            style={{ marginLeft: 20, marginRight: 10 }}
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
          </svg>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Albert Sans",
            fontWeight: 500,
            fontSize: 32
          }}
        >
          {label}
        </div>
        <div
          style={{
            height: 30,
            width: 2,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: "grey"
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "lightgray", fontSize: 10, marginBottom: 4 }}>
            Sourced from
          </span>
          <img
            src={
              "https://cdn.prod.website-files.com/642adcaf364024552e71df01/642adcaf364024281f71df43_Logo-Full.svg"
            }
            width={75}
          />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={32}
          height={32}
          fill="darkgray"
          style={{ marginLeft: 16, marginRight: 20 }}
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      </div>
    </div>,
    {
      height: 100,
      fonts: [
        {
          name: "Albert Sans",
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: fontData,
          weight: 500,
          style: "normal"
        }
      ]
    }
  );

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" }
  });
};
