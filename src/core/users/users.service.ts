import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "../../shared/drizzle/drizzle.decorators.js";
import type { Database } from "../../db/type.js";
import { User } from "./types/user.type.js";
import { eq, SQL } from "drizzle-orm";
import { userTable } from "../../db/schema/index.js";

@Injectable()
export class UsersService {
  public constructor(@InjectDrizzle() private readonly db: Database) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.db.query.userTable.findFirst({
      where: (fields, operator) => operator.eq(fields.email, email),
    });
  }

  public find(criteria: Partial<User>) {
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
  }
}
