import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import UserLayout from "../layout/UserLayout";
import ITKnowledge from "../pages/userpages/it-knowledge";
import Announcement from "../pages/userpages/announcement";
import Activity from "../pages/userpages/activity";
import ActivityDetails from "../pages/adminpage/activity/indetail";
import Article from "../pages/userpages/article";
import ArticleDetails from "../pages/userpages/article/indetail";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const MainPages = Loadable(lazy(() => import("../pages/userpages/dashboard/index")));
const RegisterPages = Loadable(lazy(() => import("../pages/authentication/Register")));
const SignInPages = Loadable(lazy(() => import("../pages/authentication/Login")));

const MainRoutes = (): RouteObject[] => {
  return [
    {
      path: "/signin",
      element: <SignInPages />,
    },
    {
      path: "/signup",
      element: <RegisterPages />,
    },
    {
      path: "/",
      element: <UserLayout />,
      children: [
        {
          path: "/",
          element: <MainPages />,
        },
        {
          path: "*",
          element: <MainPages />,
        },
        {
          path: "it-knowledge",
          children: [
            {
              index: true,
              element: <ITKnowledge />,
            }
          ],
        },
        {
          path: "announcement",
          children: [
            {
              index: true,
              element: <Announcement />,
            }
          ],
        },
        {
          path: "activity",
          children: [
            {
              index: true,
              element: <Activity />,
            },
            {
              path: "detail/:id",
              element: <ActivityDetails />,
            },
          ],
        },
        {
          path: "article",
          children: [
            {
              index: true,
              element: <Article />,
            },
            {
              path: "detail/:id",
              element: <ArticleDetails />,
            },
          ],
        },
        {
          path: "*",
          element: <NotPage />, 
        },
      ],
    },
  ];
};

export default MainRoutes;