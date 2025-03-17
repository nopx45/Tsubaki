import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import ConfigRoutes from "./routes";
import { AuthProvider } from "./pages/authentication/contexts/authcontext";
import "./App.css";
import { StartPageVisit } from "./services/https";

const StartPageVisits = async (pagePath: string) => {
  try {
    await StartPageVisit(pagePath);
  } catch (error) {
  }
};

const PageVisitLogger = () => {
  const location = useLocation();

  useEffect(() => {
    StartPageVisits(location.pathname);
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <PageVisitLogger /> 
        <ConfigRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;