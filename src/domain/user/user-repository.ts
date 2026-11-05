import type { SignupInput, User } from "./user-schema.js";

export interface UserRepository {
  create(input: SignupInput): Promise<User>;
}
