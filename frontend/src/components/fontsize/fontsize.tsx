import { useState, useEffect } from "react";

const useResponsiveFontSize = () => {
  const getFontSize = () => {
    const width = window.innerWidth;
    if (width <= 480) return "10px";
    if (width <= 900) return "12px";
    if (width <= 1024) return "16px";
    return "18px";
  };

  const [fontSize, setFontSize] = useState(getFontSize());

  useEffect(() => {
    const handleResize = () => setFontSize(getFontSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return fontSize;
};

export default useResponsiveFontSize;