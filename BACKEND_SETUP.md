# SocialSonic AI Backend Setup Guide

## 🚀 Complete Backend with MongoDB, Express, Node.js & OpenAI Integration

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API Key

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/socialsonic
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialsonic

# OpenAI API Key (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Next.js API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=development
PORT=5000
```

### 3. Start MongoDB (if using local)

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

### 4. Start the Backend Server

```bash
npm run server
```

The backend will be running on `http://localhost:5000`

### 5. Start the Frontend

```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🎯 API Endpoints

### AI Content Generation

#### Generate AI Image

```http
POST /api/ai/generate-image
Content-Type: application/json

{
  "prompt": "A professional business meeting in a modern office",
  "style": "realistic",
  "aspectRatio": "landscape",
  "userId": "user_id_here"
}
```

#### Generate AI Text

```http
POST /api/ai/generate-text
Content-Type: application/json

{
  "prompt": "Tips for remote work productivity",
  "writingStyle": "professional",
  "postCategory": "tips-advice",
  "useViralTemplate": true,
  "length": "medium",
  "userId": "user_id_here"
}
```

#### Get Content History

```http
GET /api/ai/content/{userId}?type=image&page=1&limit=10
```

#### Get User Stats

```http
GET /api/ai/stats/{userId}
```

#### Get Content Suggestions

```http
POST /api/ai/suggestions
Content-Type: application/json

{
  "type": "image",
  "context": "business productivity"
}
```

## 📊 Database Schema

### User Model

```javascript
{
  email: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
  linkedinId: String,
  subscription: {
    type: String, // 'free', 'premium', 'enterprise'
    creditsUsed: Number,
    creditsLimit: Number
  },
  preferences: {
    defaultWritingStyle: String,
    defaultPostCategory: String
  }
}
```

### AI Content Model

```javascript
{
  userId: String,
  type: String, // 'image', 'text', 'carousel', 'video', 'poll'
  prompt: String,
  generatedContent: Mixed,
  metadata: {
    style: String,
    aspectRatio: String,
    writingStyle: String,
    postCategory: String,
    useViralTemplate: Boolean,
    length: Number
  },
  status: String, // 'pending', 'completed', 'failed'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Features Implemented

### ✅ AI Image Generation

- DALL-E 3 integration
- Multiple styles (Realistic, Animation)
- Multiple aspect ratios (Square, Landscape, Portrait)
- Image URL generation and storage

### ✅ AI Text Generation

- GPT-4 integration
- Multiple writing styles
- Post categories
- Viral template options
- Length control

### ✅ User Management

- Credit system
- Usage tracking
- Subscription tiers
- User preferences

### ✅ Content Management

- Content history
- Content statistics
- Content deletion
- Content metadata

### ✅ Frontend Integration

- Real-time preview
- Loading states
- Error handling
- User stats display
- Credit tracking

## 🎨 Frontend Features

### Enhanced UI Components

- **Arrow Icons**: Rotating arrows for panel states
- **Loading States**: Spinner animations during generation
- **Error Handling**: User-friendly error messages
- **Preview System**: LinkedIn-style post previews
- **Credit Display**: Real-time credit usage tracking
- **Stats Dashboard**: User statistics and content history

### Interactive Elements

- **Panel Animations**: Smooth slide-in/out transitions
- **Hover Effects**: Scale and gradient effects
- **Status Indicators**: Active tool indicators
- **Progress Bars**: Credit usage visualization

## 🔒 Security Features

- Credit limit enforcement
- User authentication checks
- Input validation
- Error handling
- Rate limiting ready

## 📈 Scalability Features

- MongoDB indexing
- Pagination support
- Efficient queries
- Modular architecture
- Environment-based configuration

## 🚀 Next Steps

1. Add user authentication middleware
2. Implement rate limiting
3. Add image storage (AWS S3/Cloudinary)
4. Add webhook support
5. Implement caching (Redis)
6. Add analytics tracking
7. Add email notifications
8. Implement team collaboration features

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in `.env.local`

2. **OpenAI API Error**

   - Verify API key is correct
   - Check OpenAI account credits
   - Ensure API key has proper permissions

3. **CORS Issues**

   - Backend includes CORS middleware
   - Check API URL in frontend configuration

4. **Port Conflicts**
   - Backend: Change PORT in `.env.local`
   - Frontend: Use `npm run dev -- -p 3001`

## 📞 Support

For issues or questions, check the console logs for detailed error messages.
