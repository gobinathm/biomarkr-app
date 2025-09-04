# OAuth Authentication Troubleshooting

This guide helps troubleshoot common issues with cloud storage authentication in Biomarkr.

## How the OAuth Flow Works

1. **User clicks "Connect"** → Opens cloud provider's auth page in popup window
2. **User authorizes** → Provider redirects to callback page with auth code
3. **Callback page** → Sends auth code to parent window and closes popup
4. **Parent window** → Exchanges auth code for access tokens
5. **Connection complete** → User returns to storage page with connected provider

## Common Issues & Solutions

### Issue: Popup Opens But Doesn't Close

**Symptoms:**
- Authentication popup opens correctly
- User completes authorization successfully
- Popup remains open or shows blank page
- No connection established

**Causes & Solutions:**

#### 1. Popup Blockers
- **Problem**: Browser blocked the popup or its communication
- **Solution**: Allow popups for your domain in browser settings
- **Test**: Look for popup blocker icon in address bar

#### 2. Redirect URI Mismatch
- **Problem**: Provider redirects to wrong callback URL
- **Solution**: Verify redirect URIs in provider console match exactly:
  - Development: `http://localhost:5173/auth/[provider]/callback/index.html`
  - Production: `https://yourdomain.com/auth/[provider]/callback/index.html`

#### 3. Browser Console Errors
- **Problem**: JavaScript errors preventing message handling
- **Solution**: Open browser dev tools and check console for errors
- **Common errors**:
  - CORS issues
  - Content Security Policy violations
  - JavaScript execution errors

### Issue: "Authentication Failed" Error

**Symptoms:**
- Popup closes immediately
- Error message appears
- No auth code received

**Solutions:**

#### 1. Check Client ID Configuration
```bash
# Verify environment variables are set correctly
echo $VITE_ONEDRIVE_CLIENT_ID
echo $VITE_GOOGLE_CLIENT_ID
echo $VITE_DROPBOX_CLIENT_ID
```

#### 2. Verify Provider App Setup
- **OneDrive**: Check Azure App Registration
- **Google**: Check Google Cloud Console
- **Dropbox**: Check Dropbox App Console

#### 3. Check Scopes/Permissions
- Ensure your app requests correct permissions
- Some providers require app review for certain scopes

### Issue: Popup Blocked Entirely

**Symptoms:**
- No popup window appears
- Browser shows popup blocked notification
- Error: "Failed to open authentication popup"

**Solutions:**

#### 1. Enable Popups
- **Chrome**: Click popup icon in address bar → "Always allow"
- **Firefox**: Click shield icon → "Allow popups"
- **Safari**: Preferences → Websites → Pop-up Windows → Allow

#### 2. User Action Required
- Popups must be triggered by user action (click)
- Cannot be opened programmatically without user interaction

## Browser-Specific Issues

### Chrome
- May block third-party cookies affecting OAuth
- Solution: Temporarily disable "Block third-party cookies"

### Safari
- Strict popup and cookie policies
- Solution: Enable "Allow cross-website tracking" temporarily

### Firefox
- Enhanced Tracking Protection may interfere
- Solution: Add site to exceptions or use Standard protection

## Debugging Tips

### 1. Enable Console Logging
The OAuth flow includes detailed console logging. Open browser dev tools:

```javascript
// You should see logs like:
"Opening [Provider] auth popup: https://..."
"Received [Provider] message: {...}"
"[Provider] auth success, processing code"
```

### 2. Check Network Tab
Monitor network requests during authentication:
- Initial auth URL request
- Token exchange requests
- Any failed requests or CORS errors

### 3. Inspect Popup Window
If popup doesn't close:
1. Right-click in popup → "Inspect"
2. Check console for errors
3. Verify URL parameters are correct

### 4. Test Different Browsers
Try authentication in different browsers to isolate browser-specific issues.

## Provider-Specific Issues

### OneDrive (Microsoft)
- **Common Issue**: "AADSTS50011: Reply URL mismatch"
- **Solution**: Exact match required for redirect URI
- **Note**: Case-sensitive URL matching

### Google Drive
- **Common Issue**: "Error 403: access_denied"
- **Solution**: Enable Google Drive API in Google Cloud Console
- **Note**: May require OAuth consent screen configuration

### Dropbox
- **Common Issue**: "Invalid redirect_uri"
- **Solution**: Add exact callback URL in Dropbox App Console
- **Note**: No wildcards allowed in redirect URIs

#### Permissions Error
- **Error**: "Your app is not permitted to access this endpoint because it does not have the required scope"
- **Solution**: Go to Dropbox App Console → Permissions tab → Enable required scopes:
  - `files.metadata.read` (for listing files)
  - `files.content.read` (for downloading files) 
  - `files.content.write` (for uploading files)

## Testing Authentication Locally

### 1. Use Real Client IDs
Demo client IDs won't work for actual authentication:
```bash
# Replace in .env file
VITE_DROPBOX_CLIENT_ID=your-real-client-id
```

### 2. Test Popup Communication
Create a simple test to verify popup can communicate with parent:
```javascript
// In browser console
window.open('/auth/dropbox/callback?code=test', 'test', 'width=400,height=300');
```

### 3. Verify Callback Pages
Visit callback pages directly to ensure they load:
- `http://localhost:5173/auth/dropbox/callback/index.html`
- `http://localhost:5173/auth/onedrive/callback/index.html`
- `http://localhost:5173/auth/google/callback/index.html`

## Production Deployment Checklist

- [ ] Update all redirect URIs in provider consoles
- [ ] Set production environment variables
- [ ] Test OAuth flow on production domain
- [ ] Verify HTTPS is working correctly
- [ ] Check Content Security Policy allows popup communication
- [ ] Test with real user accounts

## Getting Help

If authentication still doesn't work:

1. **Check Console**: Look for error messages in browser dev tools
2. **Provider Logs**: Check provider's developer console for API errors
3. **Network Analysis**: Use browser network tab to inspect requests
4. **Test Environment**: Try with fresh browser session/incognito mode

## Security Notes

- Never commit real client IDs to version control
- Use environment variables for all sensitive configuration
- Regularly rotate client secrets if your provider uses them
- Monitor OAuth app permissions and usage

---

*This guide covers the most common OAuth authentication issues. For provider-specific documentation, consult each provider's official OAuth documentation.*