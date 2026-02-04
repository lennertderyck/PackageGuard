import { FC } from "react";

interface Props {}

const Image: FC<Props> = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#010022",
        color: "white",
        padding: 60
      }}
    >
      <div
        style={{
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontSize: "16px",
          marginBottom: "10px",
          fontWeight: 800
        }}
      >
        Vulnerability status
      </div>
      <div style={{ fontSize: 32 }}>@tanstack/query-core</div>
      <div style={{ display: "flex", marginTop: 16 }}>
        <span
          style={{
            display: "flex",
            backgroundColor: "#FFFFFF20",
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
            paddingRight: 16,
            borderRadius: "999"
          }}
        >
          latest
        </span>
      </div>
    </div>
  );
};

export default Image;
