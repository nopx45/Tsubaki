import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import ConfigRoutes from "./routes";
import { AuthProvider } from "./pages/authentication/contexts/authcontext";
import "./App.css";
import { getAuthToken, StartPageVisit } from "./services/https";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const apiUrl = "http://localhost:8080";

const PageVisitLogger = () => {
  const location = useLocation();

  useEffect(() => {
    const logVisit = async () => {
      const token = await getAuthToken();
      const excludedPaths = ["/signin", "/login", "/signup"];

      if (token && !excludedPaths.includes(location.pathname)) {
        await StartPageVisit(location.pathname);
      }
    };

    logVisit();
  }, [location.pathname]);

  return null;
};

const ExitListener = () => {
  useEffect(() => {
    localStorage.setItem("exit_sent", "true");
    const handleExit = () => {
      if (localStorage.getItem("exit_sent") === "true") return;
  
      console.log("📤 Sending exit visit...");
      const blob = new Blob([], { type: "application/json" });
      navigator.sendBeacon(`${apiUrl}/exit`, blob);
    };
  
    window.addEventListener("beforeunload", handleExit);
    return () => {
      window.removeEventListener("beforeunload", handleExit);
    };
  }, []);  

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <PageVisitLogger />
        <ConfigRoutes />
        <ExitListener />
      </AuthProvider>
    </Router>
  );
};

export default App;
