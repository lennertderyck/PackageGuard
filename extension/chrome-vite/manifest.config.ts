import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
    name: pkg.name,
    version: pkg.version,
    description: "Embeds safety badges on npmjs.com package pages",
    manifest_version: 3,
    // icons: {
    //     48: "public/logo.png"
    // },
    action: {
        default_icon: {
            48: "public/logo.png"
        },
        default_title: "PackageGuard"
    },
    permissions: [
        "sidePanel",
        "contentSettings",
        "contextMenus",
        "activeTab",
        "tabs"
    ],
    side_panel: {
        default_path: "src/sidepanel/index.html"
    },
    content_scripts: [
        {
            matches: ["https://www.npmjs.com/package/*"],
            js: ["./src/content/content.tsx"]
        }
        // {
        //     js: ["src/content/main.tsx"],
        //     matches: ["https://*/*"]
        // }
    ],
    web_accessible_resources: [
        // {
        //     resources: ["badge.png"],
        //     matches: ["https://www.npmjs.com/*"]
        // }
    ],
    background: {
        service_worker: "./src/background/service-worker.ts",
        type: "module"
    }
});
