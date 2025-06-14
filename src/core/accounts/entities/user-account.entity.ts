import { Exclude, Transform } from "class-transformer";
import { RoleEntity } from "../../roles/entities/role.entity.js";
import { Account } from "../types/user.type.js";

export class UserAccountEntity {
  id: string;
  provider: Account["provider"];
  providerId: string | null;
  firstName: string;
  lastName: string | null;
  email: string;

  @Transform(
    ({ value }: { value?: RoleEntity }) => {
      if (value?.code) {
        return value.code;
      }
    },
    { toPlainOnly: true },
  )
  role: RoleEntity;

  @Exclude()
  password: string | null;

  @Exclude()
  roleId: string;

  constructor(partial: Partial<UserAccountEntity>) {
    Object.assign(this, partial);
  }
}
