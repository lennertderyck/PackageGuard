"use strict";
// Content script that embeds an image on npmjs.com package pages
Object.defineProperty(exports, "__esModule", { value: true });
const urlpattern_polyfill_1 = require("urlpattern-polyfill");
(function () {
    "use strict";
    /**
     * In case you want to replace an existing implementation with the polyfill:
     */
    // @ts-ignore
    globalThis.URLPattern = urlpattern_polyfill_1.URLPattern;
    const init = () => {
        // Get the package name from the URL
        const packageInfo = getPackageInfoFromUrl();
        if (!packageInfo) {
            console.log("Could not determine package name");
            return;
        }
        // Find a good location to insert the badge
        const targetElement = findTargetElement();
        if (!targetElement) {
            return;
        }
        targetElement.style.position = "relative";
        // Create and insert the badge
        embedBadge(targetElement, packageInfo.name);
    };
    // Wait for the DOM to be fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    }
    else {
        init();
    }
    const getPackageInfoFromUrl = () => {
        const pathMatcher = new urlpattern_polyfill_1.URLPattern({
            pathname: "/package/:name(/v/:version)?"
        });
        const result = pathMatcher.exec(window.location.href);
        const groups = result?.pathname.groups;
        if (!groups || !groups.name)
            return null;
        else {
            return {
                name: groups.name,
                version: groups?.version || null
            };
        }
    };
    function findTargetElement() {
        // Try to find the package header or sidebar
        // npmjs.com structure: look for the package title area
        const selector = "#top > div.w-100.ph0-l.ph3.ph4-m";
        const element = document.querySelector(selector);
        return element || document.body;
    }
    function embedBadge(targetElement, packageName) {
        // Create a container for the badge
        const badgeContainer = document.createElement("div");
        badgeContainer.id = "aikido-safe-package-badge";
        badgeContainer.style.width = "300px";
        badgeContainer.style.position = "absolute";
        badgeContainer.style.top = "50%";
        badgeContainer.style.transform = "translateY(-50%)";
        badgeContainer.style.right = "0px";
        // Create the image element
        const badgeImage = document.createElement("img");
        badgeImage.src = `https://aikido-safe-package.vercel.app/badge/${packageName}/badge.svg`;
        badgeImage.alt = "Aikido Security Badge";
        badgeImage.style.width = "100%";
        badgeImage.style.display = "block";
        // Add a title/tooltip
        badgeImage.title = `Security status for ${packageName}`;
        // Optional: Make it clickable to show more info
        badgeContainer.addEventListener("click", () => {
            console.log("Badge clicked for package:", packageName);
            // You could open a popup or redirect to more detailed security info
            window.open(`https://aikido-safe-package.vercel.app/status/${packageName}`, "_blank");
        });
        badgeContainer.appendChild(badgeImage);
        // Insert the badge at the beginning of the target element
        if (targetElement.firstChild) {
            targetElement.insertBefore(badgeContainer, targetElement.firstChild);
        }
        else {
            targetElement.appendChild(badgeContainer);
        }
    }
})();
