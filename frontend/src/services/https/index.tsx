import { AnnouncementsInterface } from "../../interfaces/IAnnouncement";
import { ChangePasswordInterface } from "../../interfaces/IChangePassword";
import { EventInterface } from "../../interfaces/IEvent";
import { FilesInterface } from "../../interfaces/IFile";
import { FormsInterface } from "../../interfaces/IForm";
import { LinksInterface } from "../../interfaces/ILink";
import { SectionsInterface } from "../../interfaces/ISection";
import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import axios from "axios";
import Swal from "sweetalert2";

export const apiUrl = "http://localhost:8080";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  response => response,
  error => {
    console.log(error.response?.data?.error)
    if (error.response?.data?.error === "SessionExpired") {
      Swal.fire({
        icon: "warning",
        title: "Session หมดอายุ",
        text: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#3085d6"
      }).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href=("/");
        Logouts();
      });
    }

    return Promise.reject(error);
  }
);

async function getAuthToken() {
  try {
    const response = await axios.get(`${apiUrl}/auth/token`);
    return response.data.token;
  } catch (error) {
    return null;
  }
}

async function GetProfile() {
  try {
    const response = await axios.get(`${apiUrl}/profile`, {
      withCredentials: true,
    })
    return response.data;
  } catch (error) {
    return null;
  }
}

async function Logouts() {
  try {
    const response = await axios.get(`${apiUrl}/logout`);
    return response.data;
  } catch (error) {
    return null;
  }
}

async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, {
      withCredentials: true,
    })
    .then((res) => res)
    .catch((e) => e.response);
}

async function ChangesPassword(data: ChangePasswordInterface) {
  return await axios
    .post(`${apiUrl}/change-password`, data, {
      withCredentials: true,
    })
    .then((res) => res)
    .catch((e) => e.response);
}

async function AutoLogin() {
  return await axios
  .post(`${apiUrl}/auto/login`, {
    withCredentials: true,
  })
  .then((res) => res)
  .catch((e) => e.response);
}

