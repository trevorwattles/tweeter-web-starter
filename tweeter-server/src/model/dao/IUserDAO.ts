export interface UserRow {
  alias: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  passwordHash: string;
}

export interface IUserDAO {
  putUser(
    alias: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void>;

  getUser(alias: string): Promise<UserRow | null>;
}
