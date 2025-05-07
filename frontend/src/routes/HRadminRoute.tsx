import { lazy } from "react";
import { RouteObject, useNavigate } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import Carlendar from "../pages/adminpage/carlendar";
import Dashboard from "../pages/adminpage/dashboard";
import ITKnowledgeDetail from "../pages/userpages/it-knowledge/detail/detail";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const FullLayout = Loadable(lazy(() => import("../layout/HRadminlayout")));
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const File = Loadable(lazy(() => import("../pages/adminpage/file")));
const UploadFile = Loadable(lazy(() => import("../pages/adminpage/file/create")));
const Activity = Loadable(lazy(() => import("../pages/adminpage/activity")));
const ActivityCreate = Loadable(lazy(() => import("../pages/adminpage/activity/create")));
const EditActivity = Loadable(lazy(() => import("../pages/adminpage/activity/edit")));
const ActivityAllImages = Loadable(lazy(() => import("../pages/userpages/activity/all-image/aImage")));
const Announcement = Loadable(lazy(() => import("../pages/adminpage/announcement")));
const AnnouncementCreate = Loadable(lazy(() => import("../pages/adminpage/announcement/create")));
const AnnouncementEdit = Loadable(lazy(() => import("../pages/adminpage/announcement/edit")));
const Article = Loadable(lazy(() => import("../pages/adminpage/article")));
const ArticleCreate = Loadable(lazy(() => import("../pages/adminpage/article/create")));
const ArticleEdit = Loadable(lazy(() => import("../pages/adminpage/article/edit")));
const Regulation = Loadable(lazy(() => import("../pages/adminpage/regulation")));
const RegulationCreate = Loadable(lazy(() => import("../pages/adminpage/regulation/create")));
const RegulationEdit = Loadable(lazy(() => import("../pages/adminpage/regulation/edit")));
//PopupImage
const PopupImage = Loadable(lazy(() => import("../pages/adminpage/popup-images")));

const HRadminRoutes = (isLoggedIn: boolean): RouteObject => {
    const UploadFileWrapper = () => {
        const navigate = useNavigate();
      
        return (
          <UploadFile
            onUploadSuccess={() => navigate("/admin/file")}
            onClose={() => navigate("/admin/file")}
          />
        );
      };

  return {
    path: "admin/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
            path: "activity",
            children: [
              {
                index: true,
                element: <Activity />,
              },
              {
                path: "create",
                element: <ActivityCreate />,
              },
              {
                path: "edit/:id",
                element: <EditActivity />,
              },
              {
                path: "detail/all-images/:id",
                element: <ActivityAllImages />,
              },
            ],
          },
      {
        path: "file",
        children: [
          {
            index: true,
            element: <File />,
          },
          {
            path: "create",
            element: <UploadFileWrapper />,
          },
        ],
      },
      {
        path: "announcement",
        children: [
          {
            index: true,
            element: <Announcement />,
          },
          {
            path: "create",
            element: <AnnouncementCreate />,
          },
          {
            path: "edit/:id",
            element: <AnnouncementEdit />,
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
            path: "create",
            element: <ArticleCreate />,
          },
          {
            path: "edit/:id",
            element: <ArticleEdit />,
          },
        ],
      },
      {
        path: "popup-images",
        element: <PopupImage />,
      },
      {
        path: "regulation",
        children: [
          {
            index: true,
            element: <Regulation />,
          },
          {
            path: "create",
            element: <RegulationCreate />,
          },
          {
            path: "edit/:id",
            element: <RegulationEdit />,
          },
        ],
      },
      {
        path: "calendar",
        element: <Carlendar />,
      },
      {
        path: "detail/:id",
        element: <ITKnowledgeDetail />,
      },
      {
        path: "*",
        element: <NotPage />, 
      },
    ],
  };
};

export default HRadminRoutes;
