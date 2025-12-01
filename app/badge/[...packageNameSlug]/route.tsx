import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import satori from "satori";

interface PackageAnalysis {
  package_name: string;
  version: string;
  reason: string;
}

export const GET = async (request: NextRequest, { params }: { params: { packageNameSlug: string[] } }) => {
  const fontPath = path.join(process.cwd(), "src/assets/fonts/AlbertSans-Medium.ttf");
  
  const { packageNameSlug } = await params;
  const packageName = packageNameSlug.slice(0, -1).join('/')
    
  const packages = await (await fetch('https://malware-list.aikido.dev/malware_predictions.json')).json() as PackageAnalysis[];
  const hasResult = packages.some(p => p.package_name === packageName);
  
  const fontData = readFileSync(fontPath);
  const svg = await satori(
    <div style={{ display: "flex", alignItems: 'center', padding: 20, paddingLeft: 40, paddingRight: 40, fontFamily: 'Roboto', fontSize: 24, fontWeight: 400, color: 'white', backgroundColor: '#010023', borderRadius: 9999 }}>
      <div style={{ display: "flex", alignItems: 'center', fontFamily: 'Albert Sans', fontWeight: 500 }}>
        Package is {hasResult ? 'Malicious' : 'Safe'}
        
      </div>
      <div style={{ height: 40, width: 2, marginLeft: 20, marginRight: 20, backgroundColor: 'grey' }} />
      <div style={{ display: "flex", flexDirection: 'column'}}>
        <span style={{ color: 'lightgray', fontSize: 10, marginBottom: 4}}>Powered by</span>
        <img src={'https://cdn.prod.website-files.com/642adcaf364024552e71df01/642adcaf364024281f71df43_Logo-Full.svg'} width={100} />
      </div>
    </div>,
    {
      width: 1000,
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