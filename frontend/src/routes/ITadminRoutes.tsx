import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const FullLayout = Loadable(lazy(() => import("../layout/ITadminLayout")));
const ITKnowledge = Loadable(lazy(() => import("../pages/adminpage/it-knowledge")));
const ITKnowledgeCreate = Loadable(lazy(() => import("../pages/adminpage/it-knowledge/create")));
const EditITKnowledges = Loadable(lazy(() => import("../pages/adminpage/it-knowledge/edit")));

const ITadminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: "admin/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
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
            path: "*",
            element: <NotPage />, 
          },
    ],
  };
};

export default ITadminRoutes;
