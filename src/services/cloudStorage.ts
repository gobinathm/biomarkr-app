export interface CloudStorageFile {
  id: string;
  name: string;
  size: number;
  modifiedTime: string;
  content?: string;
}

export interface CloudStorageConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export abstract class CloudStorageProvider {
  protected accessToken: string | null = null;
  protected refreshToken: string | null = null;
  protected config: CloudStorageConfig;

  constructor(config: CloudStorageConfig) {
    this.config = config;
    this.loadTokensFromStorage();
  }

  abstract authenticate(): Promise<void>;
  abstract uploadFile(filename: string, content: string): Promise<string>;
  abstract downloadFile(filename: string): Promise<string>;
  abstract listFiles(): Promise<CloudStorageFile[]>;
  abstract deleteFile(filename: string): Promise<void>;
  abstract disconnect(): void;

  protected saveTokensToStorage(): void {
    const tokens = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken
    };
    localStorage.setItem(`${this.getProviderName()}-tokens`, JSON.stringify(tokens));
  }

  protected loadTokensFromStorage(): void {
    const stored = localStorage.getItem(`${this.getProviderName()}-tokens`);
    if (stored) {
      try {
        const tokens = JSON.parse(stored);
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      } catch (error) {
        console.error('Failed to load tokens from storage:', error);
      }
    }
  }

  protected clearTokensFromStorage(): void {
    localStorage.removeItem(`${this.getProviderName()}-tokens`);
  }

  abstract getProviderName(): string;

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      if (this.refreshToken) {
        await this.refreshAccessToken();
        // Retry the request with new token
        return this.makeRequest(url, options);
      } else {
        throw new Error('Authentication expired');
      }
    }

    return response;
  }

  protected async refreshAccessToken(): Promise<void> {
    // This will be implemented by each provider
    throw new Error('Refresh token not implemented');
  }
}