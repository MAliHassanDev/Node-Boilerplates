import { ServiceOptions } from "../types/shared.type";

export interface Service<T> {
  create(input: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | undefined>;
  findAll(criteria: Partial<T>, options?: ServiceOptions): Promise<T[]>;
  update(id: string, input: Partial<T>): Promise<T>;
  findFirst(criteria: Partial<T>): Promise<T | undefined>;
}
