# LinkedIn OAuth Setup Guide

## Step 1: Create LinkedIn App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in the required information:
   - **App name**: SocialSonic AI
   - **LinkedIn Page**: Your company page (or create one)
   - **Privacy policy URL**: Your privacy policy URL
   - **App logo**: Upload your app logo

## Step 2: Configure OAuth Settings

1. In your LinkedIn app dashboard, go to the "Auth" tab
2. Add these **Authorized redirect URLs**:

   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

3. Request these **OAuth 2.0 scopes**:
   - `r_liteprofile` - Access to basic profile info
   - `r_emailaddress` - Access to email address
   - `w_member_social` - Post on behalf of user

## Step 3: Get Your Credentials

1. In the "Auth" tab, copy your:
   - **Client ID**
   - **Client Secret**

## Step 4: Update Environment Variables

Update your `.env.local` file with your LinkedIn credentials:

```env
# LinkedIn OAuth Configuration
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_actual_client_id_here
LINKEDIN_CLIENT_SECRET=your_actual_client_secret_here
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Step 5: Test the Integration

1. Restart your development server
2. Go to `http://localhost:3000`
3. Click "Continue with LinkedIn"
4. You should be redirected to LinkedIn for authorization
5. After approval, you'll be redirected back to your app

## Important Notes

- **LinkedIn Review**: For production, LinkedIn may require app review for certain scopes
- **Rate Limits**: LinkedIn has API rate limits - be mindful of usage
- **Token Expiry**: LinkedIn access tokens expire after 60 days
- **HTTPS Required**: Production apps must use HTTPS

## Troubleshooting

### Common Issues:

1. **"Invalid redirect_uri"**

   - Make sure the redirect URI in your app matches exactly
   - Check for trailing slashes

2. **"Invalid client_id"**

   - Verify your client ID is correct
   - Make sure environment variables are loaded

3. **"Scope not authorized"**

   - Request the required scopes in your LinkedIn app
   - Some scopes require LinkedIn review

4. **"Access token expired"**
   - Implement token refresh logic
   - Ask users to re-authenticate

## Testing Without LinkedIn App

If you don't have LinkedIn credentials yet, the app will fall back to demo mode automatically. Users can click "Try Demo Mode" to test the functionality.

## Production Deployment

For production:

1. Update redirect URI to your production domain
2. Set production environment variables
3. Enable HTTPS
4. Submit for LinkedIn review if required
5. Monitor API usage and rate limits

## Support

If you encounter issues:

1. Check LinkedIn Developer Documentation
2. Verify your app settings
3. Test with demo mode first
4. Check browser console for errors
