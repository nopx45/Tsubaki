import { FilesInterface } from "./IFile";

export interface AnnouncementsInterface {
  file_name: string;
  created_at?: string;
    ID?: number;
    title?: string;
    content?: string;
    file_id?: number;
    file?: FilesInterface;
  }