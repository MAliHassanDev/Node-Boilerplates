import { Injectable, Logger } from "@nestjs/common";
import { InjectDrizzle } from "../../shared/modules/drizzle/drizzle.decorators.js";
import type { Database } from "../../db/type.js";
import { NewUser, User, UserUpdate } from "./types/user.type.js";
import { and, eq, SQL } from "drizzle-orm";
import { userTable } from "../../db/schema/index.js";
import { executeInsertTakeFirstOrThrow } from "../../utils/db.utils.js";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public constructor(@InjectDrizzle() private readonly db: Database) {}

  async findOne(email: string): Promise<User | undefined> {
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
        .returning()
        .execute();
    } catch (error: unknown) {
      this.logger.error("Failed to update user", error);
      throw error;
    }
  }

  public async create(user: NewUser): Promise<User> {
    try {
      return await executeInsertTakeFirstOrThrow(
        this.db.insert(userTable).values(user).returning(),
      );
    } catch (error: unknown) {
      this.logger.error("Failed to create user", error);
      throw error;
    }
  }

  public findMany(criteria: Partial<User>) {
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
      })
      .execute();
  }
}
