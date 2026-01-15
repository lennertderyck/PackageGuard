// Service Worker for PackageGuard Chrome Extension

let windowId: number | undefined = undefined;

// Helper function to check if URL is npmjs.com
const isNpmjsUrl = (url: string | undefined) => {
    if (!url) return false;
    try {
        return new URL(url).hostname.endsWith("npmjs.com");
    } catch {
        return false;
    }
};

// Helper function to handle side panel visibility
async function handleSidePanelVisibility(tabId: number, windowId: number) {
    const tab = await chrome.tabs.get(tabId);

    if (isNpmjsUrl(tab.url)) {
        // Open side panel if on npmjs.com
        await chrome.sidePanel.open({ windowId });
        console.log("Side panel opened for npmjs.com");
    } else {
        // Close side panel if not on npmjs.com
        // Note: Chrome doesn't have a direct close API, but we can set the panel to be tab-specific
        // and it will close when switching away from npmjs tabs
        console.log("Not on npmjs.com, side panel will close automatically");
    }
}

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("PackageGuard extension installed");
    } else if (details.reason === "update") {
        console.log(
            "PackageGuard extension updated to version",
            chrome.runtime.getManifest().version
        );
    }
    chrome.contextMenus.create({
        id: "OPEN_SIDE_PANEL",
        title: "Inspect with PackageGuard",
        contexts: ["all"]
    });
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async function (activeInfo) {
    windowId = activeInfo.windowId;
    await handleSidePanelVisibility(activeInfo.tabId, activeInfo.windowId);
});

// Listen for tab URL updates (navigation within a tab)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Only proceed if the URL has changed and the tab is active
    if (changeInfo.url && tab.active && tab.windowId) {
        await handleSidePanelVisibility(tabId, tab.windowId);
    }
});

// to receive messages from popup script
chrome.runtime.onMessage.addListener((message) => {
    (async () => {
        console.log("Message received in service worker:", message, {
            windowId
        });
        if (message.action === "OPEN_SIDE_PANEL" && windowId !== undefined) {
            chrome.sidePanel.open({ windowId: windowId });
        } else if (!windowId) {
            console.log("Window ID is undefined, cannot open side panel");
        }
    })();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "OPEN_SIDE_PANEL") {
        // This will open the panel in all the pages on the current window.
        chrome.sidePanel.open({ windowId: tab?.windowId || 0 });
    }
});
