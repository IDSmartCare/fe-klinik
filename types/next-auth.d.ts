import { User, Session } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    role: string;
    id_profile: any;
    is_active: string;
    created_by: string;
    created_at: string;
    wfid: string;
    fasyankes: Fasyankes;
  }

  interface Fasyankes {
    bisnis_owner: BisnisOwner;
    warehouse: Warehouse;
    fasyankesId: number;
    type: string;
    name: string;
    address: string;
    pic: string;
    pic_number: string;
    email: string;
    is_active: boolean;
    package: string;
  }

  interface BisnisOwner {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    is_send_email: boolean;
    is_resend: boolean;
    is_first_login: boolean;
    img_profile: string | null;
    created_at: string;
    updated_at: string;
  }

  interface Warehouse {
    id: number;
    bisnis_owner_id: number;
    name: string;
    address: string;
    pic: string;
    contact: string;
    created_at: string;
    updated_at: string;
  }

  interface Session {
    user: {
      data: User;
    } & DefaultSession["user"];
  }
}
