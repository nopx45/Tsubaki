import { lazy } from "react";
import { RouteObject} from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import UserLayout from "../layout/UserLayout";
import ITKnowledge from "../pages/userpages/it-knowledge";
import Announcement from "../pages/userpages/announcement";
import Activity from "../pages/userpages/activity";
import ActivityDetails from "../pages/adminpage/activity/indetail";
import Article from "../pages/userpages/article";
import Security from "../pages/userpages/security";
import ArticleDetails from "../pages/userpages/article/indetail";
import ChangePassword from "../pages/authentication/change-password";
import UserProfile from "../pages/userpages/profile";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/userpages/dashboard")));

const UserRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: "/change-password",
      element: <ChangePassword />,
    },
    {
    path: "/",
    element: isLoggedIn ? <UserLayout /> : <MainPages />,
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
        path: "security",
        children: [
          {
            index: true,
            element: <Security />,
          }
        ],
      },
      {
        path: "profile",
        children: [
          {
            index: true,
            element: <UserProfile />,
          }
        ],
      },
      {
        path: "*",
        element: <NotPage />, 
      },
   ]},
  ];
};


export default UserRoutes;
