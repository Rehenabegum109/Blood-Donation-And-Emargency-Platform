export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
phone?: string | undefined;
location?: string | undefined;
}