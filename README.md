# SocialRva - AI-Powered LinkedIn Growth Platform

🚀 **SocialRva** is an AI-powered social media growth platform specifically designed for LinkedIn professionals. It helps users create engaging content, analyze their profile performance, and grow their professional network through intelligent insights and automation.

## ✨ Features

### 🎯 **LinkedIn-Focused Onboarding**
- **Email Verification**: Secure account setup
- **Language & Country Selection**: Personalized localization
- **Topic Selection**: Choose from trending LinkedIn topics
- **Superstar Discovery**: Follow real LinkedIn influencers
- **Industry Leaders**: Connect with thought leaders
- **AI Post Generation**: Create engaging LinkedIn posts
- **Profile Analysis**: Get AI-powered insights and recommendations

### 🤖 **AI-Powered Content Creation**
- Smart post generation based on user interests
- Multiple content types support
- Personalized writing style adaptation
- Industry-specific content suggestions

### 📊 **Analytics & Insights**
- Profile performance scoring
- Engagement pattern analysis
- Growth recommendations
- Network analysis

### 🔐 **Authentication & Security**
- JWT-based authentication
- LinkedIn OAuth integration
- Secure password hashing
- Protected API endpoints

## 🏗️ **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hooks** - State management

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **CORS** - Cross-origin resource sharing

## 📁 **Project Structure**

```
socialrva/
├── backend/                 # Node.js Backend
│   ├── middleware/         # Authentication & error handling
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── uploads/           # File uploads
│   └── server.js          # Entry point
├── frontend/              # Next.js Frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   │   ├── onboarding/   # Onboarding flow
│   │   ├── dashboard/    # Dashboard components
│   │   ├── ui/          # UI components
│   │   └── layout/      # Layout components
│   ├── context/         # React context
│   ├── hooks/           # Custom hooks
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
└── public/              # Static assets
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/optimizeforseo/socialrva.git
cd socialrva
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**

**Backend (.env)**
```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/socialrva
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```

5. **Start Development Servers**

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5002
- Health Check: http://localhost:5002/health

## 📚 **API Documentation**

### **Authentication**
```bash
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### **Onboarding**
```bash
POST /api/onboarding/save           # Save onboarding data
GET  /api/onboarding/status         # Get onboarding status
POST /api/onboarding/linkedin-topics # Get LinkedIn topics
```

### **Users**
```bash
GET  /api/users/profile    # Get user profile
PUT  /api/users/profile    # Update user profile
```

## 🗄️ **Database Schema**

### **User Model**
```javascript
{
  email: String (required, unique),
  firstName: String (required),
  lastName: String (required),
  password: String (hashed),
  profile: {
    language: String,
    country: String,
    emailVerified: Boolean,
    isOnboardingComplete: Boolean
  },
  preferences: {
    selectedTopics: [String],
    selectedSuperstars: [String],
    selectedLeaders: [String],
    selectedPostTopic: String,
    generatedPost: String
  },
  profileAnalysis: {
    profileScore: Number,
    strengths: [String],
    improvements: [String],
    insights: [Object],
    recommendations: [Object]
  }
}
```

## 🔄 **Onboarding Flow**

1. **Email Verification** - Verify user email address
2. **Language & Country** - Set localization preferences
3. **LinkedIn Topics** - Select areas of interest
4. **LinkedIn Superstars** - Follow industry influencers
5. **Industry Leaders** - Connect with thought leaders
6. **AI Post Generation** - Create first LinkedIn post
7. **Profile Analysis** - Get AI-powered insights

## 🧪 **Testing**

### **Backend Testing**
```bash
cd backend
npm test
```

### **API Testing with Postman**
Import the collection from `backend/ONBOARDING_DATA_MAPPING.md`

## 🚀 **Deployment**

### **Backend Deployment**
- Deploy to Heroku, Railway, or DigitalOcean
- Set production environment variables
- Configure MongoDB Atlas

### **Frontend Deployment**
- Deploy to Vercel, Netlify, or AWS
- Set production API URL
- Configure domain and SSL

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 **Team**

- **Development Team** - Full-stack development
- **AI Team** - Content generation and analysis
- **Design Team** - UI/UX design

## 📞 **Support**

For support, email support@socialrva.com or join our Slack channel.

## 🔗 **Links**

- [Live Demo](https://socialrva.com)
- [Documentation](https://docs.socialrva.com)
- [API Reference](https://api.socialrva.com/docs)

---

**Made with ❤️ by the SocialRva Team**