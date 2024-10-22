export enum AuthType {
  email = 'email',
  google = 'google',
}

export interface IAuth {
  token?: string;
  type?: AuthType;
  email?: string;
}
