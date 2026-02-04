# Email Verification & LinkedIn Data Integration - Design Document

## Architecture Overview

This design document outlines the technical implementation for enhanced email verification and real LinkedIn data integration in the SocialRva onboarding system.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External APIs │
│   Components    │    │   Services      │    │   & Services    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ EmailVerification│◄──►│ EmailValidator  │◄──►│ DNS Resolver    │
│ LinkedInSuperstars│   │ LinkedInService │    │ LinkedIn API    │
│ IndustryLeaders │    │ CacheManager    │    │ Redis Cache     │
│ ErrorHandling   │    │ Analytics       │    │ MongoDB         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Design

### 1. Enhanced Email Verification System

#### EmailValidator Service
```javascript
class EmailValidator {
  constructor() {
    this.dnsResolver = require('dns').promises;
    this.invalidDomains = new Set([
      'test.com', 'example.com', 'fake.com', 'invalid.com',
      'tempmail.com', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ]);
  }

  async validateEmail(email) {
    const validation = {
      email,
      isValid: false,
      errors: [],
      checks: {
        format: false,
        domain: false,
        mxRecords: false,
        blacklist: false
      },
      metadata: {
        domain: null,
        mxCount: 0,
        validatedAt: new Date()
      }
    };

    try {
      // 1. Format validation
      validation.checks.format = this.validateFormat(email);
      if (!validation.checks.format) {
        validation.errors.push('Invalid email format');
        return validation;
      }

      // 2. Extract domain
      validation.metadata.domain = email.split('@')[1].toLowerCase();

      // 3. Domain blacklist check
      validation.checks.blacklist = !this.invalidDomains.has(validation.metadata.domain);
      if (!validation.checks.blacklist) {
        validation.errors.push('Email domain is not allowed');
        return validation;
      }

      // 4. DNS MX record verification
      try {
        const mxRecords = await this.dnsResolver.resolveMx(validation.metadata.domain);
        validation.metadata.mxCount = mxRecords.length;
        validation.checks.mxRecords = mxRecords.length > 0;
        
        if (!validation.checks.mxRecords) {
          validation.errors.push('Email domain has no mail servers configured');
          return validation;
        }
      } catch (dnsError) {
        validation.errors.push('Unable to verify email domain');
        return validation;
      }

      // 5. Additional domain validation
      validation.checks.domain = await this.validateDomain(validation.metadata.domain);
      if (!validation.checks.domain) {
        validation.errors.push('Email domain appears to be invalid or unreachable');
        return validation;
      }

      // All checks passed
      validation.isValid = true;
      return validation;

    } catch (error) {
      validation.errors.push(`Validation error: ${error.message}`);
      return validation;
    }
  }

  validateFormat(email) {
    // Comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  async validateDomain(domain) {
    try {
      // Check if domain resolves to any IP
      const addresses = await this.dnsResolver.resolve4(domain);
      return addresses.length > 0;
    } catch (error) {
      try {
        // Try IPv6 if IPv4 fails
        const addresses = await this.dnsResolver.resolve6(domain);
        return addresses.length > 0;
      } catch (ipv6Error) {
        return false;
      }
    }
  }
}
```

