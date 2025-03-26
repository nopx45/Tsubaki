import { useState, useEffect } from "react";
import { useRoutes, RouteObject } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import MainRoutes from "./MainRoutes";
import ITadminRoutes from "./ITadminRoutes";
import { getAuthToken } from "../services/https";
import HRadminRoutes from "./HRadminRoute";

interface TokenPayload {
  Username: string;
  role: string;
  exp: number;
  iss: string;
}

function ConfigRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isITadmin, setITadmin] = useState(false);
  const [isHRadmin, setHRadmin] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await getAuthToken();
        if (token) {
          const decoded: TokenPayload = jwtDecode(token);
          setIsLoggedIn(true);
          setIsAdmin(decoded.role === "admin");
          setITadmin(decoded.role === "adminit");
          setHRadmin(decoded.role === "adminhr");
        }
      } catch (error) {
        console.error("Invalid Token", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setITadmin(false); 
        setHRadmin(false);
      }
    }
  
    fetchToken();
  }, []);
  
  let routes: RouteObject[] = [];

  if (isLoggedIn) {
    if (isAdmin) {
      routes = [AdminRoutes(isLoggedIn), ...UserRoutes(isLoggedIn)];
    } else if (isITadmin) {
      routes = [ITadminRoutes(isLoggedIn), ...UserRoutes(isLoggedIn)];
    } else if (isHRadmin) {
      routes = [HRadminRoutes(isLoggedIn), ...UserRoutes(isLoggedIn)];
    } else {
      routes = [...UserRoutes(isLoggedIn)];
    }
  } else {
    routes = [...MainRoutes()];
  }

  return useRoutes(routes);
}

export default ConfigRoutes;