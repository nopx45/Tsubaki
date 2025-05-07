import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import UserLayout from "../layout/UserLayout";
import ITKnowledge from "../pages/userpages/it-knowledge";
import Announcement from "../pages/userpages/announcement";
import Activity from "../pages/userpages/activity";
import ActivityDetails from "../pages/adminpage/activity/indetail";
import ActivityAllImages from "../pages/userpages/activity/all-image/aImage";
import Article from "../pages/userpages/article";
import ArticleDetails from "../pages/userpages/article/indetail";
import Security from "../pages/userpages/security";
import Calendar from "../pages/userpages/carlendar";
import ITKnowledgeDetail from "../pages/userpages/it-knowledge/detail/detail";

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
            },
            {
              path: "detail/:id",
              element: <ITKnowledgeDetail />,
            },
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
            {
              path: "detail/all-images/:id",
              element: <ActivityAllImages />,
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
          path: "security",
          children: [
            {
              index: true,
              element: <Security />,
            }
          ],
        },
        {
          path: "calendar",
          children: [
            {
              index: true,
              element: <Calendar />,
            }
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