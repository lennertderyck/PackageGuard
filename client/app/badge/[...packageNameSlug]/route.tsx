import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import satori from "satori";

interface PackageAnalysis {
  package_name: string;
  version: string;
  reason: string;
}

// - I am a developer -> redirect
// - I am not a developer ->
//  lies.
//  (what where you doing on NPM then?)

export const GET = async (request: NextRequest, { params }: { params: Promise<{ packageNameSlug: string[] }> }) => {
  const fontPath = path.join(process.cwd(), "src/assets/fonts/AlbertSans-Medium.ttf");

  const { packageNameSlug } = await params;
  const packageName = packageNameSlug.slice(0, -1).join('/')
    
  const packages = await (await fetch('https://malware-list.aikido.dev/malware_predictions.json')).json() as PackageAnalysis[];
  const hasResult = packages.some(p => p.package_name === packageName);
  const isSafe = !hasResult;
  
  const fontData = readFileSync(fontPath);
  const svg = await satori(
    <div style={{ display: "flex", alignItems: 'center', paddingRight: 30, fontFamily: 'Roboto',  fontWeight: 400, color: 'white', backgroundColor: '#010023', borderRadius: 9999 }}>
      <div style={{ display: "flex", alignItems: 'center', paddingTop: 10, paddingBottom: 10}}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        width={32}
        height={32}
        fill="currentColor"
        style={{ marginLeft: 20, marginRight: 10 }}
      >
        {!isSafe ? 
          <>
            <path fill="none" d="M0 0h24v24H0z"></path><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </>:
          <><path fill="none" d="M0 0h24v24H0z"></path><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
          </>
        }
      </svg>
        <div style={{ display: "flex", alignItems: 'center', fontFamily: 'Albert Sans', fontWeight: 500, fontSize: 32 }}>
          Package is {hasResult ? 'malicious' : 'safe'}
        </div>
        <div style={{ height: 30, width: 2, marginLeft: 20, marginRight: 20, backgroundColor: 'grey' }} />
        <div style={{ display: "flex", flexDirection: 'column'}}>
          <span style={{ color: 'lightgray', fontSize: 10, marginBottom: 4}}>Sourced from</span>
          <img src={'https://cdn.prod.website-files.com/642adcaf364024552e71df01/642adcaf364024281f71df43_Logo-Full.svg'} width={75} />
        </div>
      </div>
    </div>,
    {
      height: 100,
      fonts: [{
        name: 'Albert Sans',
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: fontData,
        weight: 500,
        style: 'normal',
      }],
    }
  );
  
  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml" } });
};