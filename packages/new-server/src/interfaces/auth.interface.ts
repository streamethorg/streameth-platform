export interface IAuth {
  token: string;
}

export interface IGoogleAuth {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    javascript_origins?: string[];
    redirect_uris?: string[];
  };
}
