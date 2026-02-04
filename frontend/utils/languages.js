// Language configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  hi: {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳',
    direction: 'ltr'
  },
  ur: {
    code: 'ur',
    name: 'اردو',
    flag: '🇵🇰',
    direction: 'rtl'
  }
};

// Translation strings
export const TRANSLATIONS = {
  en: {
    // Dashboard
    'dashboard.title': 'Smart Dashboard',
    'dashboard.subtitle': 'AI-powered insights for your content strategy',
    'dashboard.refresh': 'Refresh',
    'dashboard.performance': 'Performance Overview',
    'dashboard.trending': 'Trending Topics',
    'dashboard.quickActions': 'Quick Actions Hub',
    'dashboard.aiAssistant': 'AI Assistant',
    
    // AI Assistant
    'ai.greeting': 'Hi there! 👋 I\'m your AI content strategist.',
    'ai.placeholder': 'Ask me anything about content strategy...',
    'ai.suggestions.ideas': '💡 Give me content ideas for this week',
    'ai.suggestions.engagement': '📈 How can I improve my engagement?',
    'ai.suggestions.trending': '🎯 What\'s trending in my industry?',
    'ai.suggestions.hook': '✍️ Help me write a better hook',
    'ai.suggestions.performance': '📊 Analyze my recent performance',
    'ai.suggestions.strategy': '🚀 Create a content strategy',
    
    // Quick Actions
    'quick.generate': 'Quick Generate',
    'quick.placeholder': 'What\'s on your mind? Type or speak your idea...',
    'quick.listening': 'Listening... Speak your content idea',
    'quick.voiceToPost': 'Voice to Post',
    'quick.templates': 'Quick Templates',
    
    // Content Creation
    'create.title': 'Create with AI',
    'create.topic': 'Add a topic',
    'create.url': 'Add a URL',
    'create.file': 'Upload a File',
    'create.generate': 'Generate',
    'create.creating': 'Creating...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete'
  },
  
  hi: {
    // Dashboard
    'dashboard.title': 'स्मार्ट डैशबोर्ड',
    'dashboard.subtitle': 'आपकी कंटेंट रणनीति के लिए AI-संचालित अंतर्दृष्टि',
    'dashboard.refresh': 'रिफ्रेश करें',
    'dashboard.performance': 'प्रदर्शन अवलोकन',
    'dashboard.trending': 'ट्रेंडिंग विषय',
    'dashboard.quickActions': 'त्वरित कार्य केंद्र',
    'dashboard.aiAssistant': 'AI सहायक',
    
    // AI Assistant
    'ai.greeting': 'नमस्ते! 👋 मैं आपका AI कंटेंट रणनीतिकार हूं।',
    'ai.placeholder': 'कंटेंट रणनीति के बारे में कुछ भी पूछें...',
    'ai.suggestions.ideas': '💡 इस सप्ताह के लिए कंटेंट आइडिया दें',
    'ai.suggestions.engagement': '📈 मैं अपनी एंगेजमेंट कैसे बढ़ा सकता हूं?',
    'ai.suggestions.trending': '🎯 मेरे इंडस्ट्री में क्या ट्रेंड कर रहा है?',
    'ai.suggestions.hook': '✍️ बेहतर हुक लिखने में मदद करें',
    'ai.suggestions.performance': '📊 मेरे हाल के प्रदर्शन का विश्लेषण करें',
    'ai.suggestions.strategy': '🚀 कंटेंट रणनीति बनाएं',
    
    // Quick Actions
    'quick.generate': 'त्वरित जेनरेट',
    'quick.placeholder': 'आपके मन में क्या है? अपना विचार टाइप करें या बोलें...',
    'quick.listening': 'सुन रहा हूं... अपना कंटेंट आइडिया बोलें',
    'quick.voiceToPost': 'आवाज से पोस्ट',
    'quick.templates': 'त्वरित टेम्प्लेट',
    
    // Content Creation
    'create.title': 'AI के साथ बनाएं',
    'create.topic': 'विषय जोड़ें',
    'create.url': 'URL जोड़ें',
    'create.file': 'फाइल अपलोड करें',
    'create.generate': 'जेनरेट करें',
    'create.creating': 'बना रहे हैं...',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'common.success': 'सफल!',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं'
  }
};

// Translation function
export const t = (key, language = 'en') => {
  return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
};

// Language detection
export const detectLanguage = (text) => {
  // Simple Hindi detection based on Devanagari script
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) {
    return 'hi';
  }
  return 'en';
};

// Format text for different languages
export const formatText = (text, language) => {
  if (language === 'hi') {
    // Add proper Hindi formatting
    return text.replace(/\s+/g, ' ').trim();
  }
  return text;
};