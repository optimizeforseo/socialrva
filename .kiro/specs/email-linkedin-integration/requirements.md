# Email Verification & LinkedIn Data Integration - Requirements Specification

## Introduction

This specification addresses the enhancement of email verification system and LinkedIn data integration for SocialRva's onboarding process. The system needs to ensure proper email validation, secure storage, and dynamic fetching of real LinkedIn data for superstars and industry leaders.

## Glossary

- **Email Verification**: Process of validating email addresses for authenticity and deliverability
- **LinkedIn API Integration**: Real-time fetching of LinkedIn profile data, follower counts, and engagement metrics
- **Dynamic Data Fetching**: Real-time API calls to LinkedIn for authentic profile information
- **Email Storage**: Secure database storage of verified email addresses
- **Profile Validation**: Verification of LinkedIn profile authenticity and data integrity

## Current Implementation Analysis

### Email Storage Location
```javascript
// Current email storage in User model (backend/models/User.js)
email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  lowercase: true,
  trim: true,
  match: [
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    "Please enter a valid email",
  ],
}
```

### Current LinkedIn Data Implementation
```javascript
// Static data in backend/routes/onboarding.js
const allSuperstars = {
  technology: [
    {
      id: 'satya-nadella',
      name: 'Satya Nadella',
      title: 'Chairman and CEO at Microsoft',
      followers: '12.5M',
      linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
      // ... static data
    }
  ]
}
```

## Requirements

### Requirement 1: Enhanced Email Verification System

**User Story:** As a user, I want my email to be properly verified with real validation checks, so that only valid and deliverable email addresses are accepted.

#### Acceptance Criteria

1. WHEN a user enters an email address, THE System SHALL validate email format using comprehensive regex
2. WHEN email format is valid, THE System SHALL check against invalid domain blacklist
3. WHEN email passes basic validation, THE System SHALL perform DNS MX record lookup for domain verification
4. WHEN email is verified, THE System SHALL store it in the database with verification timestamp
5. WHEN invalid email is detected, THE System SHALL display specific error message explaining the issue

#### Technical Implementation

```javascript
// Enhanced email validation function
const validateEmail = async (email) => {
  // 1. Format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // 2. Invalid domain blacklist
  const invalidDomains = [
    'test.com', 'example.com', 'fake.com', 'invalid.com',
    'tempmail.com', '10minutemail.com', 'guerrillamail.com'
  ];
  
  // 3. DNS MX record verification
  const domain = email.split('@')[1];
  const mxRecords = await dns.resolveMx(domain);
  
  return {
    isValid: emailRegex.test(email) && 
             !invalidDomains.includes(domain) && 
             mxRecords.length > 0,
    domain,
    mxRecords: mxRecords.length
  };
};
```

### Requirement 2: Real-time LinkedIn Data Integration

**User Story:** As a user, I want to see real LinkedIn data including current follower counts and engagement metrics, so that I get authentic and up-to-date information about industry leaders.

#### Acceptance Criteria

1. WHEN LinkedIn superstars are displayed, THE System SHALL fetch real-time follower counts from LinkedIn API
2. WHEN industry leaders are shown, THE System SHALL display current company information and employee counts
3. WHEN profile data is fetched, THE System SHALL cache results for 24 hours to optimize performance
4. WHEN LinkedIn API is unavailable, THE System SHALL use cached data with appropriate staleness indicators
5. WHEN external LinkedIn profiles are accessed, THE System SHALL track click-through rates for analytics

#### Technical Implementation