#### Frontend Email Verification Component
```javascript
// Enhanced EmailVerificationStep.jsx
export default function EmailVerificationStep({ userData, updateUserData, nextStep }) {
  const [email, setEmail] = useState(userData.email || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerifyEmail = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsVerifying(true);
    setError('');
    setValidationResult(null);

    try {
      const response = await fetch('/api/onboarding/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setValidationResult(data.validation);
        
        if (data.validation.isValid) {
          setIsVerified(true);
          updateUserData({ 
            email, 
            emailVerified: true,
            emailValidation: data.validation
          });
          
          // Auto proceed after verification
          setTimeout(() => {
            nextStep();
          }, 1500);
        } else {
          setError(data.validation.errors.join(', '));
        }
      } else {
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Enhanced UI with validation feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="mail" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Email Verification
        </h2>
        <p className="text-gray-300 text-lg">
          Aapka email verify karte hain with comprehensive validation checks
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
      >
        {!isVerified ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isVerifying}
              />
            </div>

            {/* Validation Progress Indicators */}
            {validationResult && (
              <div className="space-y-2">
                <div className="text-sm text-gray-300 mb-2">Validation Checks:</div>
                <div className="grid grid-cols-2 gap-2">
                  <ValidationCheck 
                    label="Format" 
                    passed={validationResult.checks.format} 
                  />
                  <ValidationCheck 
                    label="Domain" 
                    passed={validationResult.checks.domain} 
                  />
                  <ValidationCheck 
                    label="Mail Servers" 
                    passed={validationResult.checks.mxRecords} 
                  />
                  <ValidationCheck 
                    label="Allowed Domain" 
                    passed={validationResult.checks.blacklist} 
                  />
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <Icon name="alert-circle" size={16} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.button
              onClick={handleVerifyEmail}
              disabled={isVerifying || !email}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isVerifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Verifying Email...</span>
                </>
              ) : (
                <>
                  <Icon name="mail-check" size={20} />
                  <span>Verify Email</span>
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <Icon name="check" size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Email Verified!</h3>
            <p className="text-gray-300">
              Great! Aapka email successfully verify ho gaya hai with all security checks
            </p>
            {validationResult && (
              <div className="text-sm text-gray-400">
                Domain: {validationResult.metadata.domain} • 
                MX Records: {validationResult.metadata.mxCount}
              </div>
            )}
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Icon name="arrow-right" size={16} />
              <span className="text-sm">Proceeding to next step...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Validation Check Component
const ValidationCheck = ({ label, passed }) => (
  <div className={`flex items-center space-x-2 p-2 rounded-lg ${
    passed ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
  }`}>
    <Icon name={passed ? "check" : "x"} size={14} />
    <span className="text-xs">{label}</span>
  </div>
);
```

### 2. Real LinkedIn Data Integration