async function GetUsers() {
  return await axios
    .get(`${apiUrl}/users`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetNUsers() {
  return await axios
    .get(`${apiUrl}/nusers`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsersById(id: string) {
  return await axios
    .get(`${apiUrl}/user/${id}`, { withCredentials: true })
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateUsersById(id: string, data: Partial<UsersInterface>) {
  return await axios
    .put(`${apiUrl}/user/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteUsersById(id: string) {
  return await axios
    .delete(`${apiUrl}/user/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UploadFile(data: FormData) {
  return await axios
    .post(`${apiUrl}/upload`, data, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("Upload error:", e.response?.data);
      throw new Error(e.response?.data?.error || "Failed to upload file");
    });
}


async function GetFiles(): Promise<FilesInterface[]> {
  return await axios
    .get(`${apiUrl}/files`)
    .then((res) => res.data)
    .catch((e) => {
      throw new Error(e.response?.data?.error || "Failed to fetch files");
    });
}

async function GetFilesById(id: string) {
  return await `${apiUrl}/file/${id}`;
}

async function UpdateFilesById(id: string, data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/file/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteFilesById(id: string) {
  return await axios
    .delete(`${apiUrl}/file/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DownloadFile(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/downloadfile/${id}`, {
      withCredentials: true, responseType: "blob",
    });

    return response.data;
  } catch (e: any) {
    console.error("Download error:", e.response?.data);
    throw new Error(e.response?.data?.error || "Failed to download file");
  }
}

async function GetAnnouncements() {
  return await axios
    .get(`${apiUrl}/announcements`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAnnouncementsById(id: string) {
  return await axios
    .get(`${apiUrl}/announcement/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateAnnouncementsById(id: string, data: AnnouncementsInterface) {
  return await axios
    .put(`${apiUrl}/announcement/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteAnnouncementsById(id: string) {
  return await axios
    .delete(`${apiUrl}/announcement/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateAnnouncement(data: AnnouncementsInterface) {
  return await axios
    .post(`${apiUrl}/announcement`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetActivities() {
  return await axios
    .get(`${apiUrl}/activities`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetActivitiesById(id: string) {
  return await axios
    .get(`${apiUrl}/activity/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateActivitiesById(id: string, data: FormData) {
  return await axios
    .put(`${apiUrl}/activity/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteActivitiesById(id: string) {
  return await axios
    .delete(`${apiUrl}/activity/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateActivity(data: FormData) {
  try {
    const res = await axios.post(`${apiUrl}/activity`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e: any) {
    console.error("Upload error:", e.response?.data);
    return e.response?.data || { error: "Unknown error occurred" };
  }
}

async function GetArticles() {
  return await axios
    .get(`${apiUrl}/articles`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetArticlesById(id: string) {
  return await axios
    .get(`${apiUrl}/article/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateArticlesById(id: string, data: FormData) {
  return await axios
    .put(`${apiUrl}/article/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteArticlesById(id: string) {
  return await axios
    .delete(`${apiUrl}/article/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateArticle(data: FormData) {
  try {
    const res = await axios.post(`${apiUrl}/article`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e: any) {
    console.error("Upload error:", e.response?.data);
    return e.response?.data || { error: "Unknown error occurred" };
  }
}

async function GetKnowledges() {
  return await axios
    .get(`${apiUrl}/knowledges`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetKnowledgesById(id: string) {
  return await axios
    .get(`${apiUrl}/knowledge/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateKnowledgesById(id: string, data: FormData) {
  return await axios
    .put(`${apiUrl}/knowledge/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteKnowledgesById(id: string) {
  return await axios
    .delete(`${apiUrl}/knowledge/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateKnowledge(data: FormData) {
  try {
    const res = await axios.post(`${apiUrl}/knowledge`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e: any) {
    console.error("Upload error:", e.response?.data);
    return e.response?.data || { error: "Unknown error occurred" };
  }
}

async function GetSecurity() {
  return await axios
    .get(`${apiUrl}/securities`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetSecurityById(id: string) {
  return await axios
    .get(`${apiUrl}/security/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateSecurityById(id: string, data: FormData) {
  return await axios
    .put(`${apiUrl}/security/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteSecurityById(id: string) {
  return await axios
    .delete(`${apiUrl}/security/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateSecurity(data: FormData) {
  try {
    const res = await axios.post(`${apiUrl}/security`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e: any) {
    console.error("Upload error:", e.response?.data);
    return e.response?.data || { error: "Unknown error occurred" };
  }
}

async function GetSections() {
  return await axios
    .get(`${apiUrl}/sections`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetSectionsById(id: string) {
  return await axios
    .get(`${apiUrl}/section/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateSectionsById(id: string, data: SectionsInterface) {
  return await axios
    .put(`${apiUrl}/section/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteSectionsById(id: string) {
  return await axios
    .delete(`${apiUrl}/section/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateSection(data: SectionsInterface) {
  return await axios
    .post(`${apiUrl}/section`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetLinks() {
  return await axios
    .get(`${apiUrl}/links`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetLinksById(id: string) {
  return await axios
    .get(`${apiUrl}/link/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateLinksById(id: string, data: LinksInterface) {
  return await axios
    .put(`${apiUrl}/link/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteLinksById(id: string) {
  return await axios
    .delete(`${apiUrl}/link/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateLink(data: LinksInterface) {
  return await axios
    .post(`${apiUrl}/link`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetForms() {
  return await axios
    .get(`${apiUrl}/forms`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetFormsById(id: string) {
  return await axios
    .get(`${apiUrl}/form/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateFormsById(id: string, data: FormsInterface) {
  return await axios
    .put(`${apiUrl}/form/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteFormsById(id: string) {
  return await axios
    .delete(`${apiUrl}/form/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateForm(data: FormsInterface) {
  return await axios
    .post(`${apiUrl}/form`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetRegulations() {
  return await axios
    .get(`${apiUrl}/regulations`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetRegulationsById(id: string) {
  return await axios
    .get(`${apiUrl}/regulation/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateRegulationsById(id: string, data: FormData) {
  return await axios
    .put(`${apiUrl}/regulation/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DownloadRegulation(id: string) {
  return await axios
    .get(`${apiUrl}/downloadregulation/${id}`, {
      responseType: "blob",
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("Download error:", e.response?.data);
      throw new Error(e.response?.data?.error || "Failed to download file");
    });
}

async function DeleteRegulationsById(id: string) {
  return await axios
    .delete(`${apiUrl}/regulation/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateRegulation(data: FormData) {
  return await axios
    .post(`${apiUrl}/regulation`, data, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("Upload error:", e.response?.data);
      throw new Error(e.response?.data?.error || "Failed to upload file");
    });
}

async function startvisit() {
  return await axios
    .post(`${apiUrl}/visit`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function stopvisit() {
  return await axios
    .post(`${apiUrl}/exit`, null, { withCredentials: true })
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTotalVisitors() {
  return await axios
    .get(`${apiUrl}/visitors`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTopVisitors(month: number, year: number) {
  return await axios
    .get(`${apiUrl}/topvisitors?month=${month}&year=${year}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllTotalVisitors() {
  return await axios
    .get(`${apiUrl}/allvisitors`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAvgDuration() {
  return await axios
    .get(`${apiUrl}/avg-duration`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteVisitorsById(id: string) {
  return await axios
    .delete(`${apiUrl}/visit/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

const StartPageVisit = async (pagePath: string) => {
  try {
    await axios.post(`${apiUrl}/pagevisitors`, { pagePath ,withCredentials: true});
  } catch (error) {
  }
};

async function GetAllPageVisitors() {
  return await axios
    .get(`${apiUrl}/pagevisitors`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTopPageVisitors(month: number, year: number) {
  return await axios
    .get(`${apiUrl}/toppagevisitors?month=${month}&year=${year}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeletePageVisitorsById(id: string) {
  return await axios
    .delete(`${apiUrl}/pagevisit/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUserSockets() {
  return await axios
    .get(`${apiUrl}/usersockets`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUserSocketsById(id: string) {
  return await axios
    .get(`${apiUrl}/usersocket/${id}`, { withCredentials: true })
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUserByUsername(username: string) {
  try {
      const response = await axios.get(`${apiUrl}/usersocket/${username}`);
      return response.data; // คืนค่าข้อมูลผู้ใช้
  } catch (error) {
      console.error("Error fetching user:", error);
      return null; // ถ้าเกิดข้อผิดพลาดหรือไม่พบผู้ใช้ ให้คืนค่า null
  }
};

async function DeleteUserSocketsById(id: string) {
  return await axios
    .delete(`${apiUrl}/usersocket/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMessages() {
  return await axios
    .get(`${apiUrl}/messages`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMessagesById(id: string) {
  return await axios
    .get(`${apiUrl}/message/${id}`, { withCredentials: true })
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteMessagesById(id: string) {
  return await axios
    .delete(`${apiUrl}/message/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

// Calendar
async function UploadICS(data: FormData) {
  return await axios
    .post(`${apiUrl}/upload-ics`,data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetEvents() {
  return await axios
    .get(`${apiUrl}/events`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateEvents(id: string, data: EventInterface) {
  return await axios
    .put(`${apiUrl}/event/${id}`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteEvents(id: string) {
  return await axios
    .delete(`${apiUrl}/event/${id}`)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateEvents(data: EventInterface) {
  return await axios
    .post(`${apiUrl}/event`, data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetMarquee() {
  try {
    const res = await axios.get(`${apiUrl}/marquee`);
    return {
      success: true,
      message: res.data.message,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.response?.data?.error || "โหลดข้อความไม่สำเร็จ",
    };
  }
}

async function UpdateMarquee(message: string) {
  try {
    const res = await axios.post(`${apiUrl}/marquee`, { message });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.response?.data?.error || "เกิดข้อผิดพลาด",
    };
  }
}

async function GetPopupImages() {
  try {
    const res = await axios.get(`${apiUrl}/popup`);
    if (res.status === 200) {
      return { success: true, image: res.data.image };
    } else {
      return { success: false, error: res.data.error || "เกิดข้อผิดพลาด" };
    }
  } catch (err) {
    return { success: false, error: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" };
  }
}

async function UploadPopupImages(file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${apiUrl}/popup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 200) {
      return { success: true, path: res.data.path, message: res.data.message };
    } else {
      return { success: false, error: res.data.error || "อัปโหลดไม่สำเร็จ" };
    }
  } catch (err) {
    return { success: false, error: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" };
  }
}

export {
  // User API
  getAuthToken,
  GetProfile,
  Logouts,
  SignIn,
  ChangesPassword,
  AutoLogin,
  GetUsers,
  GetNUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  // File API
  UploadFile,
  GetFiles,
  GetFilesById,
  UpdateFilesById,
  DeleteFilesById,
  DownloadFile,
  // Announcement API
  CreateAnnouncement,
  GetAnnouncements,
  GetAnnouncementsById,
  UpdateAnnouncementsById,
  DeleteAnnouncementsById,
  // Activity API
  CreateActivity,
  GetActivities,
  GetActivitiesById,
  UpdateActivitiesById,
  DeleteActivitiesById,
  // Article API
  CreateArticle,
  GetArticles,
  GetArticlesById,
  UpdateArticlesById,
  DeleteArticlesById,
  // Knowledge API
  CreateKnowledge,
  GetKnowledges,
  GetKnowledgesById,
  UpdateKnowledgesById,
  DeleteKnowledgesById,
  // Security API
  CreateSecurity,
  GetSecurity,
  GetSecurityById,
  UpdateSecurityById,
  DeleteSecurityById,
  // Section API
  CreateSection,
  GetSections,
  GetSectionsById,
  UpdateSectionsById,
  DeleteSectionsById,
  // Link API
  CreateLink,
  GetLinks,
  GetLinksById,
  UpdateLinksById,
  DeleteLinksById,
  // Form API
  CreateForm,
  GetForms,
  GetFormsById,
  UpdateFormsById,
  DeleteFormsById,

  // Regulation API
  CreateRegulation,
  GetRegulations,
  GetRegulationsById,
  DownloadRegulation,
  UpdateRegulationsById,
  DeleteRegulationsById,

  // logs
  startvisit,
  stopvisit,
  GetTotalVisitors,
  GetAvgDuration,
  GetAllTotalVisitors,
  GetTopVisitors,
  DeleteVisitorsById,

  StartPageVisit,
  GetAllPageVisitors,
  GetTopPageVisitors,
  DeletePageVisitorsById,

  GetUserSockets,
  GetUserSocketsById,
  GetUserByUsername,
  DeleteUserSocketsById,

  GetMessages,
  GetMessagesById,
  DeleteMessagesById,

  UploadICS,
  GetEvents,
  CreateEvents,
  UpdateEvents,
  DeleteEvents,

  GetMarquee,
  UpdateMarquee,

  GetPopupImages,
  UploadPopupImages,
};