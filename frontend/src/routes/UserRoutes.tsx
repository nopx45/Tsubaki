import { lazy } from "react";
import { RouteObject} from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import UserLayout from "../layout/UserLayout";
import Announcement from "../pages/userpages/announcement";
import Activity from "../pages/userpages/activity";
import ActivityDetails from "../pages/adminpage/activity/indetail";
import Article from "../pages/userpages/article";
import Security from "../pages/userpages/security";
import ArticleDetails from "../pages/userpages/article/indetail";
import ChangePassword from "../pages/authentication/change-password";
import UserProfile from "../pages/userpages/profile";
import Calendar from "../pages/userpages/carlendar";
import ActivityAllImages from "../pages/userpages/activity/all-image/aImage";
import ITKnowledgeDetail from "../pages/userpages/it-knowledge/detail/detail";
import AllITKnowledges from "../pages/userpages/it-knowledge/detail/view_all";
import SecurityDetail from "../pages/userpages/security/detail/detail";
import AllSecurities from "../pages/userpages/security/detail/view_all";
import Training from "../pages/userpages/training";
import TrainingDetail from "../pages/userpages/training/detail/detail";
import AllTrainings from "../pages/userpages/training/detail/view-all";
import AdminITKnowledge from "../pages/userpages/it-knowledge/admin";
import AllAdminITKnowledges from "../pages/userpages/it-knowledge/admin/view_all";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/userpages/dashboard")));
const ITKnowledge = Loadable(lazy(() => import("../pages/userpages/it-knowledge")));

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
          },
          {
            path: "detail/:id",
            element: <ITKnowledgeDetail />,
          },
          {
            path: "all",
            element: <AllITKnowledges />,
          },
          {
              path: "admin",
              element: <AdminITKnowledge />,
          },
          {
              path: "admin/all",
              element: <AllAdminITKnowledges />,
          },
        ],
      },
      {
        path: "training",
        children: [
          {
            index: true,
            element: <Training />,
          },
          {
            path: "detail/:id",
            element: <TrainingDetail />,
          },
          {
            path: "all",
            element: <AllTrainings />,
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
          },
          {
            path: "detail/:id",
            element: <SecurityDetail />,
          },
          {
            path: "all",
            element: <AllSecurities />,
          },
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
   ]},
  ];
};


export default UserRoutes;
