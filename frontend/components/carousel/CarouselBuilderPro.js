"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Plus,
  Trash2,
  Copy,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Type,
  Palette,
  Layout,
  Grid3x3,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Check,
  X,
  Loader2,
  ZoomIn,
  ZoomOut,
  Share2,
} from "lucide-react";

export default function CarouselBuilderPro() {
  const [activeTab, setActiveTab] = useState("create");
  const [carouselTitle, setCarouselTitle] = useState("");
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: "Welcome",
      content: "Start creating your amazing carousel",
      bgColor: "#1e293b",
      textColor: "#ffffff",
      fontSize: "24",
      fontWeight: "bold",
      textAlign: "center",
      image: null,
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [savedCarousels, setSavedCarousels] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [notification, setNotification] = useState(null);

  const slideRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCarousels();
  }, []);

  const loadCarousels = async () => {
    try {
      const response = await fetch("/api/carousels");
      if (response.ok) {
        const data = await response.json();
        setSavedCarousels(data.carousels || []);
      }
    } catch (error) {
      console.error("Failed to load carousels:", error);
      // Use mock data if API fails
      setSavedCarousels([
        {
          id: 1,
          title: "LinkedIn Growth Tips",
          slides: [{ id: 1, title: "Tip 1" }],
          createdAt: "2024-01-15",
        },
        {
          id: 2,
          title: "Content Strategy",
          slides: [{ id: 1, title: "Strategy 1" }],
          createdAt: "2024-01-10",
        },
      ]);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: `Slide ${slides.length + 1}`,
      content: "",
      bgColor: slides[currentSlideIndex]?.bgColor || "#1e293b",
      textColor: slides[currentSlideIndex]?.textColor || "#ffffff",
      fontSize: "24",
      fontWeight: "normal",
      textAlign: "center",
      image: null,
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    showNotification("Slide added successfully");
  };

  const deleteSlide = (index) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      if (currentSlideIndex >= newSlides.length)
        setCurrentSlideIndex(newSlides.length - 1);
      showNotification("Slide deleted");
    }
  };

  const duplicateSlide = (index) => {
    const slideToDuplicate = { ...slides[index], id: Date.now() };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, slideToDuplicate);
    setSlides(newSlides);
    showNotification("Slide duplicated");
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSlide(currentSlideIndex, "image", reader.result);
        showNotification("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWithAI = async () => {
    if (!carouselTitle.trim()) {
      showNotification("Please enter a carousel title first", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: carouselTitle }),
      });
      if (response.ok) {
        const data = await response.json();
        setSlides(data.slides || []);
        showNotification("Carousel generated successfully!");
      } else {
        // Fallback: Generate mock slides
        const mockSlides = [
          {
            id: 1,
            title: "Introduction",
            content: `Welcome to ${carouselTitle}`,
            bgColor: "#1e293b",
            textColor: "#ffffff",
            fontSize: "24",
            fontWeight: "bold",
            textAlign: "center",
            image: null,
          },
          {
            id: 2,
            title: "Key Point 1",
            content: "First important insight",
            bgColor: "#3b82f6",
            textColor: "#ffffff",
            fontSize: "24",
            fontWeight: "bold",
            textAlign: "center",
            image: null,
          },
          {
            id: 3,
            title: "Key Point 2",
            content: "Second important insight",
            bgColor: "#8b5cf6",
            textColor: "#ffffff",
            fontSize: "24",
            fontWeight: "bold",
            textAlign: "center",
            image: null,
          },
          {
            id: 4,
            title: "Key Point 3",
            content: "Third important insight",
            bgColor: "#10b981",
            textColor: "#ffffff",
            fontSize: "24",
            fontWeight: "bold",
            textAlign: "center",
            image: null,
          },
          {
            id: 5,
            title: "Conclusion",
            content: "Thank you for reading!",
            bgColor: "#1e293b",
            textColor: "#ffffff",
            fontSize: "24",
            fontWeight: "bold",
            textAlign: "center",
            image: null,
          },
        ];
        setSlides(mockSlides);
        showNotification("Carousel generated successfully!");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      showNotification("Error generating carousel", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCarousel = async () => {
    if (!carouselTitle.trim()) {
      showNotification("Please enter a carousel title", "error");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("/api/carousels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: carouselTitle,
          slides: slides,
          createdAt: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        showNotification("Carousel saved successfully!");
        loadCarousels();
      } else {
        // Save to localStorage as fallback
        const saved = JSON.parse(localStorage.getItem("carousels") || "[]");
        saved.push({
          id: Date.now(),
          title: carouselTitle,
          slides,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("carousels", JSON.stringify(saved));
        showNotification("Carousel saved locally!");
        loadCarousels();
      }
    } catch (error) {
      console.error("Save error:", error);
      showNotification("Error saving carousel", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1080, 1080],
      });
      for (let i = 0; i < slides.length; i++) {
        setCurrentSlideIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const canvas = await html2canvas(slideRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false,
        });
        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080);
      }
      pdf.save(`${carouselTitle || "carousel"}.pdf`);
      showNotification("PDF exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      showNotification("Error exporting PDF", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const exportSlideAsImage = async () => {
    try {
      const canvas = await html2canvas(slideRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `slide-${currentSlideIndex + 1}.png`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification("Slide exported as image!");
      });
    } catch (error) {
      console.error("Export error:", error);
      showNotification("Error exporting image", "error");
    }
  };

  const loadCarousel = (carousel) => {
    setCarouselTitle(carousel.title);
    setSlides(carousel.slides);
    setCurrentSlideIndex(0);
    setActiveTab("create");
    showNotification("Carousel loaded");
  };

  const deleteCarousel = async (id) => {
    try {
      const response = await fetch(`/api/carousels/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showNotification("Carousel deleted");
        loadCarousels();
      }
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("Error deleting carousel", "error");
    }
  };

  const colorPresets = [
    { name: "Slate", bg: "#1e293b", text: "#ffffff" },
    { name: "Blue", bg: "#3b82f6", text: "#ffffff" },
    { name: "Purple", bg: "#8b5cf6", text: "#ffffff" },
    { name: "Green", bg: "#10b981", text: "#ffffff" },
    { name: "Orange", bg: "#f59e0b", text: "#000000" },
    { name: "Red", bg: "#ef4444", text: "#ffffff" },
    { name: "Pink", bg: "#ec4899", text: "#ffffff" },
    { name: "Cyan", bg: "#06b6d4", text: "#ffffff" },
    { name: "White", bg: "#ffffff", text: "#000000" },
    { name: "Black", bg: "#000000", text: "#ffffff" },
  ];

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {notification.type === "error" ? (
                <X className="w-5 h-5" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Carousel Builder Pro
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create professional LinkedIn carousels with AI and export as PDF
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showPreview ? "Hide" : "Show"} Preview</span>
          </button>
          <button
            onClick={saveCarousel}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={exportAsPDF}
            disabled={isExporting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
          </button>
        </div>
      </div>

      {/* Carousel Title Input */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="text-slate-300 text-sm mb-2 block font-medium">
              Carousel Title
            </label>
            <input
              type="text"
              value={carouselTitle}
              onChange={(e) => setCarouselTitle(e.target.value)}
              placeholder="Enter your carousel title..."
              className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="pt-6">
            <button
              onClick={generateWithAI}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "create"
              ? "text-white border-blue-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4" />
            <span>Create & Edit</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "saved"
              ? "text-white border-blue-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>Saved Carousels ({savedCarousels.length})</span>
          </div>
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Slide List */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-700/50 sticky top-4">
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
              <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentSlideIndex === index
                        ? "bg-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                        : "bg-slate-800/50 border border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium truncate">
                        {index + 1}. {slide.title || `Slide ${index + 1}`}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSlide(index);
                          }}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide(index);
                          }}
                          disabled={slides.length === 1}
                          className="p-1 text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div
                      className="w-full h-20 rounded border border-slate-600 flex items-center justify-center text-xs overflow-hidden"
                      style={{ backgroundColor: slide.bgColor }}
                    >
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt="Slide preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span style={{ color: slide.textColor }}>
                          {slide.title || "Preview"}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - Editor */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Edit Slide {currentSlideIndex + 1}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm mb-2 block font-medium">
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
                <div>
                  <label className="text-slate-300 text-sm mb-2 block font-medium">
                    Content
                  </label>
                  <textarea
                    value={slides[currentSlideIndex]?.content || ""}
                    onChange={(e) =>
                      updateSlide(currentSlideIndex, "content", e.target.value)
                    }
                    placeholder="Enter slide content..."
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-sm mb-2 block font-medium flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Background Image</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </button>
                    {slides[currentSlideIndex]?.image && (
                      <button
                        onClick={() =>
                          updateSlide(currentSlideIndex, "image", null)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">
                      Font Size
                    </label>
                    <select
                      value={slides[currentSlideIndex]?.fontSize || "24"}
                      onChange={(e) =>
                        updateSlide(
                          currentSlideIndex,
                          "fontSize",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="16">Small</option>
                      <option value="20">Medium</option>
                      <option value="24">Large</option>
                      <option value="32">X-Large</option>
                      <option value="40">XX-Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">
                      Font Weight
                    </label>
                    <select
                      value={slides[currentSlideIndex]?.fontWeight || "normal"}
                      onChange={(e) =>
                        updateSlide(
                          currentSlideIndex,
                          "fontWeight",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="bolder">Bolder</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">
                      Text Align
                    </label>
                    <select
                      value={slides[currentSlideIndex]?.textAlign || "center"}
                      onChange={(e) =>
                        updateSlide(
                          currentSlideIndex,
                          "textAlign",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block font-medium flex items-center space-x-2">
                      <Palette className="w-4 h-4" />
                      <span>Background</span>
                    </label>
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
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block font-medium flex items-center space-x-2">
                      <Type className="w-4 h-4" />
                      <span>Text Color</span>
                    </label>
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
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 text-sm mb-2 block font-medium">
                    Quick Color Presets
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateSlide(currentSlideIndex, "bgColor", preset.bg);
                          updateSlide(
                            currentSlideIndex,
                            "textColor",
                            preset.text
                          );
                        }}
                        className="h-10 rounded border-2 border-slate-600 hover:border-white transition-all duration-200 relative group"
                        style={{ backgroundColor: preset.bg }}
                        title={preset.name}
                      >
                        <span
                          className="text-xs font-medium"
                          style={{ color: preset.text }}
                        >
                          {preset.name.charAt(0)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-4">
            {showPreview && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
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
                <div
                  ref={slideRef}
                  className="aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-slate-600"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-8 relative"
                    style={{
                      backgroundColor: slides[currentSlideIndex]?.bgColor,
                      color: slides[currentSlideIndex]?.textColor,
                      backgroundImage: slides[currentSlideIndex]?.image
                        ? `url(${slides[currentSlideIndex].image})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div
                      className={`${
                        slides[currentSlideIndex]?.image
                          ? "bg-black/50 p-6 rounded-xl"
                          : ""
                      }`}
                    >
                      <h2
                        className="font-bold mb-4"
                        style={{
                          fontSize: `${slides[currentSlideIndex]?.fontSize}px`,
                          fontWeight: slides[currentSlideIndex]?.fontWeight,
                          textAlign: slides[currentSlideIndex]?.textAlign,
                        }}
                      >
                        {slides[currentSlideIndex]?.title || "Slide Title"}
                      </h2>
                      <p
                        className="leading-relaxed"
                        style={{
                          fontSize: `${
                            parseInt(slides[currentSlideIndex]?.fontSize) * 0.6
                          }px`,
                          textAlign: slides[currentSlideIndex]?.textAlign,
                        }}
                      >
                        {slides[currentSlideIndex]?.content ||
                          "Your content will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      Zoom: {zoom}%
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoom(100)}
                        className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setZoom(Math.min(150, zoom + 10))}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={exportSlideAsImage}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Slide</span>
                    </button>
                    <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            <input
              type="text"
              placeholder="Search carousels..."
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCarousels.map((carousel) => (
              <motion.div
                key={carousel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="w-full h-40 rounded-lg mb-4 flex items-center justify-center text-white text-lg font-semibold bg-gradient-to-br from-blue-600 to-purple-600">
                  {carousel.title}
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {carousel.title}
                </h3>
                <div className="flex items-center justify-between text-slate-400 text-sm mb-4">
                  <span>{carousel.slides?.length || 0} slides</span>
                  <span>
                    {new Date(carousel.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadCarousel(carousel)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCarousel(carousel.id)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-red-400 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}