import type { UserRepository } from "@domain/user/user-repository.js";
import type { PublicUser, SignupInput } from "@domain/user/user-schema.js";

export const signup =
  (deps: { users: UserRepository }) =>
  async (input: SignupInput): Promise<PublicUser> =>
    deps.users.create(input);
