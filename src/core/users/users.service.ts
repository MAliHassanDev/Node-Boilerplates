import { Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { Database } from "../../database/types.js";
import { InjectKysely } from "../../kysely/decorators/kysely.decorators.js";

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: "john",
      email: "john",
      password: "changeme",
    },
    {
      id: 2,
      username: "maria",
      email: "maria@gmail.com",
      password: "guess",
    },
  ];

  public constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findOne(email: string): Promise<User | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((res, _) => {
      setTimeout(() => {
        res(this.users.find(user => user.email === email));
      }, 1000);
    });
  }
}
