import IHttpClient, { HttpOptions } from '@shared/abstractions/IHttpClient';
import HttpError from '@shared/errors/HttpError';
import IIdentityAccessManagement, { PaginationOptions, TokenPayload } from '@users/app/IIdentityAccessManagement';
import User from '@users/domain/User';

type UserRepresentation = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdTimestamp: number;
  attributes: {
    document: string;
  },
  credentials: [{
    type: string;
    value: any;
    temporary: boolean;
  }],
}

// TODO: add getAllRoles
export default class KeyCloakIAM implements IIdentityAccessManagement {
  private readonly baseUrl: string;

  private readonly realm: string;

  private readonly clientId: string;

  private readonly clientSecret: string;

  private expiredAt?: Date;

  private clientAccessToken = '';

  constructor(private readonly httpClient: IHttpClient) {
    this.baseUrl = process.env.KEYCLOAK_BASE_URL!;
    this.realm = process.env.KEYCLOAK_REALM_NAME!;
    this.clientId = process.env.KEYCLOAK_CLIENT_ID!;
    this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;
  }

  public async auth(email: string, password: string): Promise<TokenPayload> {
    const response = await this.httpClient.post(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'password',
        username: email,
        password,
        scope: 'openid',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return {
      accessToken: response.body.access_token,
      expiresIn: response.body.expires_in,
    };
  }

  public async registerUser(user: User): Promise<void> {
    await this.authClient();

    const [firstName, ...rest] = user.name.split(' ');
    const lastName = rest.join(' ');

    await this.httpClient.post(
      `${this.baseUrl}/admin/realms/${this.realm}/users`,
      {
        id: user.id,
        firstName,
        lastName,
        email: user.email,
        attributes: {
          document: user.document.value,
        },
        credentials: [{
          type: 'password',
          value: user.password,
          temporary: false,
        }],
        createdTimestamp: user.createdAt.getTime(),
      },
      this.getDefaultHttpClientOptions(),
    );
  }

  public async updateUser(user: User): Promise<void> {
    await this.authClient();

    const [firstName, ...rest] = user.name.split(' ');
    const lastName = rest.join(' ');

    const data: any = {
      firstName,
      lastName,
      email: user.email,
      attributes: {
        document: user.document.value,
      },
      credentials: [],
    };

    if (user.password) {
      data.credentials.push({
        type: 'password',
        value: user.password,
        temporary: false,
      });
    }

    await this.httpClient.put(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${user.id}`,
      data,
      this.getDefaultHttpClientOptions(),
    );
  }

  public async getUser(userId: string): Promise<User | null> {
    try {
      await this.authClient();

      const { body } = await this.httpClient.get<UserRepresentation>(
        `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}`,
        this.getDefaultHttpClientOptions(),
      );

      return new User({
        id: body.id,
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        document: body.attributes.document,
        createdAt: new Date(body.createdTimestamp),
      });
    } catch (e: any) {
      if (e instanceof HttpError && e.statusCode === 404) {
        return null;
      }

      throw e;
    }
  }

  public async getUsers(pagination?: PaginationOptions): Promise<User[]> {
    await this.authClient();

    const query = pagination && new URLSearchParams({
      first: pagination.offset.toFixed(0),
      max: pagination.limit.toFixed(0),
    });

    const { body } = await this.httpClient.get<UserRepresentation[]>(
      `${this.baseUrl}/admin/realms/${this.realm}/users`,
      this.getDefaultHttpClientOptions({ query }),
    );

    const results: User[] = [];

    for (const userRep of body) {
      results.push(new User({
        id: userRep.id,
        name: `${userRep.firstName} ${userRep.lastName}`,
        email: userRep.email,
        document: userRep.attributes.document,
        createdAt: new Date(userRep.createdTimestamp),
      }));
    }

    return results;
  }

  public async addRole(userId: string, role: string): Promise<void> {
    await this.authClient();

    await this.httpClient.post(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      [{ name: role, containerId: this.realm }],
      this.getDefaultHttpClientOptions(),
    );
  }

  public async removeRole(userId: string, role: string): Promise<void> {
    await this.authClient();

    await this.httpClient.delete(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      [{ name: role, containerId: this.realm }],
      this.getDefaultHttpClientOptions(),
    );
  }

  private async authClient() {
    if (this.clientAccessToken === '' || this.expiredAt === undefined || this.expiredAt < new Date()) {
      const { body } = await this.httpClient.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
          scope: 'openid',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + (body.expires_in / 60));

      this.clientAccessToken = body.access_token;
      this.expiredAt = expiredAt;
    }
  }

  private getDefaultHttpClientOptions(options?: HttpOptions): HttpOptions {
    const defaultOptions: HttpOptions = {
      headers: { Authorization: `Bearer ${this.clientAccessToken}` },
      ...(options || {}),
    };

    return defaultOptions;
  }
}
