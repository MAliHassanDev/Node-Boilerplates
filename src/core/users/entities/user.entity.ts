import { Exclude, Transform } from "class-transformer";
import { RoleEntity } from "../../roles/entities/role.entity.js";

export class UserEntity {
  id: string;
  firstName: string;
  lastName: string | null;

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
  password: string;

  @Exclude()
  roleId: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
