"use client";

import { useState, useRef, useEffect } from 'react';

export default function AIAssistantChat({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: `Hi ${user?.firstName || 'there'}! 👋 I'm your AI content strategist. I can help you with content ideas, writing tips, trend analysis, and performance optimization. What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickSuggestions = [
    "💡 Give me content ideas for this week",
    "📈 How can I improve my engagement?",
    "🎯 What's trending in my industry?",
    "✍️ Help me write a better hook",
    "📊 Analyze my recent performance",
    "🚀 Create a content strategy"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('content ideas') || message.includes('ideas')) {
      return `Here are some trending content ideas for you:

🔥 **Hot Topics This Week:**
• AI tools transforming your industry
• Remote work productivity hacks
• Personal branding mistakes to avoid
• Industry predictions for 2024

💡 **Content Formats to Try:**
• Behind-the-scenes stories
• "Day in the life" posts
• Quick tip carousels
• Industry myth-busting

Would you like me to help you develop any of these into full posts?`;
    }
    
    if (message.includes('engagement') || message.includes('improve')) {
      return `Great question! Here's how to boost your engagement:

📈 **Immediate Actions:**
• Post between 9-11 AM or 1-3 PM
• Use 3-5 relevant hashtags
• Ask questions to encourage comments
• Share personal stories or experiences

🎯 **Content Strategy:**
• Mix educational and personal content (70/30)
• Use carousel posts (they get 3x more engagement)
• Respond to comments within 2 hours
• Create content that sparks discussion

Your recent posts with images got 40% more engagement. Keep using visuals!`;
    }
    
    if (message.includes('trending') || message.includes('trend')) {
      return `🔥 **Trending in Your Industry:**

**Technology:**
• AI workplace integration (+45% mentions)
• Cybersecurity awareness (+32% mentions)
• Remote collaboration tools (+28% mentions)

**Business:**
• Sustainable business practices (+38% mentions)
• Employee wellbeing (+35% mentions)
• Digital transformation (+30% mentions)

**Hashtags to Use:**
#FutureOfWork #AI #Sustainability #DigitalTransformation

Want me to create a post about any of these trends?`;
    }
    
    if (message.includes('hook') || message.includes('write')) {
      return `✍️ **Hook Writing Tips:**

**Powerful Hook Formulas:**
• "The biggest mistake I see [industry] professionals make..."
• "Here's what nobody tells you about [topic]..."
• "I used to believe [common belief], until..."
• "3 years ago, I [situation]. Today, I [result]."

**Your Best Performing Hooks:**
• Questions (get 2x more comments)
• Controversial statements (spark discussion)
• Personal stories (build connection)

Try starting your next post with: "The one thing that changed my career trajectory was..."`;
    }
    
    if (message.includes('performance') || message.includes('analyze')) {
      return `📊 **Your Performance Analysis:**

**This Week's Highlights:**
• 📈 Engagement up 12% vs last week
• 👥 Reached 2,500 new people
• 💬 Comments increased by 25%
• 🔄 Shares up 18%

**Top Performing Content:**
1. Personal story about career change (250 likes)
2. Industry tips carousel (180 likes)
3. Behind-the-scenes post (160 likes)

**Recommendations:**
• Post more personal stories (they perform 40% better)
• Use more carousels (3x engagement)
• Optimal posting time: 10 AM on weekdays`;
    }
    
    if (message.includes('strategy') || message.includes('plan')) {
      return `🚀 **Your Content Strategy Blueprint:**

**Weekly Content Mix:**
• Monday: Motivational/Inspirational
• Tuesday: Industry insights/Tips
• Wednesday: Personal story/Experience
• Thursday: Educational carousel
• Friday: Week recap/Lessons learned

**Monthly Themes:**
• Week 1: Industry trends & news
• Week 2: Personal development
• Week 3: Behind-the-scenes
• Week 4: Community engagement

**Growth Goals:**
• Increase followers by 20% this month
• Boost engagement rate to 5%
• Build email list through content

Ready to implement this strategy?`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". Here are some ways I can help:

🎯 **Content Strategy:** I can help plan your content calendar and themes
📝 **Writing Assistance:** Get help with hooks, captions, and post structure  
📊 **Performance Analysis:** Understand what content works best for you
🔥 **Trend Insights:** Stay ahead with trending topics in your industry
💡 **Creative Ideas:** Generate fresh content ideas based on your niche

What specific area would you like to focus on?`;
  };

  const handleQuickSuggestion = (suggestion) => {
    const cleanSuggestion = suggestion.replace(/^[^\w\s]+\s*/, ''); // Remove emoji and spaces
    handleSendMessage(cleanSuggestion);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Assistant</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-200' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 text-xs rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center space-x-3">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything about content strategy..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          disabled={isTyping}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isTyping}
          className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}