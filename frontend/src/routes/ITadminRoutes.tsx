import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import Carlendar from "../pages/adminpage/carlendar";
import Dashboard from "../pages/adminpage/dashboard";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const FullLayout = Loadable(lazy(() => import("../layout/ITadminLayout")));
const ITKnowledge = Loadable(lazy(() => import("../pages/adminpage/it-knowledge")));
const ITKnowledgeCreate = Loadable(lazy(() => import("../pages/adminpage/it-knowledge/create")));
const EditITKnowledges = Loadable(lazy(() => import("../pages/adminpage/it-knowledge/edit")));

const Security = Loadable(lazy(() => import("../pages/adminpage/security")));
const EditSecurity = Loadable(lazy(() => import("../pages/adminpage/security/edit")));
const SecurityCreate = Loadable(lazy(() => import("../pages/adminpage/security/create")));

const ITadminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: "admin/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
        {
            path: "it-knowledge",
            children: [
                {
                index: true,
                element: <ITKnowledge />,
                },
                {
                path: "create",
                element: <ITKnowledgeCreate />,
                },
                {
                path: "edit/:id",
                element: <EditITKnowledges />,
                },
            ],
        },
        {
          path: "security",
          children: [
            {
              index: true,
              element: <Security />,
            },
            {
              path: "create",
              element: <SecurityCreate />,
            },
            {
              path: "edit/:id",
              element: <EditSecurity />,
            },
          ],
        },
        {
          path: "calendar",
          element: <Carlendar />,
        },
        {
            path: "*",
            element: <NotPage />, 
          },
    ],
  };
};

export default ITadminRoutes;