#### LinkedIn API Service
```javascript
class LinkedInAPIService {
  constructor() {
    this.baseURL = 'https://api.linkedin.com/v2';
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: 100,
      interval: 'hour'
    });
    this.cache = new Redis(process.env.REDIS_URL);
  }

  async searchPeople(keywords, facets = [], count = 10) {
    const cacheKey = `linkedin:search:${keywords}:${JSON.stringify(facets)}`;
    
    // Check cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.cachedAt < 3600000) { // 1 hour cache
        return data.result;
      }
    }

    // Check rate limit
    const allowed = await this.rateLimiter.removeTokens(1);
    if (!allowed) {
      throw new Error('LinkedIn API rate limit exceeded');
    }

    try {
      const response = await fetch(`${this.baseURL}/people-search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          keywords,
          facets,
          count,
          start: 0
        })
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Cache the result
      await this.cache.setex(cacheKey, 3600, JSON.stringify({
        result,
        cachedAt: Date.now(),
        source: 'linkedin-api'
      }));

      return result;
    } catch (error) {
      console.error('LinkedIn API Error:', error);
      
      // Return stale cached data if available
      if (cached) {
        console.warn('Using stale LinkedIn data due to API error');
        return JSON.parse(cached).result;
      }
      
      throw error;
    }
  }

  async getProfile(profileId) {
    const cacheKey = `linkedin:profile:${profileId}`;
    
    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.cachedAt < 86400000) { // 24 hour cache
        return data.result;
      }
    }

    // Check rate limit
    const allowed = await this.rateLimiter.removeTokens(1);
    if (!allowed) {
      throw new Error('LinkedIn API rate limit exceeded');
    }

    try {
      const response = await fetch(`${this.baseURL}/people/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const result = await response.json();

      // Cache for 24 hours
      await this.cache.setex(cacheKey, 86400, JSON.stringify({
        result,
        cachedAt: Date.now(),
        source: 'linkedin-api'
      }));

      return result;
    } catch (error) {
      console.error('LinkedIn Profile Error:', error);
      
      // Return stale cached data if available
      if (cached) {
        return JSON.parse(cached).result;
      }
      
      throw error;
    }
  }

  async getFollowerCount(profileId) {
    // This would require LinkedIn's premium API access
    // For now, we'll estimate based on profile data
    try {
      const profile = await this.getProfile(profileId);
      return this.estimateFollowerCount(profile);
    } catch (error) {
      console.error('Error getting follower count:', error);
      return 'N/A';
    }
  }

  estimateFollowerCount(profile) {
    // Estimation logic based on profile completeness, connections, etc.
    let estimate = 1000; // Base estimate
    
    if (profile.headline && profile.headline.includes('CEO')) estimate *= 5;
    if (profile.headline && profile.headline.includes('Founder')) estimate *= 3;
    if (profile.industry === 'Technology') estimate *= 2;
    if (profile.premiumSubscriber) estimate *= 1.5;
    
    return this.formatFollowerCount(Math.floor(estimate));
  }

  formatFollowerCount(count) {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }
}
```

#### Dynamic Superstars Fetching
```javascript
// Enhanced backend route for dynamic LinkedIn data
router.post('/linkedin-superstars', protect, async (req, res) => {
  try {
    const { selectedTopics } = req.body;
    const linkedInService = new LinkedInAPIService();
    const analytics = new SystemAnalytics();
    
    const startTime = Date.now();
    let superstars = [];
    let dataSource = 'unknown';

    try {
      // Try to fetch real LinkedIn data
      superstars = await fetchDynamicSuperstars(selectedTopics, linkedInService);
      dataSource = 'linkedin-api';
      
      analytics.trackLinkedInAPI('superstars', Date.now() - startTime, true);
    } catch (apiError) {
      console.warn('LinkedIn API unavailable, using fallback:', apiError.message);
      
      try {
        // Try cached data
        superstars = await getCachedSuperstars(selectedTopics);
        dataSource = 'cache';
      } catch (cacheError) {
        // Final fallback to curated static data
        superstars = getStaticSuperstars(selectedTopics);
        dataSource = 'static';
      }
      
      analytics.trackLinkedInAPI('superstars', Date.now() - startTime, false, apiError.name);
    }

    // Enrich data with additional metadata
    const enrichedSuperstars = superstars.map(superstar => ({
      ...superstar,
      dataSource,
      lastUpdated: new Date(),
      profilePicture: superstar.profilePicture || null, // Use initials fallback
      verified: superstar.verified || false,
      engagement: superstar.engagement || 'N/A'
    }));

    res.json({
      success: true,
      data: {
        superstars: enrichedSuperstars,
        totalCount: enrichedSuperstars.length,
        basedOnTopics: selectedTopics || ['technology'],
        dataSource,
        metadata: {
          fetchTime: Date.now() - startTime,
          cacheStatus: dataSource === 'cache' ? 'hit' : 'miss',
          apiStatus: dataSource === 'linkedin-api' ? 'available' : 'unavailable'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching LinkedIn superstars:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch LinkedIn superstars',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

async function fetchDynamicSuperstars(selectedTopics, linkedInService) {
  const allSuperstars = [];
  
  for (const topic of selectedTopics) {
    try {
      // Search for influencers in this topic
      const searchResults = await linkedInService.searchPeople(
        topic,
        ['industry', 'current-company'],
        5
      );
      
      // Process each profile
      for (const profile of searchResults.elements || []) {
        const enrichedProfile = await enrichProfileData(profile, linkedInService);
        allSuperstars.push(enrichedProfile);
      }
    } catch (topicError) {
      console.warn(`Error fetching superstars for topic ${topic}:`, topicError.message);
      // Continue with other topics
    }
  }
  
  // Remove duplicates and limit results
  const uniqueSuperstars = allSuperstars
    .filter((superstar, index, self) => 
      index === self.findIndex(s => s.id === superstar.id)
    )
    .slice(0, 6);
    
  return uniqueSuperstars;
}

async function enrichProfileData(profile, linkedInService) {
  try {
    const [followerCount, additionalData] = await Promise.all([
      linkedInService.getFollowerCount(profile.id),
      linkedInService.getProfile(profile.id)
    ]);
    
    return {
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName}`,
      title: profile.headline || 'Professional',
      followers: followerCount,
      profilePicture: profile.profilePicture?.displayImage || null,
      linkedinUrl: profile.publicProfileUrl || `https://www.linkedin.com/in/${profile.id}`,
      industry: profile.industry || 'Technology',
      verified: profile.premiumSubscriber || false,
      recentPost: 'Inspiring professionals to achieve their goals and make meaningful impact.',
      engagement: linkedInService.estimateEngagementRate(additionalData),
      location: profile.location?.name || 'Global',
      dataSource: 'linkedin-api',
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error enriching profile data:', error);
    
    // Return basic profile data
    return {
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName}`,
      title: profile.headline || 'Professional',
      followers: 'N/A',
      profilePicture: null,
      linkedinUrl: profile.publicProfileUrl || `https://www.linkedin.com/in/${profile.id}`,
      industry: 'Technology',
      verified: false,
      recentPost: 'Professional insights and industry expertise.',
      engagement: 'N/A',
      location: 'Global',
      dataSource: 'linkedin-api-partial',
      lastUpdated: new Date()
    };
  }
}
```

### 3. Enhanced Error Handling and User Experience

#### Frontend Error Handling
```javascript
// Enhanced error handling in LinkedInSuperstarsStep.jsx
export default function LinkedInSuperstarsStep({ userData, updateUserData, nextStep }) {
  const [superstars, setSuperstars] = useState([]);
  const [selectedSuperstars, setSelectedSuperstars] = useState(userData.selectedSuperstars || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState('unknown');
  const [retryCount, setRetryCount] = useState(0);

  const fetchSuperstars = async (isRetry = false) => {
    setIsLoading(true);
    setError('');
    
    if (isRetry) {
      setRetryCount(prev => prev + 1);
    }
    
    try {
      const response = await fetch('/api/onboarding/linkedin-superstars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          selectedTopics: userData.selectedTopics || [] 
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuperstars(data.data.superstars);
        setDataSource(data.data.dataSource);
        
        // Show data source indicator
        if (data.data.dataSource === 'cache') {
          console.log('Using cached LinkedIn data');
        } else if (data.data.dataSource === 'static') {
          console.log('Using curated fallback data');
        }
      } else {
        throw new Error(data.error || 'Failed to load LinkedIn superstars');
      }
    } catch (error) {
      console.error('Network Error fetching superstars:', error);
      setError(getErrorMessage(error, retryCount));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error, retryCount) => {
    if (retryCount >= 3) {
      return 'Unable to load LinkedIn data after multiple attempts. Please check your connection and try again later.';
    }
    
    if (error.message.includes('rate limit')) {
      return 'LinkedIn API rate limit reached. Please wait a moment and try again.';
    }
    
    if (error.message.includes('network')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    
    return 'Failed to load LinkedIn data. This might be a temporary issue.';
  };

  const handleRetry = () => {
    fetchSuperstars(true);
  };

  useEffect(() => {
    fetchSuperstars();
  }, [userData.selectedTopics]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Data Source Indicator */}
      {dataSource && dataSource !== 'linkedin-api' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            dataSource === 'cache' 
              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          }`}>
            <Icon name={dataSource === 'cache' ? 'clock' : 'shield'} size={12} />
            <span>
              {dataSource === 'cache' 
                ? 'Using cached LinkedIn data' 
                : 'Using curated professional profiles'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Rest of component with enhanced error handling */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState 
          error={error} 
          onRetry={handleRetry} 
          retryCount={retryCount}
          maxRetries={3}
        />
      ) : (
        <SuperstarsGrid 
          superstars={superstars}
          selectedSuperstars={selectedSuperstars}
          onToggleSelection={toggleSuperstar}
          onProfileClick={openLinkedInProfile}
        />
      )}
    </div>
  );
}

// Enhanced Error State Component
const ErrorState = ({ error, onRetry, retryCount, maxRetries }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon name="alert-circle" size={32} className="text-red-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">
      Unable to Load LinkedIn Data
    </h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">
      {error}
    </p>
    
    {retryCount < maxRetries && (
      <motion.button
        onClick={onRetry}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon name="refresh-cw" size={16} />
        <span>Retry ({retryCount + 1}/{maxRetries})</span>
      </motion.button>
    )}
    
    {retryCount >= maxRetries && (
      <div className="text-sm text-gray-500 mt-4">
        <p>If the problem persists, please contact support.</p>
        <p className="mt-2">
          <a href="mailto:support@socialrva.com" className="text-blue-400 hover:text-blue-300">
            support@socialrva.com
          </a>
        </p>
      </div>
    )}
  </motion.div>
);
```

### 4. Database Schema Updates

#### Enhanced User Model
```javascript
// Updated User schema with email verification fields
const userSchema = new mongoose.Schema({
  // ... existing fields ...
  
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
      enum: ['linkedin', 'manual', 'api', 'dns'],
      default: 'manual'
    },
    validationChecks: {
      format: { type: Boolean, default: false },
      domain: { type: Boolean, default: false },
      mxRecords: { type: Boolean, default: false },
      blacklist: { type: Boolean, default: false }
    },
    domainInfo: {
      domain: String,
      mxCount: { type: Number, default: 0 },
      validatedAt: Date
    },
    errors: [String]
  },
  
  linkedinData: {
    profileId: String,
    lastSynced: Date,
    followerCount: String,
    engagementRate: String,
    profileCompleteness: Number,
    premiumSubscriber: Boolean,
    dataSource: {
      type: String,
      enum: ['linkedin-api', 'cache', 'static'],
      default: 'static'
    }
  },
  
  onboardingData: {
    selectedSuperstars: [{
      id: String,
      name: String,
      linkedinUrl: String,
      selectedAt: { type: Date, default: Date.now },
      dataSource: String
    }],
    selectedLeaders: [{
      id: String,
      name: String,
      company: String,
      linkedinUrl: String,
      selectedAt: { type: Date, default: Date.now },
      dataSource: String
    }],
    dataQuality: {
      superstarDataSource: String,
      leaderDataSource: String,
      lastUpdated: Date,
      apiCallsUsed: { type: Number, default: 0 }
    }
  },
  
  // ... rest of schema
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'emailVerification.isVerified': 1 });
userSchema.index({ 'emailVerification.verifiedAt': 1 });
userSchema.index({ 'linkedinData.profileId': 1 });
userSchema.index({ 'linkedinData.lastSynced': 1 });
```

### 5. Analytics and Monitoring

#### System Analytics Service
```javascript
class SystemAnalytics {
  constructor() {
    this.metrics = new MetricsCollector();
    this.alerts = new AlertManager();
    this.logger = new Logger('SystemAnalytics');
  }
  
  trackEmailVerification(email, result, method, duration) {
    // Increment counters
    this.metrics.increment('email_verification_attempts');
    
    if (result.isValid) {
      this.metrics.increment('email_verification_success');
      this.metrics.histogram('email_verification_duration', duration);
      
      // Track validation method success
      this.metrics.increment(`email_verification_success_${method}`);
      
      // Track domain types
      const domain = email.split('@')[1];
      this.metrics.increment(`email_domain_${this.categorizeDomain(domain)}`);
    } else {
      this.metrics.increment('email_verification_failure');
      
      // Track failure reasons
      result.errors.forEach(error => {
        this.metrics.increment(`email_verification_error_${this.categorizeError(error)}`);
      });
    }
    
    // Log for detailed analysis
    this.logger.info('Email Verification', {
      emailHash: this.hashEmail(email),
      domain: email.split('@')[1],
      isValid: result.isValid,
      method,
      duration,
      checks: result.checks,
      errors: result.errors,
      timestamp: new Date()
    });
  }
  
  trackLinkedInAPI(endpoint, duration, success, errorType = null, dataSource = null) {
    // Track API performance
    this.metrics.histogram('linkedin_api_duration', duration);
    this.metrics.increment('linkedin_api_calls');
    this.metrics.increment(`linkedin_api_calls_${endpoint}`);
    
    if (success) {
      this.metrics.increment('linkedin_api_success');
      this.metrics.increment(`linkedin_api_success_${endpoint}`);
      
      if (dataSource) {
        this.metrics.increment(`linkedin_data_source_${dataSource}`);
      }
    } else {
      this.metrics.increment('linkedin_api_failure');
      this.metrics.increment(`linkedin_api_failure_${endpoint}`);
      
      if (errorType) {
        this.metrics.increment(`linkedin_api_error_${errorType}`);
      }
      
      // Alert on high error rates
      const errorRate = this.getErrorRate('linkedin_api', 300); // 5 minute window
      if (errorRate > 0.1) {
        this.alerts.send('LinkedIn API error rate exceeded 10%', {
          errorRate,
          endpoint,
          errorType,
          timestamp: new Date()
        });
      }
    }
    
    // Log API calls
    this.logger.info('LinkedIn API Call', {
      endpoint,
      duration,
      success,
      errorType,
      dataSource,
      timestamp: new Date()
    });
  }
  
  trackUserInteraction(action, userId, metadata = {}) {
    this.metrics.increment(`user_interaction_${action}`);
    
    // Track specific interactions
    if (action === 'profile_click') {
      this.metrics.increment('profile_clicks');
      this.metrics.increment(`profile_clicks_${metadata.profileType}`);
      
      // Store for conversion analysis
      this.storeEvent('profile_click', {
        userId,
        profileId: metadata.profileId,
        profileType: metadata.profileType,
        dataSource: metadata.dataSource,
        timestamp: new Date()
      });
    }
    
    if (action === 'onboarding_step_complete') {
      this.metrics.increment('onboarding_steps_completed');
      this.metrics.histogram('onboarding_step_duration', metadata.duration);
      
      // Track step-specific metrics
      this.metrics.increment(`onboarding_step_${metadata.step}_completed`);
    }
  }
  
  generateDailyReport() {
    const report = {
      date: new Date().toISOString().split('T')[0],
      emailVerification: {
        attempts: this.metrics.get('email_verification_attempts'),
        successRate: this.getSuccessRate('email_verification'),
        averageDuration: this.metrics.getAverage('email_verification_duration'),
        topFailureReasons: this.getTopFailureReasons('email_verification')
      },
      linkedinAPI: {
        calls: this.metrics.get('linkedin_api_calls'),
        successRate: this.getSuccessRate('linkedin_api'),
        averageDuration: this.metrics.getAverage('linkedin_api_duration'),
        dataSourceDistribution: this.getDataSourceDistribution(),
        errorDistribution: this.getErrorDistribution('linkedin_api')
      },
      userEngagement: {
        profileClicks: this.metrics.get('profile_clicks'),
        onboardingCompletions: this.metrics.get('onboarding_steps_completed'),
        averageOnboardingTime: this.metrics.getAverage('onboarding_step_duration')
      }
    };
    
    // Store report
    this.storeReport(report);
    
    // Send alerts if needed
    this.checkAlertConditions(report);
    
    return report;
  }
  
  // Helper methods
  hashEmail(email) {
    return crypto.createHash('sha256').update(email).digest('hex').substring(0, 8);
  }
  
  categorizeDomain(domain) {
    const businessDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];
    const corporateDomains = ['microsoft.com', 'google.com', 'apple.com'];
    
    if (businessDomains.includes(domain)) return 'personal';
    if (corporateDomains.includes(domain)) return 'corporate';
    return 'other';
  }
  
  categorizeError(error) {
    if (error.includes('format')) return 'format';
    if (error.includes('domain')) return 'domain';
    if (error.includes('mx')) return 'mx_records';
    if (error.includes('blacklist')) return 'blacklist';
    return 'other';
  }
}
```

## Performance Considerations

### Caching Strategy
- **Email Validation**: Cache DNS lookups for 1 hour
- **LinkedIn Data**: Cache profile data for 24 hours
- **Search Results**: Cache search results for 1 hour
- **Static Data**: Cache curated fallback data indefinitely

### Rate Limiting
- **LinkedIn API**: 100 requests per hour per application
- **Email Verification**: 1000 verifications per hour
- **DNS Lookups**: 500 lookups per minute

### Database Optimization
- Index on email field for fast lookups
- Index on emailVerification.isVerified for filtering
- Index on linkedinData.lastSynced for cache invalidation
- Compound index on (email, emailVerification.isVerified)

### Error Recovery
- Exponential backoff for API failures
- Circuit breaker pattern for external services
- Graceful degradation to cached/static data
- User-friendly error messages with retry options

## Security Considerations

### Email Validation Security
- Prevent email enumeration attacks
- Rate limit validation attempts per IP
- Sanitize all email inputs
- Log suspicious validation patterns

### LinkedIn API Security
- Secure storage of API credentials
- Token rotation and refresh
- Request signing for sensitive operations
- Audit trail for all API calls

### Data Privacy
- Hash email addresses in logs
- Encrypt sensitive profile data
- Comply with GDPR requirements
- Provide data deletion capabilities

---

This design provides a robust foundation for enhanced email verification and real LinkedIn data integration while maintaining performance, security, and user experience standards.