```javascript
// Real LinkedIn API integration
const fetchLinkedInProfile = async (profileUrl) => {
  try {
    // Extract profile ID from LinkedIn URL
    const profileId = extractProfileId(profileUrl);
    
    // Check cache first
    const cachedData = await redis.get(`linkedin:${profileId}`);
    if (cachedData && !isStale(cachedData, 24 * 60 * 60 * 1000)) {
      return JSON.parse(cachedData);
    }
    
    // Fetch from LinkedIn API
    const response = await fetch(`https://api.linkedin.com/v2/people/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${linkedinAccessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    const profileData = await response.json();
    
    // Cache the result
    await redis.setex(`linkedin:${profileId}`, 24 * 60 * 60, JSON.stringify({
      ...profileData,
      cachedAt: new Date(),
      source: 'linkedin-api'
    }));
    
    return profileData;
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    // Return cached data even if stale
    return getCachedDataWithFallback(profileId);
  }
};
```

### Requirement 3: Dynamic Superstar and Leader Data

**User Story:** As a user, I want LinkedIn superstars and industry leaders to be dynamically fetched based on my selected topics, so that I get personalized and relevant recommendations.

#### Acceptance Criteria

1. WHEN user selects topics, THE System SHALL query LinkedIn API for relevant influencers in those categories
2. WHEN superstars are fetched, THE System SHALL include real engagement rates and recent post performance
3. WHEN industry leaders are displayed, THE System SHALL show current company size and recent achievements
4. WHEN data is unavailable, THE System SHALL provide meaningful fallback content
5. WHEN user clicks external links, THE System SHALL open authentic LinkedIn profiles in new tabs

#### Technical Implementation

```javascript
// Dynamic LinkedIn data fetching
const fetchDynamicSuperstars = async (selectedTopics) => {
  const superstars = [];
  
  for (const topic of selectedTopics) {
    try {
      // Search LinkedIn for influencers in this topic
      const searchResponse = await fetch(`https://api.linkedin.com/v2/people-search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${linkedinAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: topic,
          facets: ['industry', 'current-company'],
          count: 10,
          start: 0
        })
      });
      
      const searchData = await searchResponse.json();
      
      // Process and enrich profile data
      for (const profile of searchData.elements) {
        const enrichedProfile = await enrichProfileData(profile);
        superstars.push(enrichedProfile);
      }
    } catch (error) {
      console.error(`Error fetching superstars for topic ${topic}:`, error);
      // Use fallback static data for this topic
      superstars.push(...getStaticSuperstarsForTopic(topic));
    }
  }
  
  return superstars.slice(0, 6); // Limit to 6 superstars
};

const enrichProfileData = async (profile) => {
  // Fetch additional metrics
  const [followerCount, engagementRate, recentPosts] = await Promise.all([
    getFollowerCount(profile.id),
    getEngagementRate(profile.id),
    getRecentPosts(profile.id, 1)
  ]);
  
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`,
    title: profile.headline,
    followers: formatFollowerCount(followerCount),
    linkedinUrl: profile.publicProfileUrl,
    industry: profile.industry,
    verified: profile.premiumSubscriber,
    recentPost: recentPosts[0]?.text || 'No recent posts available',
    engagement: `${engagementRate}%`,
    location: profile.location?.name,
    profilePicture: profile.profilePicture?.displayImage
  };
};
```

### Requirement 4: Email Storage and Retrieval System

**User Story:** As a system administrator, I want email addresses to be securely stored with proper indexing and retrieval capabilities, so that user data is efficiently managed and protected.

#### Acceptance Criteria

1. WHEN email is verified, THE System SHALL store it in MongoDB with proper encryption
2. WHEN email is stored, THE System SHALL create database indexes for efficient querying
3. WHEN duplicate emails are detected, THE System SHALL handle them gracefully with appropriate error messages
4. WHEN email data is retrieved, THE System SHALL include verification status and timestamp
5. WHEN email updates are made, THE System SHALL maintain audit trail of changes

#### Technical Implementation

```javascript
// Enhanced User schema with email verification
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Please enter a valid email",
    ],
  },
  emailVerification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    },
    verificationMethod: {
      type: String,
      enum: ['linkedin', 'manual', 'api'],
      default: 'manual'
    },
    domainValidated: {
      type: Boolean,
      default: false
    },
    mxRecordsFound: {
      type: Number,
      default: 0
    }
  },
  // ... rest of schema
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'emailVerification.isVerified': 1 });
userSchema.index({ 'emailVerification.verifiedAt': 1 });
```

### Requirement 5: LinkedIn API Rate Limiting and Caching

**User Story:** As a system, I want to efficiently manage LinkedIn API calls with proper rate limiting and caching, so that the application remains performant and doesn't exceed API quotas.

#### Acceptance Criteria

1. WHEN LinkedIn API calls are made, THE System SHALL implement exponential backoff for rate limiting
2. WHEN data is fetched, THE System SHALL cache results in Redis with appropriate TTL
3. WHEN cache is stale, THE System SHALL refresh data in background while serving cached version
4. WHEN API quota is exceeded, THE System SHALL gracefully fallback to cached data
5. WHEN multiple requests are made for same data, THE System SHALL deduplicate API calls

#### Technical Implementation

```javascript
// Rate limiting and caching system
class LinkedInAPIManager {
  constructor() {
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: 100,
      interval: 'hour'
    });
    this.cache = new Redis(process.env.REDIS_URL);
  }
  
  async fetchWithCache(endpoint, params, ttl = 3600) {
    const cacheKey = `linkedin:${endpoint}:${JSON.stringify(params)}`;
    
    // Check cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      
      // If data is fresh, return it
      if (Date.now() - data.cachedAt < ttl * 1000) {
        return data.result;
      }
      
      // If stale, refresh in background
      this.refreshInBackground(endpoint, params, cacheKey, ttl);
      return data.result;
    }
    
    // Fetch fresh data
    return await this.fetchFreshData(endpoint, params, cacheKey, ttl);
  }
  
  async fetchFreshData(endpoint, params, cacheKey, ttl) {
    // Check rate limit
    const allowed = await this.rateLimiter.removeTokens(1);
    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }
    
    try {
      const response = await fetch(`https://api.linkedin.com/v2/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the result
      await this.cache.setex(cacheKey, ttl, JSON.stringify({
        result,
        cachedAt: Date.now(),
        source: 'linkedin-api'
      }));
      
      return result;
    } catch (error) {
      console.error('LinkedIn API Error:', error);
      
      // Try to return stale cached data
      const staleData = await this.cache.get(cacheKey);
      if (staleData) {
        return JSON.parse(staleData).result;
      }
      
      throw error;
    }
  }
}
```

### Requirement 6: Error Handling and Fallback Systems

**User Story:** As a user, I want the system to gracefully handle errors and provide meaningful feedback when LinkedIn data is unavailable, so that my onboarding experience is not interrupted.

#### Acceptance Criteria

1. WHEN LinkedIn API fails, THE System SHALL display user-friendly error messages
2. WHEN network errors occur, THE System SHALL provide retry mechanisms with exponential backoff
3. WHEN data is partially available, THE System SHALL show available data with appropriate indicators
4. WHEN all external services fail, THE System SHALL use high-quality fallback data
5. WHEN errors are resolved, THE System SHALL automatically refresh and update displayed data

#### Technical Implementation

```javascript
// Error handling and fallback system
class LinkedInDataService {
  async getSuperstarsWithFallback(selectedTopics) {
    try {
      // Try to fetch real LinkedIn data
      const realData = await this.fetchDynamicSuperstars(selectedTopics);
      return {
        data: realData,
        source: 'linkedin-api',
        freshness: 'real-time'
      };
    } catch (error) {
      console.warn('LinkedIn API unavailable, using cached data:', error.message);
      
      try {
        // Try cached data
        const cachedData = await this.getCachedSuperstars(selectedTopics);
        if (cachedData) {
          return {
            data: cachedData,
            source: 'cache',
            freshness: 'cached',
            cacheAge: this.getCacheAge(cachedData)
          };
        }
      } catch (cacheError) {
        console.warn('Cache unavailable:', cacheError.message);
      }
      
      // Final fallback to static data
      const staticData = this.getStaticSuperstars(selectedTopics);
      return {
        data: staticData,
        source: 'static',
        freshness: 'fallback',
        message: 'Using curated profiles while LinkedIn data is being updated'
      };
    }
  }
  
  getStaticSuperstars(selectedTopics) {
    // High-quality curated static data as fallback
    const curatedSuperstars = {
      technology: [
        {
          id: 'satya-nadella',
          name: 'Satya Nadella',
          title: 'Chairman and CEO at Microsoft',
          followers: '12.5M+',
          linkedinUrl: 'https://www.linkedin.com/in/satyanadella/',
          industry: 'Technology',
          verified: true,
          recentPost: 'The future of work is hybrid, and AI will be the great enabler of human potential.',
          engagement: '4.2%',
          location: 'Redmond, WA',
          source: 'curated'
        }
        // ... more curated profiles
      ]
    };
    
    return this.filterByTopics(curatedSuperstars, selectedTopics);
  }
}
```

### Requirement 7: Analytics and Monitoring

**User Story:** As a system administrator, I want to monitor email verification success rates and LinkedIn API performance, so that I can optimize the system and identify issues proactively.

#### Acceptance Criteria

1. WHEN email verification is attempted, THE System SHALL log success/failure rates
2. WHEN LinkedIn API calls are made, THE System SHALL track response times and error rates
3. WHEN users interact with LinkedIn profiles, THE System SHALL record click-through analytics
4. WHEN system performance degrades, THE System SHALL send alerts to administrators
5. WHEN data quality issues are detected, THE System SHALL flag them for review

#### Technical Implementation

```javascript
// Analytics and monitoring system
class SystemAnalytics {
  constructor() {
    this.metrics = new MetricsCollector();
    this.alerts = new AlertManager();
  }
  
  trackEmailVerification(email, result, method) {
    this.metrics.increment('email_verification_attempts');
    
    if (result.isValid) {
      this.metrics.increment('email_verification_success');
      this.metrics.histogram('email_verification_time', result.verificationTime);
    } else {
      this.metrics.increment('email_verification_failure');
      this.metrics.increment(`email_verification_failure_${result.reason}`);
    }
    
    // Log for analysis
    console.log('Email Verification:', {
      email: this.hashEmail(email),
      result: result.isValid,
      method,
      reason: result.reason,
      timestamp: new Date()
    });
  }
  
  trackLinkedInAPI(endpoint, responseTime, success, errorType = null) {
    this.metrics.histogram('linkedin_api_response_time', responseTime);
    this.metrics.increment('linkedin_api_calls');
    
    if (success) {
      this.metrics.increment('linkedin_api_success');
    } else {
      this.metrics.increment('linkedin_api_failure');
      this.metrics.increment(`linkedin_api_error_${errorType}`);
      
      // Alert if error rate is high
      if (this.getErrorRate('linkedin_api') > 0.1) {
        this.alerts.send('LinkedIn API error rate exceeded 10%');
      }
    }
  }
  
  trackProfileClick(profileId, profileType, userId) {
    this.metrics.increment('profile_clicks');
    this.metrics.increment(`profile_clicks_${profileType}`);
    
    // Store for analytics
    this.storeEvent('profile_click', {
      profileId,
      profileType,
      userId,
      timestamp: new Date()
    });
  }
}
```

## Success Criteria

### Functional Success
- 95% email verification success rate for valid emails
- 100% LinkedIn profile data accuracy when API is available
- <2 second response time for cached LinkedIn data
- 99% uptime for email verification service

### Performance Success
- LinkedIn API response time <500ms average
- Cache hit rate >80% for LinkedIn data
- Email verification completion <3 seconds
- Zero data loss during API failures

### User Experience Success
- Clear error messages for all failure scenarios
- Seamless fallback when external services are unavailable
- Real-time updates when data becomes available
- Intuitive retry mechanisms for failed operations

## Technical Constraints

### LinkedIn API Limitations
- Rate limit: 100 requests per hour per application
- Data freshness: Profile data updated every 24 hours
- Authentication: OAuth 2.0 required for all API calls
- Scope limitations: Basic profile data only without premium access

### Email Verification Constraints
- DNS lookup timeout: 5 seconds maximum
- Blacklist updates: Daily synchronization required
- Verification rate: Maximum 1000 verifications per hour
- Storage encryption: AES-256 encryption for email data

### Performance Requirements
- Cache TTL: 24 hours for LinkedIn data, 1 hour for email verification
- Database indexes: Required on email, linkedinId, and verification status
- Memory usage: <100MB for caching layer
- API timeout: 10 seconds maximum for external calls

---

## Implementation Priority

### Phase 1: Enhanced Email Verification (High Priority)
- Implement comprehensive email validation
- Add DNS MX record verification
- Create email verification audit trail
- Set up monitoring and analytics

### Phase 2: Real LinkedIn API Integration (High Priority)
- Implement LinkedIn API client with rate limiting
- Add caching layer with Redis
- Create fallback mechanisms
- Set up error handling and retry logic

### Phase 3: Dynamic Data Fetching (Medium Priority)
- Implement topic-based LinkedIn searches
- Add real-time follower count fetching
- Create engagement rate calculations
- Implement background data refresh

### Phase 4: Advanced Analytics (Low Priority)
- Add comprehensive monitoring dashboard
- Implement predictive analytics for data quality
- Create automated alerting system
- Add performance optimization recommendations

---

*This specification ensures robust email verification and authentic LinkedIn data integration while maintaining system performance and user experience quality.*