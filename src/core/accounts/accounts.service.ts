import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectDrizzle } from "../../shared/modules/drizzle/drizzle.decorators.js";
import type { Database } from "../../db/type.js";
import { Account, AccountUpdate, NewAccount } from "./types/user.type.js";
import { and, eq, SQL } from "drizzle-orm";
import { roleTable, accountsTable } from "../../db/schema/index.js";
import {
  executeInsertTakeFirstOrThrow,
  handleDatabaseInsertException,
} from "../../utils/db.utils.js";
import { ROLE } from "../roles/roles.constants.js";
import { UserAccountEntity } from "./entities/user-account.entity.js";
import { PasswordService } from "../../shared/services/password.service.js";

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  public constructor(
    @InjectDrizzle() private readonly db: Database,
    private readonly passwordService: PasswordService,
  ) {}

  async findFirstIncludePassword(
    email: string,
  ): Promise<UserAccountEntity | undefined> {
    try {
      return await this.db.query.accountsTable.findFirst({
        where: eq(accountsTable.email, email),
        with: {
          role: true,
        },
      });
    } catch (error: unknown) {
      this.logger.error("Failed to find user", error);
      throw error;
    }
  }

  public async findFirst(criteria: Partial<Account>) {
    try {
      return (await this.findMany(criteria))[0];
    } catch (error: unknown) {
      this.logger.error("Failed to find user", error);
    }
  }

  public async update(userId: Account["id"], user: AccountUpdate) {
    try {
      return await this.db
        .update(accountsTable)
        .set(user)
        .where(eq(accountsTable.id, userId))
        .execute();
    } catch (error: unknown) {
      this.logger.error("Failed to update user", error);
      throw error;
    }
  }

  public async create(
    newAccountData: Omit<NewAccount, "roleId">,
  ): Promise<UserAccountEntity> {
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

      const hashedPassword = newAccountData.password
        ? this.passwordService.hashSync(newAccountData.password)
        : null;

      const { id } = await executeInsertTakeFirstOrThrow(
        this.db
          .insert(accountsTable)
          .values({
            ...newAccountData,
            password: hashedPassword,
            roleId: userRole.id,
          })
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

  public async findFirstOrThrow(
    criteria: Partial<Account>,
  ): Promise<UserAccountEntity> {
    const user = await this.findFirst(criteria);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  public findMany(criteria: Partial<Account>): Promise<UserAccountEntity[]> {
    const filters: SQL[] = [];

    if (criteria.firstName) {
      filters.push(eq(accountsTable.firstName, criteria.firstName));
    }

    if (criteria.email) {
      filters.push(eq(accountsTable.email, criteria.email));
    }

    if (criteria.lastName) {
      filters.push(eq(accountsTable.lastName, criteria.lastName));
    }

    if (criteria.roleId) {
      filters.push(eq(accountsTable.roleId, criteria.roleId));
    }

    if (criteria.id) {
      filters.push(eq(accountsTable.id, criteria.id));
    }

    if (criteria.createdAt) {
      filters.push(eq(accountsTable.createdAt, criteria.createdAt));
    }

    return this.db.query.accountsTable
      .findMany({
        where: and(...filters),
        with: {
          role: true,
        },
      })
      .execute();
  }
}
