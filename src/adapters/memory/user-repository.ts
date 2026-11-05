import { createHash, randomUUID } from "node:crypto";
import type { UserRepository } from "../../domain/user/user-repository.js";
import type { SignupInput, User } from "../../domain/user/user-schema.js";

type StoredUser = User & { passwordHash: string };

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, StoredUser>();

  async create(input: SignupInput): Promise<User> {
    const now = new Date().toISOString();
    const user: StoredUser = {
      id: randomUUID(),
      username: input.username,
      email: input.email,
      phone: input.phone ?? null,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      role: input.role ?? null,
      department: input.department ?? null,
      linuxUsername: input.linuxUsername ?? null,
      githubUsername: input.githubUsername ?? null,
      createdAt: now,
      updatedAt: now,
      passwordHash: createHash("sha256").update(input.password).digest("hex"),
    };

    this.users.set(user.id, user);
    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }
}
