import { lazy } from "react";
import { RouteObject, useNavigate } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import ITKnowledgeCreate from "../pages/adminpage/it-knowledge/create";
import AnnouncementCreate from "../pages/adminpage/announcement/create";
import AnnouncementEdit from "../pages/adminpage/announcement/edit";

const NotPage = Loadable(lazy(() => import("../pages/notpage")));

const FullLayout = Loadable(lazy(() => import("../layout/AdminLayout")));
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/adminpage/dashboard")));
const Customer = Loadable(lazy(() => import("../pages/adminpage/customer")));
const CreateCustomer = Loadable(lazy(() => import("../pages/adminpage/customer/create")));
const EditCustomer = Loadable(lazy(() => import("../pages/adminpage/customer/edit")));
const File = Loadable(lazy(() => import("../pages/adminpage/file")));
const UploadFile = Loadable(lazy(() => import("../pages/adminpage/file/create")));
const ITKnowledges = Loadable(lazy(() => import("../pages/adminpage/it-knowledge")));
const EditITKnowledges = Loadable(lazy(() => import("../pages/adminpage/it-knowledge/edit")));
const Announcement = Loadable(lazy(() => import("../pages/adminpage/announcement")));
const Activity = Loadable(lazy(() => import("../pages/adminpage/activity")));
const ActivityCreate = Loadable(lazy(() => import("../pages/adminpage/activity/create")));
const ActivityEdit = Loadable(lazy(() => import("../pages/adminpage/activity/edit")));
const Article = Loadable(lazy(() => import("../pages/adminpage/article")));
const ArticleCreate = Loadable(lazy(() => import("../pages/adminpage/article/create")));
const ArticleEdit = Loadable(lazy(() => import("../pages/adminpage/article/edit")));
const Regulation = Loadable(lazy(() => import("../pages/adminpage/regulation")));
const RegulationCreate = Loadable(lazy(() => import("../pages/adminpage/regulation/create")));
const RegulationEdit = Loadable(lazy(() => import("../pages/adminpage/regulation/edit")));

//logs
const LogVisitor = Loadable(lazy(() => import("../pages/adminpage/logs/visitor_logs")));
const LogUserSocket = Loadable(lazy(() => import("../pages/adminpage/logs/user_socket_log")));

const UploadFileWrapper = () => {
  const navigate = useNavigate();

  return (
    <UploadFile
      onUploadSuccess={() => navigate("/admin/file")}
      onClose={() => navigate("/admin/file")}
    />
  );
};

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
  return {
    path: "/admin",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "customer",
        children: [
          {
            index: true,
            element: <Customer />,
          },
          {
            path: "create",
            element: <CreateCustomer />,
          },
          {
            path: "edit/:id",
            element: <EditCustomer />,
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
        path: "it-knowledge",
        children: [
          {
            index: true,
            element: <ITKnowledges />,
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
            element: <ActivityEdit />,
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
        path: "log-visitor",
        element: <LogVisitor />,
      },
      {
        path: "log-user-socket",
        element: <LogUserSocket />,
      },
      {
        path: "*",
        element: <NotPage />, 
      },
    ],
  };
};


export default AdminRoutes;
