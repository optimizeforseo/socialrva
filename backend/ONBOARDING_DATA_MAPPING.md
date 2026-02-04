# Onboarding Data Flow Mapping

## Frontend to Backend Data Mapping

### Step 1: Email Verification
**Component**: `EmailVerificationStep.jsx`

**Data Collected**:
```javascript
{
  email: "user@example.com",
  emailVerified: true
}
```

**Stored In Model**:
- `user.email` (root level)
- `user.profile.emailVerified`

---

### Step 2: Language & Country
**Component**: `LanguageCountryStep.jsx`

**Data Collected**:
```javascript
{
  language: "en",
  country: "US"
}
```

**Stored In Model**:
- `user.profile.language`
- `user.profile.country`

---

### Step 3: LinkedIn Topics
**Component**: `LinkedInTopicsStep.jsx`

**Data Collected**:
```javascript
{
  selectedTopics: [
    "technology",
    "business",
    "marketing"
  ]
}
```

**Stored In Model**:
- `user.preferences.selectedTopics` (Array of Strings)

---

### Step 4: LinkedIn Superstars
**Component**: `LinkedInSuperstarsStep.jsx`

**Data Collected**:
```javascript
{
  selectedSuperstars: [
    "superstar-id-1",
    "superstar-id-2",
    "superstar-id-3"
  ]
}
```

**Stored In Model**:
- `user.preferences.selectedSuperstars` (Array of Strings)

---

### Step 5: Industry Leaders
**Component**: `IndustryLeadersStep.jsx`

**Data Collected**:
```javascript
{
  selectedLeaders: [
    "leader-id-1",
    "leader-id-2"
  ]
}
```

**Stored In Model**:
- `user.preferences.selectedLeaders` (Array of Strings)

---

### Step 6: AI Post Generation
**Component**: `AIPostGenerationStep.jsx`

**Data Collected**:
```javascript
{
  selectedPostTopic: "career-growth",
  generatedPost: "🚀 Career Growth Mindset\n\nAfter 5 years..."
}
```

**Stored In Model**:
- `user.preferences.selectedPostTopic` (String)
- `user.preferences.generatedPost` (String)

---

### Step 7: Profile Analysis
**Component**: `ProfileAnalysisStep.jsx`

**Data Collected**:
```javascript
{
  profileAnalysis: {
    profileScore: 78,
    strengths: [
      "Strong professional headline",
      "Comprehensive work experience"
    ],
    improvements: [
      "Add more keywords",
      "Increase posting frequency"
    ],
    insights: [
      {
        title: "Content Performance",
        description: "Your posts get 3x more engagement",
        icon: "trending-up",
        color: "green"
      }
    ],
    recommendations: [
      {
        title: "Optimize Your Headline",
        description: "Add industry keywords",
        priority: "High",
        effort: "Low"
      }
    ]
  },
  onboardingComplete: true
}
```

**Stored In Model**:
- `user.profileAnalysis.profileScore` (Number)
- `user.profileAnalysis.strengths` (Array of Strings)
- `user.profileAnalysis.improvements` (Array of Strings)
- `user.profileAnalysis.insights` (Array of Objects)
- `user.profileAnalysis.recommendations` (Array of Objects)
- `user.profileAnalysis.analyzedAt` (Date - auto-generated)
- `user.profile.isOnboardingComplete` (Boolean)
- `user.onboardingCompletedAt` (Date - auto-generated)

---

## Complete Request Body Example

When `completeOnboarding()` is called, all collected data is sent:

```javascript
{
  // Step 1
  "email": "user@example.com",
  "emailVerified": true,
  
  // Step 2
  "language": "en",
  "country": "US",
  
  // Step 3
  "selectedTopics": ["technology", "business", "marketing"],
  
  // Step 4
  "selectedSuperstars": ["superstar-1", "superstar-2"],
  
  // Step 5
  "selectedLeaders": ["leader-1", "leader-2"],
  
  // Step 6
  "selectedPostTopic": "career-growth",
  "generatedPost": "🚀 Career Growth Mindset...",
  
  // Step 7
  "profileAnalysis": {
    "profileScore": 78,
    "strengths": [...],
    "improvements": [...],
    "insights": [...],
    "recommendations": [...]
  }
}
```

---

## User Model Schema

```javascript
{
  // Root Level
  email: String (required, unique),
  firstName: String (required),
  lastName: String (required),
  password: String (hashed),
  profilePicture: String,
  linkedinId: String,
  
  // Profile Object
  profile: {
    language: String (default: 'en'),
    country: String (default: 'US'),
    emailVerified: Boolean (default: false),
    isOnboardingComplete: Boolean (default: false)
  },
  
  // Preferences Object
  preferences: {
    defaultWritingStyle: String,
    defaultPostCategory: String,
    notifications: {
      email: Boolean,
      marketing: Boolean
    },
    // Onboarding Data
    selectedTopics: [String],
    selectedSuperstars: [String],
    selectedLeaders: [String],
    selectedPostTopic: String,
    generatedPost: String
  },
  
  // Profile Analysis Object
  profileAnalysis: {
    profileScore: Number (0-100),
    strengths: [String],
    improvements: [String],
    insights: [{
      title: String,
      description: String,
      icon: String,
      color: String
    }],
    recommendations: [{
      title: String,
      description: String,
      priority: String,
      effort: String
    }],
    analyzedAt: Date
  },
  
  // Timestamps
  onboardingCompletedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## API Endpoint

**POST** `/api/onboarding/save`

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response**:
```javascript
{
  "success": true,
  "message": "LinkedIn onboarding completed successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "profile": { ... },
      "preferences": { ... },
      "profileAnalysis": { ... },
      "onboardingCompletedAt": "2026-01-16T10:30:00.000Z"
    }
  }
}
```

---

## Validation Rules

1. **Required Fields**:
   - `language` (must be provided)
   - `country` (must be provided)
   - `selectedTopics` (must have at least 1 topic)

2. **Optional Fields**:
   - `email` (if different from existing)
   - `emailVerified`
   - `selectedSuperstars`
   - `selectedLeaders`
   - `selectedPostTopic`
   - `generatedPost`
   - `profileAnalysis`

3. **Auto-Generated**:
   - `profile.isOnboardingComplete` (set to true)
   - `onboardingCompletedAt` (current timestamp)
   - `profileAnalysis.analyzedAt` (current timestamp)

---

## Testing Checklist

- [ ] Email verification saves email and emailVerified flag
- [ ] Language and country are saved correctly
- [ ] Topics array is populated
- [ ] Superstars array is populated (optional)
- [ ] Leaders array is populated (optional)
- [ ] Post topic and generated post are saved
- [ ] Profile analysis object is saved with all nested data
- [ ] isOnboardingComplete flag is set to true
- [ ] onboardingCompletedAt timestamp is recorded
- [ ] User can retrieve saved data via GET /api/onboarding/status
