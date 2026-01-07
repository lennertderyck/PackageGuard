import { FC } from "react";

const BadgeContent: FC = () => {
    return (
        <button
            title={`Visit security status details for this package`}
            style={{
                width: "300px",
                display: "block",
                cursor: "pointer",
                appearance: "none",
                border: "none",
                background: "none"
            }}
            onClick={async () => {
                try {
                    // Try to open side panel first
                    if (chrome?.runtime?.sendMessage) {
                        chrome.runtime.sendMessage({
                            action: "OPEN_SIDE_PANEL",
                            url: window.location.href
                        });
                    } else {
                        throw new Error("Chrome runtime not available");
                    }
                } catch (error) {
                    // Fallback: open in new tab if side panel fails
                    console.log(
                        "Side panel not available, opening in new tab:",
                        error
                    );
                    window.open(
                        "https://packageguard.jung.gent/s/u/?t=info&source=" +
                            encodeURIComponent(window.location.href),
                        "_blank"
                    );
                }
            }}
        >
            <img
                src={
                    "https://packageguard.jung.gent/s/u/?t=badge&source=" +
                    encodeURIComponent(window.location.href)
                }
                style={{ width: "100%", display: "block" }}
            />
        </button>
    );
};

export default BadgeContent;
