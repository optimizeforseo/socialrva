# SocialSonic Clone - AI-Powered Social Media Management

A Next.js application that replicates SocialSonic's functionality with LinkedIn authentication and AI image generation.

## Features

- 🔐 LinkedIn OAuth authentication
- 🎨 AI-powered image generation
- 📱 Responsive design with Tailwind CSS
- 🚀 Modern Next.js 14 with App Router
- 💾 MongoDB integration ready
- 🎯 LinkedIn content creation tools

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: LinkedIn OAuth 2.0
- **AI**: OpenAI API integration ready

## Quick Start

1. **Clone and Install**

   ```bash
   npm install
   ```

2. **Environment Setup**

   Update `.env.local` with your credentials:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   MONGODB_URI=mongodb://localhost:27017/socialsonic-clone
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **LinkedIn App Setup**

   Create a LinkedIn app at [LinkedIn Developer Portal](https://developer.linkedin.com/):

   - Set redirect URI: `http://localhost:3000/auth/callback`
   - Request permissions: `r_liteprofile`, `r_emailaddress`, `w_member_social`

4. **Run Development Server**

   ```bash
   npm run dev
   ```

5. **Open Application**

   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/linkedin/     # LinkedIn OAuth handler
│   │   └── generate-image/    # AI image generation
│   ├── auth/callback/         # OAuth callback page
│   ├── components/
│   │   ├── LinkedInAuth.js    # LinkedIn login component
│   │   └── AIImageGenerator.js # AI image generator
│   ├── dashboard/             # User dashboard
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   └── page.js               # Landing page
├── .env.local                # Environment variables
└── package.json              # Dependencies
```

## Key Components

### LinkedInAuth Component

- Handles LinkedIn OAuth flow
- Secure token exchange
- User profile retrieval

### AIImageGenerator Component

- Text-to-image generation
- Real-time preview
- Quick prompt suggestions

### Dashboard

- User profile display
- Content creation tools
- Analytics overview

## API Endpoints

- `POST /api/auth/linkedin` - Exchange OAuth code for access token
- `POST /api/generate-image` - Generate AI images from text prompts

## Environment Variables

| Variable                 | Description                         | Required |
| ------------------------ | ----------------------------------- | -------- |
| `NEXTAUTH_URL`           | Application URL                     | Yes      |
| `NEXTAUTH_SECRET`        | JWT secret key                      | Yes      |
| `LINKEDIN_CLIENT_ID`     | LinkedIn app client ID              | Yes      |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn app secret                 | Yes      |
| `MONGODB_URI`            | MongoDB connection string           | Optional |
| `OPENAI_API_KEY`         | OpenAI API key for image generation | Optional |

## Development Notes

- The image generation currently uses placeholder images
- Uncomment OpenAI integration in `/api/generate-image/route.js` when ready
- MongoDB integration is prepared but not implemented
- Add your LinkedIn app credentials to enable authentication

## Next Steps

1. Set up LinkedIn Developer App
2. Add OpenAI API key for real image generation
3. Implement MongoDB user storage
4. Add content creation features
5. Build analytics dashboard

## License

MIT License - feel free to use this as a starting point for your own projects!
