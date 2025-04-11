import React, { useEffect } from "react";

const VisitorCounter: React.FC = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://www.freevisitorcounters.com/auth.php?id=456ca8a2de6535e8feca4877a86268c53c0f79d3";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://www.freevisitorcounters.com/en/home/counter/1326277/t/10";
    script2.async = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <a href="http://www.freevisitorcounters.com" target="_blank" rel="noopener noreferrer">
        Free counter
      </a>
    </div>
  );
};

export default VisitorCounter;
