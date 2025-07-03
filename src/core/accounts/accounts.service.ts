import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectDrizzle } from "../../shared/modules/drizzle/drizzle.decorators.js";
import type { Database } from "../../db/type.js";
import { Account, AccountUpdate } from "./types/user.type.js";
import { and, eq, SQL } from "drizzle-orm";
import { roleTable, accountTable } from "../../db/schema/index.js";
import {
  executeQueryTakeFirstOrThrow,
  handleDatabaseInsertException,
} from "../../utils/db.utils.js";
import { ROLE } from "../roles/roles.constants.js";
import { UserAccountEntity } from "./entities/user-account.entity.js";
import { PasswordService } from "../../shared/services/password.service.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import { ServiceOptions } from "../../shared/types/shared.type.js";

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
      return await this.db.query.accountTable.findFirst({
        where: eq(accountTable.email, email),
        with: {
          role: true,
        },
      });
    } catch (error: unknown) {
      this.logger.error("Failed to find user", error);
      throw error;
    }
  }

  public async findFirst(criteria: Partial<Account>, options?: ServiceOptions) {
    try {
      return (await this.findMany(criteria, options))[0];
    } catch (error: unknown) {
      this.logger.error("Failed to find user", error);
    }
  }

  public async update(userId: Account["id"], user: AccountUpdate) {
    try {
      const { id } = await executeQueryTakeFirstOrThrow(
        this.db
          .update(accountTable)
          .set(user)
          .where(eq(accountTable.id, userId))
          .returning({
            id: accountTable.id,
          }),
      );
      return await this.findFirstOrThrow({ id });
    } catch (error: unknown) {
      this.logger.error("Failed to update user", error);
      throw error;
    }
  }

  public async findOrCreate(
    createAccountDto: CreateAccountDto,
  ): Promise<UserAccountEntity> {
    try {
      let userAccount = await this.findFirst({
        email: createAccountDto.email,
      });

      userAccount ??= await this.create(createAccountDto);
      return userAccount;
    } catch (error: unknown) {
      this.logger.error("Failed to find or create user account: ", error);
      throw error;
    }
  }

  public async create(
    createAccountDto: CreateAccountDto,
  ): Promise<UserAccountEntity> {
    try {
      let userRole = await this.db.query.roleTable.findFirst({
        where: eq(roleTable.name, "USER"),
      });

      userRole ??= await executeQueryTakeFirstOrThrow(
        this.db
          .insert(roleTable)
          .values(Object.values(ROLE))
          .returning()
          .execute(),
      );

      return await this.db.transaction(async trx => {
        const hashedPassword = createAccountDto.password
          ? this.passwordService.hashSync(createAccountDto.password)
          : null;

        const { id } = await executeQueryTakeFirstOrThrow(
          trx
            .insert(accountTable)
            .values({
              ...createAccountDto,
              password: hashedPassword,
              roleId: userRole.id,
            })
            .returning(),
        );
        return await this.findFirstOrThrow({ id }, { trx });
      });
    } catch (error: unknown) {
      this.logger.error("Failed to create user", error);
      handleDatabaseInsertException(error, {
        resource: "User",
      });
    }
  }

  public async findFirstOrThrow(
    criteria: Partial<Account>,
    options?: ServiceOptions,
  ): Promise<UserAccountEntity> {
    const user = await this.findFirst(criteria, options);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  public findMany(
    criteria: Partial<Account>,
    options?: ServiceOptions,
  ): Promise<UserAccountEntity[]> {
    const filters: SQL[] = [];

    if (criteria.firstName) {
      filters.push(eq(accountTable.firstName, criteria.firstName));
    }

    if (criteria.email) {
      filters.push(eq(accountTable.email, criteria.email));
    }

    if (criteria.lastName) {
      filters.push(eq(accountTable.lastName, criteria.lastName));
    }

    if (criteria.roleId) {
      filters.push(eq(accountTable.roleId, criteria.roleId));
    }

    if (criteria.id) {
      filters.push(eq(accountTable.id, criteria.id));
    }

    if (criteria.createdAt) {
      filters.push(eq(accountTable.createdAt, criteria.createdAt));
    }

    const dbClient = options?.trx ?? this.db;

    return dbClient.query.accountTable
      .findMany({
        where: and(...filters),
        with: {
          role: true,
        },
      })
      .execute();
  }
}
