/**
 * Validates if a client ID is a real production value (not a demo/placeholder)
 */
export function isValidClientId(clientId: string | undefined): boolean {
  if (!clientId) return false;
  
  // Check for demo values
  if (clientId.startsWith('demo-')) return false;
  
  // Check for placeholder template values
  if (clientId.startsWith('your-')) return false;
  if (clientId.includes('client-id')) return false;
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^[x]+$/i,                    // All X's
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, // UUID format but all zeros
    /^(test|example|placeholder)/i // Common placeholder prefixes
  ];
  
  for (const pattern of placeholderPatterns) {
    if (pattern.test(clientId)) return false;
  }
  
  // Minimum length check (most real client IDs are longer than 10 chars)
  if (clientId.length < 10) return false;
  
  return true;
}

/**
 * Gets the list of available cloud providers with valid client IDs
 */
export function getAvailableProviders() {
  const allProviders = [
    {
      id: 'onedrive' as const,
      name: 'Microsoft OneDrive',
      description: 'Connect to your OneDrive account',
      color: 'blue' as const,
      clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID
    },
    {
      id: 'googledrive' as const,
      name: 'Google Drive',
      description: 'Connect to your Google Drive account',
      color: 'red' as const,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
    },
    {
      id: 'dropbox' as const,
      name: 'Dropbox',
      description: 'Connect to your Dropbox account',
      color: 'indigo' as const,
      clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID
    }
  ];

  return allProviders.filter(provider => isValidClientId(provider.clientId));
}