import { getPackageInfoFromUrl } from "@/lib/utils";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const App = () => {
    const [height, setHeight] = useState(0);
    const [packageInfo, setPackageInfo] = useState<{
        name: string;
        version: string | null;
        parsed: string;
    } | null>(null);

    useEffect(() => {
        chrome.tabs.query(
            { active: true, currentWindow: true, lastFocusedWindow: true },
            (tabs) => {
                const activeTab = tabs[0];
                const activeURL = activeTab?.url;

                if (activeURL) {
                    setPackageInfo(
                        getPackageInfoFromUrl(new URL(activeURL).pathname)
                    );
                }
            }
        );
        chrome.runtime.onMessage.addListener((message) => {
            (async () => {
                setPackageInfo(message.packageInfo);
            })();
        });
    }, []);

    if (!packageInfo) {
        return <div>Loading...</div>;
    }
    return (
        <iframe
            src={`http://localhost:3000/sidepanel/package?name=${encodeURIComponent(
                packageInfo.name
            )}&version=${encodeURIComponent(packageInfo.version || "latest")}`}
            style={{ width: "100%", height: height + "px", border: "none" }}
            onLoad={() => setHeight(window.document.body.clientHeight)}
        />
    );
};

createRoot(document.body!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
