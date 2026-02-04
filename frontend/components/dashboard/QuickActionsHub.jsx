"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickActionsHub({ user }) {
  const [isRecording, setIsRecording] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');
  const router = useRouter();

  const quickActions = [
    {
      id: 'quick-post',
      title: 'Quick Post',
      description: 'Generate a post from a simple idea',
      icon: '⚡',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => router.push('/create-ai?mode=quick')
    },
    {
      id: 'trending-hashtags',
      title: 'Trending Hashtags',
      description: 'Get the hottest hashtags for your niche',
      icon: '#️⃣',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => showHashtagSuggestions()
    },
    {
      id: 'voice-to-text',
      title: 'Voice to Post',
      description: 'Speak your ideas, get a polished post',
      icon: '🎤',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => startVoiceRecording()
    },
    {
      id: 'image-combo',
      title: 'Image + Text',
      description: 'Create image with matching caption',
      icon: '🖼️',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => router.push('/create-ai?mode=image-combo')
    },
    {
      id: 'viral-recreator',
      title: 'Viral Recreator',
      description: 'Recreate viral posts in your style',
      icon: '🔥',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => router.push('/create-ai?mode=viral')
    },
    {
      id: 'content-calendar',
      title: 'Content Calendar',
      description: 'Plan your week of content',
      icon: '📅',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => router.push('/calendar')
    }
  ];

  const templates = [
    {
      id: 'thought-leadership',
      title: 'Thought Leadership',
      prompt: 'Share an industry insight that challenges conventional thinking',
      icon: '💡'
    },
    {
      id: 'personal-story',
      title: 'Personal Story',
      prompt: 'Tell a story about a lesson learned or challenge overcome',
      icon: '📖'
    },
    {
      id: 'tips-advice',
      title: 'Tips & Advice',
      prompt: 'Share 5 actionable tips for professionals in your field',
      icon: '💯'
    },
    {
      id: 'industry-news',
      title: 'Industry Commentary',
      prompt: 'Comment on recent news or trends in your industry',
      icon: '📰'
    }
  ];

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setQuickPrompt(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (quickPrompt.trim()) {
        router.push(`/create-ai?topic=${encodeURIComponent(quickPrompt)}&mode=voice`);
      }
    };

    recognition.start();
  };

  const showHashtagSuggestions = () => {
    // This would open a modal or navigate to hashtag suggestions
    alert('Hashtag suggestions feature coming soon!');
  };

  const handleQuickGenerate = () => {
    if (quickPrompt.trim()) {
      router.push(`/create-ai?topic=${encodeURIComponent(quickPrompt)}&mode=quick`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Quick Actions Hub</h2>
          <p className="text-gray-400">One-click content creation tools</p>
        </div>
      </div>

      {/* Quick Prompt Input */}
      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Quick Generate</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="What's on your mind? Type or speak your idea..."
            className="flex-1 bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && handleQuickGenerate()}
          />
          
          <button
            onClick={startVoiceRecording}
            disabled={isRecording}
            className={`p-2 rounded-lg transition-all ${
              isRecording 
                ? 'bg-red-600 animate-pulse' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <button
            onClick={handleQuickGenerate}
            disabled={!quickPrompt.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Generate
          </button>
        </div>
        
        {isRecording && (
          <div className="mt-3 flex items-center space-x-2 text-red-400">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Listening... Speak your content idea</span>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`p-4 rounded-lg text-left transition-all transform hover:scale-105 ${action.color}`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <h3 className="text-white font-semibold text-sm mb-1">{action.title}</h3>
            <p className="text-gray-200 text-xs">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Quick Templates */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Templates</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => router.push(`/create-ai?template=${template.id}&prompt=${encodeURIComponent(template.prompt)}`)}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{template.icon}</span>
                <div>
                  <h4 className="text-white font-medium text-sm">{template.title}</h4>
                  <p className="text-gray-400 text-xs">{template.prompt}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Today's Activity</h4>
            <p className="text-xs text-gray-300">You've created 3 posts and saved 2 hours</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-400">3/10</div>
            <div className="text-xs text-gray-400">Daily limit</div>
          </div>
        </div>
        <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
        </div>
      </div>
    </div>
  );
}