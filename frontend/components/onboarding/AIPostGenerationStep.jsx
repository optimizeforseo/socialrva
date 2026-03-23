"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../ui/Icon';

const POST_TOPICS = [
  { id: 'career-growth', name: 'Career Growth', icon: 'trending-up', description: 'Professional development tips' },
  { id: 'industry-insights', name: 'Industry Insights', icon: 'lightbulb', description: 'Market trends and analysis' },
  { id: 'leadership', name: 'Leadership', icon: 'users', description: 'Management and team building' },
  { id: 'innovation', name: 'Innovation', icon: 'rocket', description: 'Technology and new ideas' },
  { id: 'personal-story', name: 'Personal Story', icon: 'heart', description: 'Your journey and experiences' },
  { id: 'tips-advice', name: 'Tips & Advice', icon: 'star', description: 'Practical guidance for others' }
];

const SAMPLE_POSTS = {
  'career-growth': `🚀 Career Growth Mindset

After 5 years in the industry, I've learned that the biggest career accelerator isn't just technical skills—it's the ability to communicate your value clearly.

Here are 3 game-changing realizations:

✅ Document your wins (even small ones)
✅ Seek feedback actively, not just during reviews  
✅ Build relationships across departments

Your career is a marathon, not a sprint. Invest in yourself consistently.

What's one career lesson you wish you'd learned earlier?

#CareerGrowth #ProfessionalDevelopment #Leadership`,

  'industry-insights': `📊 The Future of Work is Here

Remote work isn't just a trend—it's a fundamental shift in how we think about productivity and collaboration.

Key insights from recent industry data:
• 73% of teams report higher productivity when remote
• Companies save $11K per remote employee annually
• Work-life balance scores increased by 40%

But here's what the data doesn't show: the human element still matters most.

The winners will be organizations that blend digital efficiency with authentic human connection.

How is your industry adapting to this new reality?

#FutureOfWork #RemoteWork #DigitalTransformation`,

  'leadership': `👥 Leadership Lesson: The Power of Listening

Early in my career, I thought leadership meant having all the answers.

I was wrong.

The best leaders I've worked with share one trait: they listen more than they speak.

Here's what active listening as a leader looks like:
• Ask follow-up questions
• Summarize what you heard
• Create space for different perspectives
• Act on the feedback you receive

Your team has incredible insights. Your job is to unlock them.

What's the best leadership advice you've ever received?

#Leadership #Management #TeamBuilding`,

  'innovation': `💡 Innovation Starts with Curiosity

The most innovative solutions often come from asking "What if we tried this differently?"

I recently saw a team solve a complex problem by:
1. Questioning every assumption
2. Looking at adjacent industries for inspiration
3. Prototyping quickly and cheaply
4. Embracing "intelligent failures"

Innovation isn't about having breakthrough moments—it's about creating systems that encourage experimentation.

What's one assumption in your industry that deserves to be challenged?

#Innovation #Technology #ProblemSolving`,

  'personal-story': `🌟 From Imposter Syndrome to Confidence

Three years ago, I almost turned down a promotion because I didn't feel "ready."

My mentor asked me: "Do you think men wait until they're 100% qualified?"

That question changed everything.

I took the role. I struggled. I learned. I grew.

Today, I realize that feeling "ready" is often just fear in disguise.

Your next level of growth is waiting on the other side of your comfort zone.

To anyone doubting themselves: you're more capable than you think.

#PersonalGrowth #ImposterSyndrome #Confidence`,

  'tips-advice': `💼 5 LinkedIn Tips That Actually Work

After helping 100+ professionals optimize their LinkedIn presence, here are the strategies that move the needle:

1️⃣ Write for your audience, not about yourself
2️⃣ Share insights, not just achievements  
3️⃣ Engage meaningfully on others' posts
4️⃣ Use storytelling to make your points memorable
5️⃣ Be consistent—quality over quantity

The goal isn't to go viral. It's to build genuine professional relationships.

Your network is your net worth, but only if you add value first.

Which tip will you implement this week?

#LinkedInTips #Networking #PersonalBranding`
};

