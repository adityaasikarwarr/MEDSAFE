import { Role } from "./roles";

export interface User {
  name: string;
  email: string;
  role: Role;
}