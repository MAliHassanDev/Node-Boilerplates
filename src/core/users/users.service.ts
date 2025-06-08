import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectDrizzle } from "../../shared/modules/drizzle/drizzle.decorators.js";
import type { Database } from "../../db/type.js";
import { User, UserUpdate } from "./types/user.type.js";
import { and, eq, SQL } from "drizzle-orm";
import { roleTable, userTable } from "../../db/schema/index.js";
import {
  executeInsertTakeFirstOrThrow,
  handleDatabaseInsertException,
} from "../../utils/db.utils.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { ROLE } from "../roles/roles.constants.js";
import { UserEntity } from "./entities/user.entity.js";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public constructor(@InjectDrizzle() private readonly db: Database) {}

  async findOne(email: string): Promise<UserEntity | undefined> {
    return await this.findFirst({ email });
  }

  public async findFirst(criteria: Partial<User>) {
    try {
      return (await this.findMany(criteria))[0];
    } catch (error: unknown) {
      this.logger.error("Failed to find user", error);
    }
  }

  public async update(userId: User["id"], user: UserUpdate) {
    try {
      return await this.db
        .update(userTable)
        .set(user)
        .where(eq(userTable.id, userId))
        .execute();
    } catch (error: unknown) {
      this.logger.error("Failed to update user", error);
      throw error;
    }
  }

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      let userRole = await this.db.query.roleTable.findFirst({
        where: eq(roleTable.name, "USER"),
      });

      userRole ??= await executeInsertTakeFirstOrThrow(
        this.db
          .insert(roleTable)
          .values(Object.values(ROLE))
          .returning()
          .execute(),
      );

      const { id } = await executeInsertTakeFirstOrThrow(
        this.db
          .insert(userTable)
          .values({ ...createUserDto, roleId: userRole.id })
          .returning(),
      );
      return await this.findFirstOrThrow({ id });
    } catch (error: unknown) {
      this.logger.error("Failed to create user", error);
      handleDatabaseInsertException(error, {
        resource: "User",
      });
    }
  }

  public async findFirstOrThrow(criteria: Partial<User>): Promise<UserEntity> {
    const user = await this.findFirst(criteria);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  public findMany(criteria: Partial<User>): Promise<UserEntity[]> {
    const filters: SQL[] = [];

    if (criteria.firstName) {
      filters.push(eq(userTable.firstName, criteria.firstName));
    }

    if (criteria.email) {
      filters.push(eq(userTable.email, criteria.email));
    }

    if (criteria.lastName) {
      filters.push(eq(userTable.lastName, criteria.lastName));
    }

    if (criteria.roleId) {
      filters.push(eq(userTable.roleId, criteria.roleId));
    }

    if (criteria.id) {
      filters.push(eq(userTable.id, criteria.id));
    }

    if (criteria.createdAt) {
      filters.push(eq(userTable.createdAt, criteria.createdAt));
    }

    return this.db.query.userTable
      .findMany({
        where: and(...filters),
        with: {
          role: true,
        },
      })
      .execute();
  }
}
