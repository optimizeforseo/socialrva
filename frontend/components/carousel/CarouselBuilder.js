"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Eye,
  Download,
  Sparkles,
  Layout,
  Type,
  Image as ImageIcon,
  Palette,
  Grid3x3,
  Save,
  Share2,
  Wand2,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CarouselBuilder() {
  const [activeTab, setActiveTab] = useState("create");
  const [carouselTitle, setCarouselTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: "Slide 1",
      content: "",
      bgColor: "#1e293b",
      textColor: "#ffffff",
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [carouselTheme, setCarouselTheme] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCarousels, setSavedCarousels] = useState([
    {
      id: 1,
      title: "5 Tips for LinkedIn Growth",
      slides: 7,
      theme: "modern",
      createdAt: "2 days ago",
      thumbnail: "#3b82f6",
    },
    {
      id: 2,
      title: "Content Marketing Strategy",
      slides: 10,
      theme: "minimal",
      createdAt: "1 week ago",
      thumbnail: "#8b5cf6",
    },
  ]);

  // Carousel templates
  const templates = [
    {
      id: 1,
      name: "Tips & Tricks",
      icon: "💡",
      slides: 7,
      description: "Perfect for sharing actionable tips",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Step-by-Step Guide",
      icon: "📋",
      slides: 10,
      description: "Detailed tutorial format",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Statistics & Data",
      icon: "📊",
      slides: 8,
      description: "Data-driven storytelling",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Before & After",
      icon: "🔄",
      slides: 5,
      description: "Transformation stories",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      name: "Quote Collection",
      icon: "💬",
      slides: 6,
      description: "Inspirational quotes",
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: 6,
      name: "Product Showcase",
      icon: "🎯",
      slides: 8,
      description: "Feature highlights",
      color: "from-pink-500 to-rose-500",
    },
  ];

  // Theme presets
  const themes = [
    {
      id: "modern",
      name: "Modern",
      bg: "#1e293b",
      text: "#ffffff",
      accent: "#3b82f6",
    },
    {
      id: "minimal",
      name: "Minimal",
      bg: "#ffffff",
      text: "#000000",
      accent: "#000000",
    },
    {
      id: "gradient",
      name: "Gradient",
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff",
      accent: "#ffffff",
    },
    {
      id: "dark",
      name: "Dark",
      bg: "#0f172a",
      text: "#e2e8f0",
      accent: "#06b6d4",
    },
    {
      id: "vibrant",
      name: "Vibrant",
      bg: "#ec4899",
      text: "#ffffff",
      accent: "#fbbf24",
    },
  ];

  // Color presets
  const colorPresets = [
    "#1e293b",
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#ffffff",
    "#000000",
  ];

  // Add new slide
  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: `Slide ${slides.length + 1}`,
      content: "",
      bgColor: slides[currentSlideIndex]?.bgColor || "#1e293b",
      textColor: slides[currentSlideIndex]?.textColor || "#ffffff",
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  // Delete slide
  const deleteSlide = (index) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      if (currentSlideIndex >= newSlides.length) {
        setCurrentSlideIndex(newSlides.length - 1);
      }
    }
  };

  // Duplicate slide
  const duplicateSlide = (index) => {
    const slideToDuplicate = { ...slides[index], id: Date.now() };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, slideToDuplicate);
    setSlides(newSlides);
  };

  // Move slide up
  const moveSlideUp = (index) => {
    if (index > 0) {
      const newSlides = [...slides];
      [newSlides[index - 1], newSlides[index]] = [
        newSlides[index],
        newSlides[index - 1],
      ];
      setSlides(newSlides);
      setCurrentSlideIndex(index - 1);
    }
  };

  // Move slide down
  const moveSlideDown = (index) => {
    if (index < slides.length - 1) {
      const newSlides = [...slides];
      [newSlides[index], newSlides[index + 1]] = [
        newSlides[index + 1],
        newSlides[index],
      ];
      setSlides(newSlides);
      setCurrentSlideIndex(index + 1);
    }
  };

  // Update slide content
  const updateSlide = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  // Generate with AI
  const generateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const aiSlides = [
        {
          id: 1,
          title: "Introduction",
          content: "Welcome to our guide on LinkedIn success",
          bgColor: "#1e293b",
          textColor: "#ffffff",
        },
        {
          id: 2,
          title: "Tip #1",
          content: "Post consistently at optimal times",
          bgColor: "#3b82f6",
          textColor: "#ffffff",
        },
        {
          id: 3,
          title: "Tip #2",
          content: "Engage with your audience authentically",
          bgColor: "#8b5cf6",
          textColor: "#ffffff",
        },
        {
          id: 4,
          title: "Tip #3",
          content: "Use visual content to stand out",
          bgColor: "#10b981",
          textColor: "#ffffff",
        },
        {
          id: 5,
          title: "Conclusion",
          content: "Start implementing these tips today!",
          bgColor: "#1e293b",
          textColor: "#ffffff",
        },
      ];
      setSlides(aiSlides);
      setIsGenerating(false);
    }, 2000);
  };

  // Apply template
  const applyTemplate = (template) => {
    setSelectedTemplate(template);
    const templateSlides = Array.from({ length: template.slides }, (_, i) => ({
      id: Date.now() + i,
      title: `Slide ${i + 1}`,
      content: "",
      bgColor: "#1e293b",
      textColor: "#ffffff",
    }));
    setSlides(templateSlides);
    setCurrentSlideIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Carousel Builder
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create stunning LinkedIn carousels with AI-powered tools
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Carousel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "create"
              ? "text-white border-blue-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "templates"
              ? "text-white border-blue-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4" />
            <span>Templates</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "saved"
              ? "text-white border-blue-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>Saved Carousels</span>
          </div>
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Slide List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Grid3x3 className="w-4 h-4" />
                  <span>Slides ({slides.length})</span>
                </h3>
                <button
                  onClick={addSlide}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-hide">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentSlideIndex === index
                        ? "bg-blue-600/20 border-2 border-blue-500"
                        : "bg-slate-800/50 border border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">
                        {slide.title || `Slide ${index + 1}`}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSlideUp(index);
                          }}
                 disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSlideDown(index);
                          }}
                          disabled={index === slides.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSlide(index);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide(index);
                          }}
                          disabled={slides.length === 1}
                          className="p-1 text-red-400 hover:text-red-300 disabled:opacity-30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div
                      className="w-full h-16 rounded border border-slate-600 flex items-center justify-center text-xs text-slate-400"
                      style={{ backgroundColor: slide.bgColor }}
                    >
                      <span style={{ color: slide.textColor }}>Preview</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle Panel - Slide Editor */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Edit Slide {currentSlideIndex + 1}</span>
              </h3>

              <div className="space-y-4">
                {/* Slide Title */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">
                    Slide Title
                  </label>
                  <input
                    type="text"
                    value={slides[currentSlideIndex]?.title || ""}
                    onChange={(e) =>
                      updateSlide(currentSlideIndex, "title", e.target.value)
                    }
                    placeholder="Enter slide title..."
                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Slide Content */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">
                    Content
                  </label>
                  <textarea
                    value={slides[currentSlideIndex]?.content || ""}
                    onChange={(e) =>
                      updateSlide(currentSlideIndex, "content", e.target.value)
                    }
                    placeholder="Enter slide content..."
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Background Color */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block flex items-center space-x-2">
                    <Palette className="w-4 h-4" />
                    <span>Background Color</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={slides[currentSlideIndex]?.bgColor || "#1e293b"}
                      onChange={(e) =>
                        updateSlide(
                          currentSlideIndex,
                          "bgColor",
                          e.target.value
                        )
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            updateSlide(currentSlideIndex, "bgColor", color)
                          }
                          className="w-8 h-8 rounded border-2 border-slate-600 hover:border-white transition-all duration-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-slate-300 text-sm mb-2 block flex items-center space-x-2">
                    <Type className="w-4 h-4" />
                    <span>Text Color</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={slides[currentSlideIndex]?.textColor || "#ffffff"}
                      onChange={(e) =>
                        updateSlide(
                          currentSlideIndex,
                          "textColor",
                          e.target.value
                        )
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          updateSlide(currentSlideIndex, "textColor", "#ffffff")
                        }
                        className="px-3 py-1 bg-white text-black rounded text-sm font-medium"
                      >
                        White
                      </button>
                      <button
                        onClick={() =>
                          updateSlide(currentSlideIndex, "textColor", "#000000")
                        }
                        className="px-3 py-1 bg-black text-white rounded text-sm font-medium"
                      >
                        Black
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Enhancement */}
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Enhance with AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Live Preview</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
                    }
                    disabled={currentSlideIndex === 0}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-slate-400 text-sm">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentSlideIndex(
                        Math.min(slides.length - 1, currentSlideIndex + 1)
                      )
                    }
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Carousel Preview */}
              <div className="aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-slate-600">
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                  style={{
                    backgroundColor: slides[currentSlideIndex]?.bgColor,
                    color: slides[currentSlideIndex]?.textColor,
                  }}
                >
                  <h2 className="text-2xl font-bold mb-4">
                    {slides[currentSlideIndex]?.title || "Slide Title"}
                  </h2>
                  <p className="text-base leading-relaxed">
                    {slides[currentSlideIndex]?.content ||
                      "Your content will appear here..."}
                  </p>
                </div>
              </div>

              {/* Preview Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Quick Themes
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      slides.forEach((_, index) => {
                        updateSlide(index, "bgColor", theme.bg);
                        updateSlide(index, "textColor", theme.text);
                      });
                    }}
                    className="p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-200 text-left"
                  >
                    <div
                      className="w-full h-8 rounded mb-2"
                      style={{ background: theme.bg }}
                    />
                    <span className="text-white text-xs font-medium">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => applyTemplate(template)}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-3xl`}
                >
                  {template.icon}
                </div>
                <span className="text-slate-400 text-sm">
                  {template.slides} slides
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {template.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {template.description}
              </p>
              <button
                className={`w-full bg-gradient-to-r ${template.color} text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                <Plus className="w-4 h-4" />
                <span>Use Template</span>
              </button>
            </div>
          ))}

          {/* Custom Template */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border-2 border-dashed border-slate-600 hover:border-slate-500 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Create Custom
            </h3>
            <p className="text-slate-400 text-sm text-center">
              Start from scratch with your own design
            </p>
          </div>
        </div>
      )}

      {/* Saved Carousels Tab */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              {savedCarousels.length} saved carousels
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search carousels..."
                className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCarousels.map((carousel) => (
              <div
                key={carousel.id}
                className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div
                  className="w-full h-40 rounded-lg mb-4 flex items-center justify-center text-white text-lg font-semibold"
                  style={{ backgroundColor: carousel.thumbnail }}
                >
                  {carousel.title}
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {carousel.title}
                </h3>
                <div className="flex items-center justify-between text-slate-400 text-sm mb-4">
                  <span>{carousel.slides} slides</span>
                  <span>{carousel.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    Edit
                  </button>
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg transition-all duration-200">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-red-400 rounded-lg transition-all duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
          