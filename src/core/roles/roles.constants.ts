import { NewRole, Role } from "./roles.type.js";

export const ROLE = {
  USER: {
    name: "USER",
    code: 3001,
    description: "Normal user role",
  },
  ADMIN: {
    name: "ADMIN",
    code: 3002,
    description: "Admin role",
  },
} satisfies Record<Role["name"], NewRole>;
