import { IAuthTokenDAO } from "../dao/IAuthTokenDAO";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 60 minutes

export class AuthService {
  private authTokenDAO: IAuthTokenDAO;

  constructor(authTokenDAO: IAuthTokenDAO) {
    this.authTokenDAO = authTokenDAO;
  }

  /**
   * Validates the given auth token string.
   * If valid, refreshes the timestamp and returns the associated user alias.
   * If invalid or expired, throws an error.
   */
  async validate(authToken: any): Promise<string> {
    // Handle authToken as either a string or an AuthToken-like object
    let tokenString: string;
    if (typeof authToken === "string") {
      tokenString = authToken;
    } else if (authToken && (authToken.token || authToken._token)) {
      tokenString = authToken.token || authToken._token;
    } else {
      throw new Error("[Unauthorized] Invalid auth token");
    }

    const tokenRow = await this.authTokenDAO.getAuthToken(tokenString);

    if (!tokenRow) {
      throw new Error("[Unauthorized] Invalid auth token");
    }

    const now = Date.now();
    const elapsed = now - tokenRow.timestamp;

    if (elapsed > TOKEN_EXPIRY_MS) {
      // Token expired — clean it up
      await this.authTokenDAO.deleteAuthToken(tokenString);
      throw new Error("[Unauthorized] Auth token has expired");
    }

    // Token is still valid — refresh the timestamp
    await this.authTokenDAO.updateAuthTokenTimestamp(tokenString, now);

    return tokenRow.alias;
  }
}
