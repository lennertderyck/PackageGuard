import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const App = () => {
    const [height, setHeight] = useState(0);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        chrome.tabs.query(
            { active: true, currentWindow: true, lastFocusedWindow: true },
            (tabs) => {
                const activeTab = tabs[0];
                const activeURL = activeTab?.url;

                if (activeURL) {
                    setUrl(activeURL);
                }
            }
        );
        chrome.runtime.onMessage.addListener((message) => {
            console.log("Received message in side panel:", message);
            (async () => {
                setUrl(message.url);
            })();
        });
    }, []);

    if (!url) {
        return <div>Loading...</div>;
    }
    return (
        <iframe
            src={`http://packageguard.jung.gent/s/u?source=${encodeURIComponent(
                url || ""
            )}&t=sidepanel`}
            style={{ width: "100%", height: height + "px", border: "none" }}
            onLoad={() => setHeight(window.document.body.clientHeight)}
            onLoadStart={console.log}
        />
    );
};

createRoot(document.body!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
