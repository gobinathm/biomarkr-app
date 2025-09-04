import { CloudStorageProvider, CloudStorageFile, CloudStorageConfig } from './cloudStorage';
import { PopupAuthHandler } from '../utils/authHelpers';

export class OneDriveStorage extends CloudStorageProvider {
  private static readonly AUTHORITY = 'https://login.microsoftonline.com/common';
  private static readonly GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0';
  private static readonly APP_FOLDER = '/Apps/Biomarkr';

  constructor() {
    const config: CloudStorageConfig = {
      clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID || 'demo-client-id',
      redirectUri: window.location.origin + '/auth/onedrive/callback/index.html',
      scopes: ['https://graph.microsoft.com/Files.ReadWrite.AppFolder', 'offline_access']
    };
    super(config);
  }

  getProviderName(): string {
    return 'onedrive';
  }

  async authenticate(): Promise<void> {
    const authUrl = this.buildAuthUrl();
    
    const authHandler = new PopupAuthHandler(
      authUrl,
      'OneDrive',
      'ONEDRIVE_AUTH_SUCCESS',
      'ONEDRIVE_AUTH_ERROR',
      async (data) => {
        await this.handleAuthCode(data.code);
      }
    );
    
    return authHandler.authenticate();
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_mode: 'query'
    });
    
    return `${OneDriveStorage.AUTHORITY}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  private async handleAuthCode(code: string): Promise<void> {
    const tokenUrl = `${OneDriveStorage.AUTHORITY}/oauth2/v2.0/token`;
    
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' ')
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.saveTokensToStorage();
  }

  protected async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenUrl = `${OneDriveStorage.AUTHORITY}/oauth2/v2.0/token`;
    
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      scope: this.config.scopes.join(' ')
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      this.clearTokensFromStorage();
      throw new Error('Failed to refresh token');
    }

    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
    }
    this.saveTokensToStorage();
  }

  async uploadFile(filename: string, content: string): Promise<string> {
    await this.ensureAppFolderExists();
    
    const url = `${OneDriveStorage.GRAPH_ENDPOINT}/me/drive/special/approot:/${filename}:/content`;
    
    const response = await this.makeRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: content
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();
    return result.id;
  }

  async downloadFile(filename: string): Promise<string> {
    const url = `${OneDriveStorage.GRAPH_ENDPOINT}/me/drive/special/approot:/${filename}:/content`;
    
    const response = await this.makeRequest(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('File not found');
      }
      const error = await response.text();
      throw new Error(`Download failed: ${error}`);
    }

    return await response.text();
  }

  async listFiles(): Promise<CloudStorageFile[]> {
    const url = `${OneDriveStorage.GRAPH_ENDPOINT}/me/drive/special/approot/children`;
    
    const response = await this.makeRequest(url);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`List files failed: ${error}`);
    }

    const data = await response.json();
    
    return data.value.map((item: any) => ({
      id: item.id,
      name: item.name,
      size: item.size,
      modifiedTime: item.lastModifiedDateTime
    }));
  }

  async deleteFile(filename: string): Promise<void> {
    const url = `${OneDriveStorage.GRAPH_ENDPOINT}/me/drive/special/approot:/${filename}`;
    
    const response = await this.makeRequest(url, {
      method: 'DELETE'
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.text();
      throw new Error(`Delete failed: ${error}`);
    }
  }

  private async ensureAppFolderExists(): Promise<void> {
    // The approot special folder is automatically created when we first access it
    // No need to manually create it
  }

  disconnect(): void {
    this.clearTokensFromStorage();
    this.accessToken = null;
    this.refreshToken = null;
  }
}