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
            onClick={() => {
                window.open(
                    "https://packageguard.jung.gent/s/u/?t=info&source=" +
                        encodeURIComponent(window.location.href),
                    "_blank"
                );
                // chrome.runtime.sendMessage({
                //     action: "OPEN_SIDE_PANEL",
                //     packageInfo: packageInfo
                // });
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
