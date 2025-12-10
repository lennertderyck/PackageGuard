// Content script that embeds an image on npmjs.com package pages
import { match } from "path-to-regexp";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./content.css";

const packageName = "forever";

const getPackageInfoFromUrl = () => {
    const fn = match("/package/:name{/v/:version}");
    const result = fn(window.location.pathname);

    if (!result) return null;
    else {
        return {
            name: result.params.name,
            version: result.params.version || null,
            parsed:
                result.params.name +
                (result.params.version ? `@${result.params.version}` : "")
        };
    }
};

const container = () => {
    const selector = "#top > div.w-100.ph0-l.ph3.ph4-m";
    const holder = document.querySelector(selector) as HTMLElement | null;
    const container = document.createElement("div");

    if (holder) {
        holder.style.position = "relative";
    }

    container.id = "aikido-safe-package-badge-container";
    container.title = `Security status for ${packageName}`;
    container.style.position = "absolute";
    container.style.top = "50%";
    container.style.transform = "translateY(-50%)";
    container.style.right = "0px";

    return holder?.appendChild(container) || document.body;
};

const packageInfo = getPackageInfoFromUrl();

createRoot(container()!).render(
    <StrictMode>
        <a
            target="_blank"
            rel="noreferrer noopener"
            href={`https://packageguard-jung-gent.vercel.app/package/${
                packageInfo?.name
            }/v/${packageInfo?.version || "latest"}`}
            style={{ width: "300px", display: "block" }}
        >
            <img
                src={`https://packageguard-jung-gent.vercel.app/badge/${
                    packageInfo?.name
                }/v/${packageInfo?.version || "latest"}/badge.svg`}
                style={{ width: "100%", display: "block" }}
            />
        </a>
    </StrictMode>
);
