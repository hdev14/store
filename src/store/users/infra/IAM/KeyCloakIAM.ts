import IHttpClient, { HttpOptions } from '@shared/abstractions/IHttpClient';
import HttpError from '@shared/errors/HttpError';
import IIdentityAccessManagement, { PaginationOptions, TokenPayload } from '@users/app/IIdentityAccessManagement';
import User from '@users/domain/User';

type UserRepresentation = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_timestamp: number;
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
  private readonly base_url: string;

  private readonly realm: string;

  private readonly client_id: string;

  private readonly client_secret: string;

  private expired_at?: Date;

  private client_access_token = '';

  constructor(private readonly httpClient: IHttpClient) {
    this.base_url = process.env.KEYCLOAK_BASE_URL!;
    this.realm = process.env.KEYCLOAK_REALM_NAME!;
    this.client_id = process.env.KEYCLOAK_CLIENT_ID!;
    this.client_secret = process.env.KEYCLOAK_CLIENT_SECRET!;
  }

  public async auth(email: string, password: string): Promise<TokenPayload> {
    const response = await this.httpClient.post(
      `${this.base_url}/realms/${this.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: this.client_id,
        client_secret: this.client_secret,
        grant_type: 'password',
        username: email,
        password,
        scope: 'openid',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return {
      access_token: response.body.access_token,
      expires_in: response.body.expires_in,
    };
  }

  public async registerUser(user: User): Promise<void> {
    await this.authClient();

    const [first_name, ...rest] = user.name.split(' ');
    const last_name = rest.join(' ');

    await this.httpClient.post(
      `${this.base_url}/admin/realms/${this.realm}/users`,
      {
        id: user.id,
        firstName: first_name,
        lastName: last_name,
        email: user.email,
        attributes: {
          document: user.document.value,
        },
        credentials: [{
          type: 'password',
          value: user.password,
          temporary: false,
        }],
        createdTimestamp: user.created_at.getTime(),
      },
      this.getDefaultHttpClientOptions(),
    );
  }

  public async updateUser(user: User): Promise<void> {
    await this.authClient();

    const [first_name, ...rest] = user.name.split(' ');
    const last_name = rest.join(' ');

    const data: any = {
      firstName: first_name,
      lastName: last_name,
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
      `${this.base_url}/admin/realms/${this.realm}/users/${user.id}`,
      data,
      this.getDefaultHttpClientOptions(),
    );
  }

  public async getUser(user_id: string): Promise<User | null> {
    try {
      await this.authClient();

      const { body } = await this.httpClient.get<UserRepresentation>(
        `${this.base_url}/admin/realms/${this.realm}/users/${user_id}`,
        this.getDefaultHttpClientOptions(),
      );

      return new User({
        id: body.id,
        name: `${body.first_name} ${body.last_name}`,
        email: body.email,
        document: body.attributes.document,
        created_at: new Date(body.created_timestamp),
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
      `${this.base_url}/admin/realms/${this.realm}/users`,
      this.getDefaultHttpClientOptions({ query }),
    );

    const results: User[] = [];

    for (const userRep of body) {
      results.push(new User({
        id: userRep.id,
        name: `${userRep.first_name} ${userRep.last_name}`,
        email: userRep.email,
        document: userRep.attributes.document,
        created_at: new Date(userRep.created_timestamp),
      }));
    }

    return results;
  }

  public async addRole(userId: string, role: string): Promise<void> {
    await this.authClient();

    await this.httpClient.post(
      `${this.base_url}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      [{ name: role, containerId: this.realm }],
      this.getDefaultHttpClientOptions(),
    );
  }

  public async removeRole(userId: string, role: string): Promise<void> {
    await this.authClient();

    await this.httpClient.delete(
      `${this.base_url}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      [{ name: role, containerId: this.realm }],
      this.getDefaultHttpClientOptions(),
    );
  }

  private async authClient() {
    if (this.client_access_token === '' || this.expired_at === undefined || this.expired_at < new Date()) {
      const { body } = await this.httpClient.post(
        `${this.base_url}/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          grant_type: 'client_credentials',
          scope: 'openid',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const expired_at = new Date();
      expired_at.setDate(expired_at.getDate() + (body.expires_in / 60));

      this.client_access_token = body.access_token;
      this.expired_at = expired_at;
    }
  }

  private getDefaultHttpClientOptions(options?: HttpOptions): HttpOptions {
    const default_options: HttpOptions = {
      headers: { Authorization: `Bearer ${this.client_access_token}` },
      ...(options || {}),
    };

    return default_options;
  }
}
