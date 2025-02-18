import { Injectable } from "@nestjs/common";

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

  async findOne(email: string): Promise<User | undefined> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(this.users.find(user => user.email === email));
      }, 1000);
    });
  }
}
