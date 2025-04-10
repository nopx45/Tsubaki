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
const Security = Loadable(lazy(() => import("../pages/adminpage/security")));
const EditSecurity = Loadable(lazy(() => import("../pages/adminpage/security/edit")));
const SecurityCreate = Loadable(lazy(() => import("../pages/adminpage/security/create")));
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
///////////////////////////////
const Central = Loadable(lazy(() => import("../pages/adminpage/central-web")));
const CentralCreate = Loadable(lazy(() => import("../pages/adminpage/central-web/create")));
const CentralEdit = Loadable(lazy(() => import("../pages/adminpage/central-web/edit")));
const Section = Loadable(lazy(() => import("../pages/adminpage/section-web")));
const SectionCreate = Loadable(lazy(() => import("../pages/adminpage/section-web/create")));
const SectionEdit = Loadable(lazy(() => import("../pages/adminpage/section-web/edit")));

//logs
const LogVisitor = Loadable(lazy(() => import("../pages/adminpage/logs/visitor_logs")));
const LogUserSocket = Loadable(lazy(() => import("../pages/adminpage/logs/user_socket_log")));
const LogPageVisitor = Loadable(lazy(() => import("../pages/adminpage/logs/page_visitor_log")));
const LogMessage = Loadable(lazy(() => import("../pages/adminpage/logs/massage_socket_log")));

//Calendar
const Carlendar = Loadable(lazy(() => import("../pages/adminpage/carlendar")));

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
        path: "central-web",
        children: [
          {
            index: true,
            element: <Central />,
          },
          {
            path: "create",
            element: <CentralCreate />,
          },
          {
            path: "edit/:id",
            element: <CentralEdit />,
          },
        ],
      },
      {
        path: "section-web",
        children: [
          {
            index: true,
            element: <Section />,
          },
          {
            path: "create",
            element: <SectionCreate />,
          },
          {
            path: "edit/:id",
            element: <SectionEdit />,
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
        path: "log-page-visitor",
        element: <LogPageVisitor />,
      },
      {
        path: "log-message",
        element: <LogMessage />,
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


export default AdminRoutes;
