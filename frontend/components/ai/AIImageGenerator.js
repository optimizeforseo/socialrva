"use client";

import { useState } from "react";

export default function AIImageGenerator({ onImageGenerated, generatedImage }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState("/api/placeholder/400/300");

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentImage(data.imageUrl);
        onImageGenerated(data.imageUrl);
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create any image you can dream up with AI image generator.
        </h2>
      </div>

      {/* Image Display */}
      <div className="relative mb-6">
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          {currentImage ? (
            <img
              src={generatedImage || currentImage}
              alt="Generated AI image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
                <p>Your generated image will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Sample prompt overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
            A statue of a woman from the Roman period
            <button className="ml-2 px-2 py-1 bg-blue-600 text-xs rounded">
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the image you want to create..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
          />
        </div>

        <button
          onClick={handleGenerateImage}
          disabled={!prompt.trim() || isGenerating}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </div>
          ) : (
            "Generate Image"
          )}
        </button>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2">
          {[
            "Professional headshot",
            "Modern office space",
            "Abstract art",
            "Nature landscape",
          ].map((quickPrompt) => (
            <button
              key={quickPrompt}
              onClick={() => setPrompt(quickPrompt)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}