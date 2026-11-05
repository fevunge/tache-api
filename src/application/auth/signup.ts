import type { UserRepository } from "../../domain/user/user-repository.js";
import type { SignupInput, User } from "../../domain/user/user-schema.js";

export const signup =
  (deps: { users: UserRepository }) =>
  async (input: SignupInput): Promise<User> =>
    deps.users.create(input);
