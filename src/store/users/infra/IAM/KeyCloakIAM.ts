import IHttpClient from '@shared/abstractions/IHttpClient';
import IIdentityAccessManagement, { TokenPayload } from '@users/app/IIdentityAccessManagement';
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

export default class KeyCloakIAM implements IIdentityAccessManagement {
  private readonly baseUrl: string;

  private readonly realm: string;

  private readonly clientId: string;

  private readonly clientSecret: string;

  private clientAccessToken = '';

  constructor(private readonly httpClient: IHttpClient) {
    this.baseUrl = process.env.KEYCLOAK_BASE_URL;
    this.realm = process.env.KEYCLOAK_REALM_NAME;
    this.clientId = process.env.KEYCLOAK_CLIENT_ID;
    this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

    this.authClient().then(() => {
      setInterval(() => this.authClient().catch(console.error.bind(console)), 58 * 1000);
    }).catch(console.error.bind(console));
  }

  private async authClient() {
    const response = await this.httpClient.post(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
        scope: 'openid',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    this.clientAccessToken = response.body.access_token;
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
      { headers: { Authorization: `Bearer ${this.clientAccessToken}` } },
    );
  }

  public async updateUser(user: User): Promise<void> {
    const [firstName, ...rest] = user.name.split(' ');
    const lastName = rest.join(' ');

    await this.httpClient.put(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${user.id}`,
      {
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
      },
      { headers: { Authorization: `Bearer ${this.clientAccessToken}` } },
    );
  }

  public async getUser(userId: string): Promise<User> {
    const { body } = await this.httpClient.get<UserRepresentation>(`${this.baseUrl}/admin/realms/${this.realm}/users/${userId}`, {
      headers: { Authorization: `Bearer ${this.clientAccessToken}` },
    });

    return new User({
      id: body.id,
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      document: body.attributes.document,
      createdAt: new Date(body.createdTimestamp),
    });
  }

  public async getUsers(): Promise<User[]> {
    const { body } = await this.httpClient.get<UserRepresentation[]>(`${this.baseUrl}/admin/realms/${this.realm}/users`, {
      headers: { Authorization: `Bearer ${this.clientAccessToken}` },
    });

    return body.map((userRep) => new User({
      id: userRep.id,
      name: `${userRep.firstName} ${userRep.lastName}`,
      email: userRep.email,
      document: userRep.attributes.document,
      createdAt: new Date(userRep.createdTimestamp),
    }));
  }

  public async addRole(userId: string, role: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async addRoles(userId: string, roles: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async removeRole(userId: string, role: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async removeRoles(userId: string, role: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
