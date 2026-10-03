import { BloodGroup } from "../../generated/prisma/browser";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "DONOR" | "RECIPIENT";
  phone?: string | undefined;
  location?: string | undefined;
  bloodGroup?: BloodGroup | undefined;
}

export interface IGoogleAuthPayload {
  credential: string;
}