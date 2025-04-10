import { FilesInterface } from "./IFile";

export interface AnnouncementsInterface {
  file_name: string;
  UpdatedAt?: string;
    ID?: number;
    title?: string;
    content?: string;
    file_id?: number;
    file?: FilesInterface;
  }