export default function AIPostGenerationStep({ userData, updateUserData, nextStep }) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generatePost = async () => {
    if (!selectedTopic && !customTopic) return;
    
    setIsGenerating(true);
    setShowPreview(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Use sample post or generate based on custom topic
    let post = '';
    if (selectedTopic && SAMPLE_POSTS[selectedTopic]) {
      post = SAMPLE_POSTS[selectedTopic];
    } else {
      // For custom topics, use a template
      post = `🚀 Thoughts on ${customTopic}

Based on my experience in the industry, I've been reflecting on ${customTopic} and its impact on our professional landscape.

Here are some key insights I'd like to share:

✅ The importance of staying curious and open to new perspectives
✅ How collaboration drives better outcomes than working in isolation
✅ Why continuous learning is essential in today's fast-paced world

I believe that by sharing our experiences and insights, we can all grow together as a professional community.

What are your thoughts on ${customTopic}? I'd love to hear your perspective!

#ProfessionalGrowth #Industry #Networking`;
    }
    
    setGeneratedPost(post);
    setIsGenerating(false);
  };

  const handleContinue = () => {
    updateUserData({ 
      selectedPostTopic: selectedTopic || customTopic,
      generatedPost 
    });
    nextStep();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="edit" size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Your First Post by AI
        </h2>
        <p className="text-gray-300 text-lg">
          Create your first professional post with AI — with beautiful design
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Topic Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Icon name="message-square" size={20} />
              <span>What would you like the post to be about?</span>
            </h3>
            
            <p className="text-gray-400 mb-6">Based on Your Interests:</p>
            
            {/* Topic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {POST_TOPICS.map((topic) => (
                <motion.button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic.id);
                    setCustomTopic('');
                  }}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedTopic === topic.id
                      ? 'bg-green-600/20 border-green-500 text-green-300'
                      : 'bg-slate-700/30 border-slate-600/50 text-gray-300 hover:bg-slate-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name={topic.icon} size={20} />
                    <span className="font-medium">{topic.name}</span>
                  </div>
                  <p className="text-sm opacity-70">{topic.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Custom Topic Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Or write your own topic:
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  setSelectedTopic('');
                }}
                placeholder="e.g., Artificial Intelligence in Healthcare"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={generatePost}
              disabled={(!selectedTopic && !customTopic) || isGenerating}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={selectedTopic || customTopic ? { scale: 1.02 } : {}}
              whileTap={selectedTopic || customTopic ? { scale: 0.98 } : {}}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>AI Generating Post...</span>
                </>
              ) : (
                <>
                  <Icon name="sparkles" size={20} />
                  <span>Generate Post</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side - Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Icon name="eye" size={20} />
              <span>Live Preview</span>
            </h3>
            
            <AnimatePresence mode="wait">
              {!showPreview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="file-text" size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Select a topic and click "Generate Post" to see your AI-generated content here
                  </p>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full mx-auto mb-4"
                  />
                  <p className="text-green-400 font-medium mb-2">AI is crafting your post...</p>
                  <p className="text-gray-400 text-sm">This may take a few seconds</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* LinkedIn Post UI */}
                  <div className="bg-white rounded-xl p-4 text-gray-900">
                    {/* Post Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {userData.firstName?.[0] || 'U'}{userData.lastName?.[0] || 'S'}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {userData.firstName || 'Your'} {userData.lastName || 'Name'}
                        </h4>
                        <p className="text-sm text-gray-600">Professional Title • 1st</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <div className="whitespace-pre-line text-sm leading-relaxed mb-4">
                      {generatedPost}
                    </div>
                    
                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-6 text-gray-600">
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <Icon name="thumbs-up" size={16} />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <Icon name="message-circle" size={16} />
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <Icon name="share" size={16} />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Option */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-3">
                      Post generated successfully! You can edit this later.
                    </p>
                    <motion.button
                      onClick={handleContinue}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center space-x-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Continue to Profile Analysis</span>
                      <Icon name="arrow-right" size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}