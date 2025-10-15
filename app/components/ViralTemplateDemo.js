"use client";

import { useState } from "react";
import ViralTemplateModal from "./ViralTemplateModal";
import { SparklesIcon, FireIcon } from "@heroicons/react/24/outline";

export default function ViralTemplateDemo() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);

    // Simulate AI content generation based on template
    const adaptedContent = `🚀 Inspired by ${
      template.author.name
    }'s viral post pattern:

${template.content.split("\n")[0]}

[Your content would be generated here using the same structure and viral elements]

Original engagement: ${template.engagement.reactions.toLocaleString()} reactions
Viral score: ${template.viralScore}/100`;

    setGeneratedContent(adaptedContent);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Viral Template System Demo
          </h2>
          <p className="text-gray-400">
            Test the complete viral LinkedIn post template functionality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                🔥 Features Included:
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Real viral LinkedIn posts with engagement data</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Modern UI with Heroicons and filters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Live search and category filtering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>AI-powered template analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Profile images with verification badges</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Engagement metrics and viral scores</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FireIcon className="w-5 h-5" />
              <span>Open Viral Templates</span>
            </button>

            {selectedTemplate && (
              <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                <h4 className="text-white font-medium mb-2">
                  Selected Template:
                </h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    <strong>Author:</strong> {selectedTemplate.author.name}
                  </p>
                  <p>
                    <strong>Followers:</strong>{" "}
                    {selectedTemplate.author.followers}
                  </p>
                  <p>
                    <strong>Viral Score:</strong> {selectedTemplate.viralScore}
                    /100
                  </p>
                  <p>
                    <strong>Engagement:</strong>{" "}
                    {selectedTemplate.engagement.reactions.toLocaleString()}{" "}
                    reactions
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="bg-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Generated Content Preview
            </h3>
            {generatedContent ? (
              <div className="bg-slate-800 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap">
                {generatedContent}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a viral template to see AI-generated content</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">50+</div>
            <div className="text-sm text-gray-400">Viral Templates</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">95%</div>
            <div className="text-sm text-gray-400">Avg Viral Score</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">1M+</div>
            <div className="text-sm text-gray-400">Total Engagement</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ViralTemplateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}
