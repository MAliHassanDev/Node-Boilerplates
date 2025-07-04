import { Service } from "@/shared/interfaces/service.interface";
import { InjectDrizzle } from "@/shared/modules/drizzle/drizzle.decorators";
import { Database } from "@/db/type";
import { ServiceOptions } from "@/shared/types/shared.type";
import { roleTable } from "@/db/schema/index";
import { eq, and, SQL } from "drizzle-orm";
import { Injectable, Logger } from "@nestjs/common";
import { executeQueryTakeFirstOrThrow } from "@/utils/db.utils";
import { NewRole, Role, RoleUpdate } from "./types/roles.type";

@Injectable()
export class RolesService implements Service<Role> {
  private readonly logger = new Logger(RolesService.name);

  public constructor(@InjectDrizzle() private readonly db: Database) {}

  public async create(createRoleData: NewRole): Promise<Role> {
    try {
      return await executeQueryTakeFirstOrThrow(
        this.db.insert(roleTable).values(createRoleData).returning(),
      );
    } catch (error: unknown) {
      this.logger.error("Failed to create role", error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Role | undefined> {
    try {
      return await this.db.query.roleTable.findFirst({
        where: eq(roleTable.id, id),
      });
    } catch (error: unknown) {
      this.logger.error("Failed to find role by id", error);
      throw error;
    }
  }

  public async findAll(
    criteria: Partial<Role>,
    options?: ServiceOptions,
  ): Promise<Role[]> {
    try {
      const filters: SQL[] = [];

      if (criteria.id) {
        filters.push(eq(roleTable.id, criteria.id));
      }

      if (criteria.name) {
        filters.push(eq(roleTable.name, criteria.name));
      }

      if (criteria.code) {
        filters.push(eq(roleTable.code, criteria.code));
      }

      if (criteria.description) {
        filters.push(eq(roleTable.description, criteria.description));
      }

      if (criteria.createdAt) {
        filters.push(eq(roleTable.createdAt, criteria.createdAt));
      }

      if (criteria.updatedAt) {
        filters.push(eq(roleTable.updatedAt, criteria.updatedAt));
      }

      if (criteria.deletedAt) {
        filters.push(eq(roleTable.deletedAt, criteria.deletedAt));
      }

      const db = options?.trx ?? this.db;

      return await db.query.roleTable.findMany({
        where: filters.length > 0 ? and(...filters) : undefined,
      });
    } catch (error: unknown) {
      this.logger.error("Failed to find roles", error);
      throw error;
    }
  }

  public async update(id: string, updateRoleData: RoleUpdate): Promise<Role> {
    try {
      return await executeQueryTakeFirstOrThrow(
        this.db
          .update(roleTable)
          .set(updateRoleData)
          .where(eq(roleTable.id, id))
          .returning(),
      );
    } catch (error: unknown) {
      this.logger.error("Failed to update role", error);
      throw error;
    }
  }

  public async findFirst(criteria: Partial<Role>): Promise<Role | undefined> {
    try {
      const roles = await this.findAll(criteria);
      return roles[0];
    } catch (error: unknown) {
      this.logger.error("Failed to find first role", error);
      throw error;
    }
  }
}
