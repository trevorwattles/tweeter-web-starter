export interface AuthTokenRow {
  token: string;
  alias: string;
  timestamp: number;
}

export interface IAuthTokenDAO {
  putAuthToken(token: string, alias: string, timestamp: number): Promise<void>;
  getAuthToken(token: string): Promise<AuthTokenRow | null>;
  updateAuthTokenTimestamp(token: string, timestamp: number): Promise<void>;
  deleteAuthToken(token: string): Promise<void>;
}
