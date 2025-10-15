# SocialSonic AI Backend

A powerful Node.js backend API for AI-powered social media content generation using OpenAI's GPT and DALL-E models.

## 🚀 Features

- **AI Content Generation**: Text and image generation using OpenAI
- **User Management**: Authentication, authorization, and subscription management
- **Credit System**: Usage tracking and limits
- **Content Management**: Store, retrieve, and manage generated content
- **Rate Limiting**: Prevent API abuse
- **Security**: JWT authentication, input validation, and security headers
- **MongoDB Integration**: Robust data storage with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API Key

## 🛠️ Installation

1. **Clone and navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

5. **Start the server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📊 Database Setup

**Seed the database with sample data:**

```bash
npm run seed
```

This creates sample users:

- `john@example.com` (Premium) - password: `password123`
- `jane@example.com` (Free) - password: `password123`
- `admin@socialsonic.com` (Enterprise) - password: `admin123`

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/linkedin` - LinkedIn OAuth
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### AI Content Generation

- `POST /api/ai/generate-image` - Generate AI image
- `POST /api/ai/generate-text` - Generate AI text
- `POST /api/ai/suggestions` - Get content suggestions
- `GET /api/ai/health` - Check OpenAI service health

### Content Management

- `GET /api/ai/content` - Get user's content history
- `GET /api/ai/content/:id` - Get specific content
- `DELETE /api/ai/content/:id` - Delete content
- `POST /api/ai/content/:id/like` - Like content
- `GET /api/ai/stats` - Get user statistics

### User Management

- `GET /api/users/subscription` - Get subscription details
- `POST /api/users/upgrade` - Upgrade subscription

### Public Content

- `GET /api/content/public` - Get public content showcase
- `PUT /api/content/:id/visibility` - Toggle content visibility

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 💳 Credit System

- **Free Tier**: 10 credits
- **Premium**: 100 credits
- **Enterprise**: 1000 credits

Credit usage:

- Text generation (GPT-3.5): 1 credit
- Text generation (GPT-4): 2 credits
- Image generation (DALL-E 2): 1 credit
- Image generation (DALL-E 3): 2 credits

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication tokens

## 📝 Request/Response Examples

### Generate AI Image

```bash
curl -X POST http://localhost:5000/api/ai/generate-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "prompt": "A professional business meeting in a modern office",
    "style": "realistic",
    "aspectRatio": "landscape"
  }'
```

### Generate AI Text

```bash
curl -X POST http://localhost:5000/api/ai/generate-text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "prompt": "Tips for remote work productivity",
    "writingStyle": "professional",
    "postCategory": "tips-advice",
    "length": "medium"
  }'
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring

- Health check endpoint: `GET /health`
- OpenAI service health: `GET /api/ai/health`
- Request logging with Morgan
- Error tracking and reporting

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
JWT_SECRET=your-production-secret
FRONTEND_URL=https://yourdomain.com
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 API Documentation

Full API documentation is available at `/api/docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the logs for detailed error messages
- Ensure all environment variables are set correctly
- Verify MongoDB and OpenAI API connectivity
- Check rate limits and credit usage

## 🔄 Version History

- **v1.0.0**: Initial release with AI generation capabilities
- **v1.1.0**: Added content management and public showcase
- **v1.2.0**: Enhanced security and rate limiting
