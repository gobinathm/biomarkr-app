import { CloudStorageProvider, CloudStorageFile, CloudStorageConfig } from './cloudStorage';
import { PopupAuthHandler } from '../utils/authHelpers';

export class DropboxStorage extends CloudStorageProvider {
  private static readonly AUTH_ENDPOINT = 'https://www.dropbox.com/oauth2/authorize';
  private static readonly TOKEN_ENDPOINT = 'https://api.dropboxapi.com/oauth2/token';
  private static readonly API_ENDPOINT = 'https://api.dropboxapi.com/2';
  private static readonly CONTENT_ENDPOINT = 'https://content.dropboxapi.com/2';
  private static readonly APP_FOLDER = '/Biomarkr';
  
  private codeVerifier: string | null = null;
  private codeChallenge: string | null = null;

  constructor() {
    const config: CloudStorageConfig = {
      clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID || 'demo-client-id',
      redirectUri: window.location.origin + '/auth/dropbox/callback/index.html',
      scopes: [] // Dropbox uses app permissions instead of scopes
    };
    super(config);
  }

  getProviderName(): string {
    return 'dropbox';
  }

  async authenticate(): Promise<void> {
    // Generate PKCE parameters
    await this.generatePKCE();
    const authUrl = this.buildAuthUrl();
    
    
    const authHandler = new PopupAuthHandler(
      authUrl,
      'Dropbox',
      'DROPBOX_AUTH_SUCCESS',
      'DROPBOX_AUTH_ERROR',
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
      token_access_type: 'offline',
      code_challenge: this.codeChallenge!,
      code_challenge_method: 'S256'
    });
    
    return `${DropboxStorage.AUTH_ENDPOINT}?${params.toString()}`;
  }

  private async handleAuthCode(code: string): Promise<void> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.config.redirectUri,
      code_verifier: this.codeVerifier!
    });

    const response = await fetch(DropboxStorage.TOKEN_ENDPOINT, {
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

  private async generatePKCE(): Promise<void> {
    // Generate a random code verifier (43-128 characters)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    
    // Convert to base64url
    let base64 = '';
    for (let i = 0; i < array.length; i++) {
      base64 += String.fromCharCode(array[i]);
    }
    this.codeVerifier = btoa(base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Generate code challenge using SHA256
    const encoder = new TextEncoder();
    const data = encoder.encode(this.codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    // Convert digest to base64url
    const digestArray = new Uint8Array(digest);
    let digestBase64 = '';
    for (let i = 0; i < digestArray.length; i++) {
      digestBase64 += String.fromCharCode(digestArray[i]);
    }
    this.codeChallenge = btoa(digestBase64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
  }

  protected async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    });

    const response = await fetch(DropboxStorage.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      this.clearTokensFromStorage();
      const errorText = await response.text();
      console.error('Token refresh failed:', errorText);
      throw new Error('Failed to refresh token - please reconnect to Dropbox to get updated permissions');
    }

    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
    }
    this.saveTokensToStorage();
  }

  async uploadFile(filename: string, content: string): Promise<string> {
    // Ensure the app folder exists first
    await this.ensureAppFolderExists();
    
    const path = `${DropboxStorage.APP_FOLDER}/${filename}`;
    const url = `${DropboxStorage.CONTENT_ENDPOINT}/files/upload`;
    
    console.log('Dropbox upload attempt:', { filename, path, contentLength: content.length });
    
    const response = await this.makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: path,
          mode: 'overwrite',
          autorename: false
        })
      },
      body: content
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Dropbox upload error:', error);
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();
    return result.id;
  }

  async downloadFile(filename: string): Promise<string> {
    const path = `${DropboxStorage.APP_FOLDER}/${filename}`;
    const url = `${DropboxStorage.CONTENT_ENDPOINT}/files/download`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: path
        })
      }
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('File not found');
      }
      const error = await response.text();
      throw new Error(`Download failed: ${error}`);
    }

    return await response.text();
  }

  async listFiles(): Promise<CloudStorageFile[]> {
    const url = `${DropboxStorage.API_ENDPOINT}/files/list_folder`;
    
    const response = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        path: DropboxStorage.APP_FOLDER,
        recursive: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`List files failed: ${error}`);
    }

    const data = await response.json();
    
    return data.entries
      .filter((entry: any) => entry['.tag'] === 'file')
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        modifiedTime: file.client_modified
      }));
  }

  async deleteFile(filename: string): Promise<void> {
    const path = `${DropboxStorage.APP_FOLDER}/${filename}`;
    const url = `${DropboxStorage.API_ENDPOINT}/files/delete_v2`;
    
    const response = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify({
        path: path
      })
    });

    if (!response.ok && response.status !== 409) {
      const error = await response.text();
      throw new Error(`Delete failed: ${error}`);
    }
  }

  private async ensureAppFolderExists(): Promise<void> {
    try {
      // Try to get folder metadata first
      const url = `${DropboxStorage.API_ENDPOINT}/files/get_metadata`;
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          path: DropboxStorage.APP_FOLDER
        })
      });

      if (response.ok) {
        return; // Folder already exists
      }
      
      // If 409 conflict, folder already exists
      if (response.status === 409) {
        return;
      }
    } catch (error) {
      // Folder doesn't exist, try to create it
    }

    try {
      // Create the app folder
      const createUrl = `${DropboxStorage.API_ENDPOINT}/files/create_folder_v2`;
      const createResponse = await this.makeRequest(createUrl, {
        method: 'POST',
        body: JSON.stringify({
          path: DropboxStorage.APP_FOLDER,
          autorename: false
        })
      });

      if (!createResponse.ok && createResponse.status !== 409) {
        const error = await createResponse.text();
        console.warn('Could not create app folder:', error);
      }
    } catch (error) {
      console.warn('App folder creation failed, but continuing:', error);
      // Don't throw error - folder might already exist or will be created on first upload
    }
  }

  disconnect(): void {
    this.clearTokensFromStorage();
    this.accessToken = null;
    this.refreshToken = null;
  }
}