import React from "react";

const Avatar = ({ src, alt, size = 50, fallback = "?" }) => {
  const numericSize = Number(size) || 50; // fallback to 50 if invalid
  const styles = {
    width: numericSize,
    height: numericSize,
    borderRadius: "50%",
    objectFit: "cover",
    display: "inline-block",
    backgroundColor: "#ccc",
    color: "#fff",
    fontSize: numericSize / 2.5,
    textAlign: "center",
    lineHeight: `${numericSize}px`,
    fontWeight: "bold",
  };

  return src ? (
    <img src={src} alt={alt || "Avatar"} style={styles} />
  ) : (
    <div style={styles}>{fallback}</div>
  );
};


export default Avatar;
