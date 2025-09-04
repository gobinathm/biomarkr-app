/**
 * Enhanced popup authentication handler with better error handling
 */
export class PopupAuthHandler {
  private popup: Window | null = null;
  private isResolved = false;
  private checkInterval: number | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private timeoutId: number | null = null;

  constructor(
    private authUrl: string,
    private windowName: string,
    private successMessageType: string,
    private errorMessageType: string,
    private onSuccess: (data: any) => Promise<void>,
    private timeoutMs: number = 300000 // 5 minutes
  ) {}

  async authenticate(): Promise<void> {
    if (this.isResolved) {
      throw new Error('Authentication already in progress');
    }

    console.log(`Opening ${this.windowName} auth popup:`, this.authUrl);

    // Open popup with better options
    this.popup = window.open(
      this.authUrl, 
      this.windowName, 
      'width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );

    if (!this.popup) {
      throw new Error('Failed to open authentication popup. Please allow popups for this site and try again.');
    }

    // Focus the popup
    this.popup.focus();

    return new Promise((resolve, reject) => {
      this.setupCleanup(() => {
        this.isResolved = true;
        reject(new Error('Authentication cancelled by user'));
      });

      this.setupMessageHandler(async (event) => {
        console.log(`Received ${this.windowName} message:`, event.data, 'from:', event.origin);

        if (event.origin !== window.location.origin) {
          console.log('Message origin mismatch, ignoring');
          return;
        }

        if (event.data.type === this.successMessageType) {
          if (this.isResolved) return;
          this.isResolved = true;

          console.log(`${this.windowName} auth success, processing`);
          this.cleanup();

          try {
            await this.onSuccess(event.data);
            resolve();
          } catch (error) {
            console.error(`Error handling ${this.windowName} auth:`, error);
            reject(error);
          }
        } else if (event.data.type === this.errorMessageType) {
          if (this.isResolved) return;
          this.isResolved = true;

          console.error(`${this.windowName} auth error:`, event.data.error);
          this.cleanup();
          reject(new Error(event.data.error));
        }
      });

      // Setup timeout
      this.timeoutId = window.setTimeout(() => {
        if (!this.isResolved) {
          this.isResolved = true;
          this.cleanup();
          reject(new Error(`Authentication timeout after ${this.timeoutMs / 1000} seconds - please try again`));
        }
      }, this.timeoutMs);
    });
  }

  private setupCleanup(onClosed: () => void) {
    this.checkInterval = window.setInterval(() => {
      if (this.popup?.closed && !this.isResolved) {
        onClosed();
      }
    }, 1000);
  }

  private setupMessageHandler(handler: (event: MessageEvent) => Promise<void>) {
    this.messageHandler = handler;
    window.addEventListener('message', this.messageHandler);
  }

  private cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.popup && !this.popup.closed) {
      this.popup.close();
    }
    this.popup = null;
  }
}

/**
 * Helper function to detect if popups are blocked
 */
export function testPopupSupport(): boolean {
  try {
    const testPopup = window.open('', 'test', 'width=1,height=1');
    if (testPopup) {
      testPopup.close();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}