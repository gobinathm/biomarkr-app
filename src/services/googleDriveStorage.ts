import { CloudStorageProvider, CloudStorageFile, CloudStorageConfig } from './cloudStorage';
import { PopupAuthHandler } from '../utils/authHelpers';

export class GoogleDriveStorage extends CloudStorageProvider {
  private static readonly AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
  private static readonly TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
  private static readonly DRIVE_ENDPOINT = 'https://www.googleapis.com/drive/v3';
  private static readonly UPLOAD_ENDPOINT = 'https://www.googleapis.com/upload/drive/v3';
  private appFolderId: string | null = null;

  constructor() {
    const config: CloudStorageConfig = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id',
      redirectUri: window.location.origin + '/auth/google/callback/index.html',
      scopes: ['https://www.googleapis.com/auth/drive.file']
    };
    super(config);
  }

  getProviderName(): string {
    return 'googledrive';
  }

  async authenticate(): Promise<void> {
    const authUrl = this.buildAuthUrl();
    
    const authHandler = new PopupAuthHandler(
      authUrl,
      'Google Drive',
      'GOOGLE_AUTH_SUCCESS',
      'GOOGLE_AUTH_ERROR',
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
      access_type: 'offline'
    });
    
    return `${GoogleDriveStorage.AUTH_ENDPOINT}?${params.toString()}`;
  }

  private async handleAuthCode(code: string): Promise<void> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.config.redirectUri
    });

    const response = await fetch(GoogleDriveStorage.TOKEN_ENDPOINT, {
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

    const body = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    });

    const response = await fetch(GoogleDriveStorage.TOKEN_ENDPOINT, {
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

  private async getOrCreateAppFolder(): Promise<string> {
    if (this.appFolderId) {
      return this.appFolderId;
    }

    // First, check if the folder already exists
    const searchUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files?q=name='Biomarkr' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    
    const searchResponse = await this.makeRequest(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
      this.appFolderId = searchData.files[0].id;
      return this.appFolderId;
    }

    // Create the folder if it doesn't exist
    const createUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files`;
    const createResponse = await this.makeRequest(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Biomarkr',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });

    const folderData = await createResponse.json();
    this.appFolderId = folderData.id;
    return this.appFolderId;
  }

  async uploadFile(filename: string, content: string): Promise<string> {
    const folderId = await this.getOrCreateAppFolder();
    
    // Check if file already exists
    const searchUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files?q=name='${filename}' and '${folderId}' in parents and trashed=false`;
    const searchResponse = await this.makeRequest(searchUrl);
    const searchData = await searchResponse.json();

    let fileId: string;
    
    if (searchData.files && searchData.files.length > 0) {
      // Update existing file
      fileId = searchData.files[0].id;
      const updateUrl = `${GoogleDriveStorage.UPLOAD_ENDPOINT}/files/${fileId}?uploadType=media`;
      
      const response = await this.makeRequest(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: content
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
      }
    } else {
      // Create new file
      const metadata = {
        name: filename,
        parents: [folderId]
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
      form.append('file', new Blob([content], {type: 'application/octet-stream'}));

      const response = await fetch(`${GoogleDriveStorage.UPLOAD_ENDPOINT}/files?uploadType=multipart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: form
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
      }

      const result = await response.json();
      fileId = result.id;
    }

    return fileId;
  }

  async downloadFile(filename: string): Promise<string> {
    const folderId = await this.getOrCreateAppFolder();
    
    // Find the file
    const searchUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files?q=name='${filename}' and '${folderId}' in parents and trashed=false`;
    const searchResponse = await this.makeRequest(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.files || searchData.files.length === 0) {
      throw new Error('File not found');
    }

    const fileId = searchData.files[0].id;
    const downloadUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files/${fileId}?alt=media`;
    
    const response = await this.makeRequest(downloadUrl);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Download failed: ${error}`);
    }

    return await response.text();
  }

  async listFiles(): Promise<CloudStorageFile[]> {
    const folderId = await this.getOrCreateAppFolder();
    
    const url = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,size,modifiedTime)`;
    
    const response = await this.makeRequest(url);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`List files failed: ${error}`);
    }

    const data = await response.json();
    
    return data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      size: parseInt(file.size) || 0,
      modifiedTime: file.modifiedTime
    }));
  }

  async deleteFile(filename: string): Promise<void> {
    const folderId = await this.getOrCreateAppFolder();
    
    // Find the file
    const searchUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files?q=name='${filename}' and '${folderId}' in parents and trashed=false`;
    const searchResponse = await this.makeRequest(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.files || searchData.files.length === 0) {
      return; // File doesn't exist, consider it deleted
    }

    const fileId = searchData.files[0].id;
    const deleteUrl = `${GoogleDriveStorage.DRIVE_ENDPOINT}/files/${fileId}`;
    
    const response = await this.makeRequest(deleteUrl, {
      method: 'DELETE'
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.text();
      throw new Error(`Delete failed: ${error}`);
    }
  }

  disconnect(): void {
    this.clearTokensFromStorage();
    this.accessToken = null;
    this.refreshToken = null;
    this.appFolderId = null;
  }
}