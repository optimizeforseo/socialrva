"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import aiService from "../services/aiService";
import ViralTemplateModal from "../../components/ui/ViralTemplateModal";

export default function CreateAI() {
  // Active tool state
  const [activeAITool, setActiveAITool] = useState("image");

  // AI Write states
  const [activeTab, setActiveTab] = useState("Add a topic");
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [writingStyle, setWritingStyle] = useState("Socialsonic");
  const [postCategory, setPostCategory] = useState("Thought Leadership");
  const [useViralTemplate, setUseViralTemplate] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  // AI Image states
  const [imageTab, setImageTab] = useState("Generate");
  const [imageDescription, setImageDescription] = useState("");
  const [imageStyle, setImageStyle] = useState("Realistic");
  const [aspectRatio, setAspectRatio] = useState("Square");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // AI Twin states
  const [twinTab, setTwinTab] = useState("Generate");
  const [twinDescription, setTwinDescription] = useState("");
  const [twinStyle, setTwinStyle] = useState("Professional");
  const [generatedTwins, setGeneratedTwins] = useState([]);

  // Carousel states
  const [carouselBuildMode, setCarouselBuildMode] = useState("topic"); // "topic" or "build"
  const [carouselTopic, setCarouselTopic] = useState("");
  const [carouselTone, setCarouselTone] = useState("Formal");
  const [carouselTitle, setCarouselTitle] = useState("");
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [generatedCarousels, setGeneratedCarousels] = useState([]);

  // Video states
  const [videoTopic, setVideoTopic] = useState("");
  const [videoStyle, setVideoStyle] = useState("Educational");
  const [videoDuration, setVideoDuration] = useState("30s");
  const [generatedVideos, setGeneratedVideos] = useState([]);

  // Poll states
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState("1 week");
  const [generatedPolls, setGeneratedPolls] = useState([]);

  // Loading and result states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Preview enhancement states
  const [deviceView, setDeviceView] = useState("mobile"); // mobile, tablet, desktop
  const [generatedVariations, setGeneratedVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [isEditingWithAI, setIsEditingWithAI] = useState(false);

  // Viral template states
  const [showViralTemplateModal, setShowViralTemplateModal] = useState(false);
  const [selectedViralTemplate, setSelectedViralTemplate] = useState(null);

  // File upload ref
  const fileInputRef = useRef(null);
  const editMenuRef = useRef(null);

  const router = useRouter();

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Redirect to login if no user data
      router.push("/");
    }
  }, [router]);

  // Generate AI Text
  const handleCreateText = async () => {
    let inputContent = "";

    if (activeTab === "Add a topic") {
      if (!topic.trim()) {
        setError("Please enter a topic to generate content");
        return;
      }
      inputContent = topic;
    } else if (activeTab === "Add a URL") {
      if (!url.trim()) {
        setError("Please enter a valid URL");
        return;
      }
      inputContent = `Content from URL: ${url}`;
    } else if (activeTab === "Upload a File") {
      if (!uploadedFile) {
        setError("Please upload a file to generate content");
        return;
      }
      inputContent = `Content from file: ${uploadedFile.name}`;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await aiService.generateText(inputContent, {
        writingStyle: writingStyle.toLowerCase(),
        postCategory: postCategory.toLowerCase().replace(" ", "-"),
        useViralTemplate,
        viralTemplate: selectedViralTemplate,
        length: "medium",
        userId: user?.id && user.id !== "demo-12345" ? user.id : null,
      });

      if (response.success) {
        // Generate 3 variations for user to choose from
        const variations = [
          {
            id: 1,
            content: response.data.content,
            metadata: response.data.metadata,
          },
        ];

        // Generate 2 more variations
        for (let i = 2; i <= 3; i++) {
          try {
            const variationResponse = await aiService.generateText(
              inputContent,
              {
                writingStyle: writingStyle.toLowerCase(),
                postCategory: postCategory.toLowerCase().replace(" ", "-"),
                useViralTemplate,
                length: "medium",
              }
            );

            if (variationResponse.success) {
              variations.push({
                id: i,
                content: variationResponse.data.content,
                metadata: variationResponse.data.metadata,
              });
            }
          } catch (error) {
            console.log(`Failed to generate variation ${i}:`, error.message);
          }
        }

        setGeneratedVariations(variations);
        setGeneratedContent(variations[0]);
        setSelectedVariation(0);
      }
    } catch (error) {
      setError(error.message || "Failed to generate text");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI Image
  const handleCreateImage = async () => {
    if (!imageDescription.trim()) {
      setError("Please enter an image description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await aiService.generateImage(imageDescription, {
        style: imageStyle.toLowerCase(),
        aspectRatio: aspectRatio.toLowerCase(),
        userId: user?.id && user.id !== "demo-12345" ? user.id : null,
      });

      if (response.success) {
        const newImage = {
          id: Date.now(),
          imageUrl: response.data.imageUrl,
          prompt: imageDescription,
          revisedPrompt: response.data.revisedPrompt,
          style: imageStyle,
          aspectRatio: aspectRatio,
          metadata: response.data.metadata,
        };

        setGeneratedImages((prev) => [newImage, ...prev]);
        setSelectedImage(newImage);
        setGeneratedContent({
          type: "image",
          content: newImage,
          metadata: response.data.metadata,
        });
      }
    } catch (error) {
      setError(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI Twin
  const handleCreateTwin = async () => {
    if (!twinDescription.trim()) {
      setError("Please enter a description for your AI twin");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await aiService.generateImage(
        `AI twin portrait: ${twinDescription}, ${twinStyle.toLowerCase()} style, professional headshot`,
        {
          style: "realistic",
          aspectRatio: "portrait",
          userId: user?.id && user.id !== "demo-12345" ? user.id : null,
        }
      );

      if (response.success) {
        const newTwin = {
          id: Date.now(),
          imageUrl: response.data.imageUrl,
          description: twinDescription,
          style: twinStyle,
          metadata: response.data.metadata,
        };

        setGeneratedTwins((prev) => [newTwin, ...prev]);
        setGeneratedContent({
          type: "twin",
          content: newTwin,
          metadata: response.data.metadata,
        });
      }
    } catch (error) {
      setError(error.message || "Failed to generate AI twin");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Carousel
  const handleCreateCarousel = async () => {
    if (carouselBuildMode === "topic" && !carouselTopic.trim()) {
      setError("Please enter a carousel topic");
      return;
    }
    if (carouselBuildMode === "build" && !carouselTitle.trim()) {
      setError("Please enter a carousel title");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt =
        carouselBuildMode === "topic"
          ? `Create a LinkedIn carousel about: ${carouselTopic}. Tone: ${carouselTone}. Generate 5-7 slides with titles and content.`
          : `Create a LinkedIn carousel with title: ${carouselTitle}. Tone: ${carouselTone}. Generate 5-7 slides with content.`;

      const response = await aiService.generateText(prompt, {
        writingStyle: carouselTone.toLowerCase(),
        postCategory: "carousel",
        length: "long",
        userId: user?.id && user.id !== "demo-12345" ? user.id : null,
      });

      if (response.success) {
        const newCarousel = {
          id: Date.now(),
          title: carouselTitle || `Carousel: ${carouselTopic}`,
          topic: carouselTopic,
          tone: carouselTone,
          content: response.data.content,
          slides: parseCarouselSlides(response.data.content),
          metadata: response.data.metadata,
        };

        setGeneratedCarousels((prev) => [newCarousel, ...prev]);
        setGeneratedContent({
          type: "carousel",
          content: newCarousel,
          metadata: response.data.metadata,
        });
      }
    } catch (error) {
      setError(error.message || "Failed to generate carousel");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Video
  const handleCreateVideo = async () => {
    if (!videoTopic.trim()) {
      setError("Please enter a video topic");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `Create a ${videoDuration} ${videoStyle.toLowerCase()} video script about: ${videoTopic}. Include scene descriptions, narration, and visual elements.`;

      const response = await aiService.generateText(prompt, {
        writingStyle: videoStyle.toLowerCase(),
        postCategory: "video-script",
        length: "long",
        userId: user?.id && user.id !== "demo-12345" ? user.id : null,
      });

      if (response.success) {
        const newVideo = {
          id: Date.now(),
          topic: videoTopic,
          style: videoStyle,
          duration: videoDuration,
          script: response.data.content,
          metadata: response.data.metadata,
        };

        setGeneratedVideos((prev) => [newVideo, ...prev]);
        setGeneratedContent({
          type: "video",
          content: newVideo,
          metadata: response.data.metadata,
        });
      }
    } catch (error) {
      setError(error.message || "Failed to generate video");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Poll
  const handleCreatePoll = async () => {
    if (!pollQuestion.trim()) {
      setError("Please enter a poll question");
      return;
    }
    if (pollOptions.some((option) => !option.trim())) {
      setError("Please fill in all poll options");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const newPoll = {
        id: Date.now(),
        question: pollQuestion,
        options: pollOptions.filter((option) => option.trim()),
        duration: pollDuration,
        metadata: { type: "poll", createdAt: new Date() },
      };

      setGeneratedPolls((prev) => [newPoll, ...prev]);
      setGeneratedContent({
        type: "poll",
        content: newPoll,
        metadata: newPoll.metadata,
      });
    } catch (error) {
      setError(error.message || "Failed to create poll");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to parse carousel slides
  const parseCarouselSlides = (content) => {
    const slides = content
      .split(/Slide \d+:|Page \d+:/)
      .filter((slide) => slide.trim());
    return slides.map((slide, index) => ({
      id: index + 1,
      title: `Slide ${index + 1}`,
      content: slide.trim(),
    }));
  };

  // Add poll option
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  // Remove poll option
  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // Update poll option
  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a valid file type (TXT, PDF, CSV, DOCX)");
        return;
      }

      if (file.size > maxSize) {
        setError("File size must be less than 10MB");
        return;
      }

      setUploadedFile(file);
      setError(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ai-generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Test backend connection
  const testConnection = async () => {
    try {
      setError("Testing connection...");
      const result = await aiService.testConnection();
      if (result.success) {
        setError("✅ Backend connection successful! Server is running.");
      } else {
        setError(`❌ Connection failed: ${result.error}`);
      }
    } catch (error) {
      setError(`❌ Connection test failed: ${error.message}`);
    }
  };

  // Edit with AI functionality
  const handleEditWithAI = async (operation) => {
    if (!generatedContent?.content) return;

    setIsEditingWithAI(true);
    setShowEditMenu(false);

    try {
      let editPrompt = "";
      const currentContent = generatedContent.content;

      switch (operation) {
        case "improve":
          editPrompt = `Improve this LinkedIn post while keeping the same message and tone: ${currentContent}`;
          break;
        case "hook":
          editPrompt = `Create a better hook/opening for this LinkedIn post: ${currentContent}`;
          break;
        case "grammar":
          editPrompt = `Fix spelling and grammar in this LinkedIn post: ${currentContent}`;
          break;
        case "hashtags":
          editPrompt = `Add relevant hashtags to this LinkedIn post: ${currentContent}`;
          break;
        case "longer":
          editPrompt = `Make this LinkedIn post longer and more detailed: ${currentContent}`;
          break;
        case "shorter":
          editPrompt = `Make this LinkedIn post shorter and more concise: ${currentContent}`;
          break;
        case "tone-professional":
          editPrompt = `Rewrite this LinkedIn post in a professional tone: ${currentContent}`;
          break;
        case "tone-casual":
          editPrompt = `Rewrite this LinkedIn post in a casual, friendly tone: ${currentContent}`;
          break;
        case "emojis":
          editPrompt = `Add relevant emojis to this LinkedIn post: ${currentContent}`;
          break;
        case "translate":
          editPrompt = `Translate this LinkedIn post to Spanish: ${currentContent}`;
          break;
        default:
          editPrompt = `Improve this LinkedIn post: ${currentContent}`;
      }

      const response = await aiService.generateText(editPrompt, {
        writingStyle: "professional",
        postCategory: "thought-leadership",
        length: "medium",
      });

      if (response.success) {
        const editedContent = {
          type: "text",
          content: response.data.content,
          metadata: response.data.metadata,
        };

        setGeneratedContent(editedContent);

        // Update the current variation
        const updatedVariations = [...generatedVariations];
        updatedVariations[selectedVariation] = editedContent;
        setGeneratedVariations(updatedVariations);
      }
    } catch (error) {
      setError(`Failed to edit content: ${error.message}`);
    } finally {
      setIsEditingWithAI(false);
    }
  };

  // Publish to LinkedIn
  const handlePublishToLinkedIn = async () => {
    if (!user || user.isDemoMode || !generatedContent) {
      setError("Please connect your LinkedIn account to publish");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      let contentToPublish = "";

      // Extract content based on type
      if (typeof generatedContent.content === "string") {
        contentToPublish = generatedContent.content;
      } else if (generatedContent.type === "image") {
        contentToPublish = `Check out this AI-generated image! 🎨\n\nPrompt: ${generatedContent.content.prompt}`;
      } else if (generatedContent.type === "poll") {
        contentToPublish = `${
          generatedContent.content.question
        }\n\nOptions:\n${generatedContent.content.options
          .map((opt, i) => `${i + 1}. ${opt}`)
          .join("\n")}`;
      } else if (generatedContent.content?.content) {
        contentToPublish = generatedContent.content.content;
      } else {
        throw new Error("No content available to publish");
      }

      const response = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: contentToPublish,
          userId: user.id,
          accessToken: user.accessToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, redirect to re-authenticate
          localStorage.removeItem("user");
          router.push("/");
          return;
        }
        throw new Error(data.error || "Failed to publish to LinkedIn");
      }

      // Show success message
      setError("✅ Successfully published to LinkedIn!");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } catch (error) {
      console.error("Publish error:", error);
      setError(error.message || "Failed to publish to LinkedIn");
    } finally {
      setIsPublishing(false);
    }
  };

  // Close edit menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editMenuRef.current && !editMenuRef.current.contains(event.target)) {
        setShowEditMenu(false);
      }
    };

    if (showEditMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEditMenu]);

  // Handle viral template selection
  const handleViralTemplateSelect = async (template) => {
    setSelectedViralTemplate(template);
    setUseViralTemplate(true);

    // Generate content based on the viral template
    try {
      setIsGenerating(true);
      setError(null);

      let templatePrompt = "";

      if (activeTab === "Add a topic" && topic.trim()) {
        templatePrompt = `Create a LinkedIn post about "${topic}" using this viral template structure:

Template: "${template.content}"

Author: ${template.author?.name || "Unknown"}
Engagement: ${template.engagement?.reactions || 0} reactions, ${
          template.engagement?.comments || 0
        } comments

Key elements that made this viral:
${template.breakdown || "High engagement and clear structure"}

Adapt this template structure to my topic while maintaining the viral elements. Keep the same tone and format but make it about my specific topic.`;
      } else {
        templatePrompt = `Adapt this viral LinkedIn template for a general business/professional audience:

Template: "${template.content}"

Author: ${template.author?.name || "Unknown"}
Engagement: ${template.engagement?.reactions || 0} reactions, ${
          template.engagement?.comments || 0
        } comments

Create a similar post that follows the same structure and viral elements but with fresh content that would resonate with professionals.`;
      }

      const response = await aiService.generateText(templatePrompt, {
        writingStyle: "viral",
        postCategory: "viral-template",
        useViralTemplate: true,
        templateId: template.id,
        length: "medium",
        userId: user?.id && user.id !== "demo-12345" ? user.id : null,
      });

      if (response.success) {
        const variations = [
          {
            id: 1,
            content: response.data.content,
            metadata: {
              ...response.data.metadata,
              templateUsed: template.author?.name || "Unknown",
              originalEngagement: template.engagement,
            },
          },
        ];

        // Generate 2 more variations based on the template
        for (let i = 2; i <= 3; i++) {
          try {
            const variationResponse = await aiService.generateText(
              templatePrompt,
              {
                writingStyle: "viral",
                postCategory: "viral-template",
                useViralTemplate: true,
                templateId: template.id,
                length: "medium",
              }
            );

            if (variationResponse.success) {
              variations.push({
                id: i,
                content: variationResponse.data.content,
                metadata: {
                  ...variationResponse.data.metadata,
                  templateUsed: template.author?.name || "Unknown",
                  originalEngagement: template.engagement,
                },
              });
            }
          } catch (error) {
            console.log(
              `Failed to generate template variation ${i}:`,
              error.message
            );
          }
        }

        setGeneratedVariations(variations);
        setGeneratedContent(variations[0]);
        setSelectedVariation(0);
      }
    } catch (error) {
      setError(error.message || "Failed to generate content from template");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-semibold">Create with AI</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-400 hover:text-white text-sm flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add to queue</span>
            </button>
            {user && !user.isDemoMode && generatedContent && (
              <button
                onClick={handlePublishToLinkedIn}
                disabled={isPublishing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm flex items-center space-x-2"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>Publish to LinkedIn</span>
                  </>
                )}
              </button>
            )}
            {(!user || user.isDemoMode) && (
              <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm cursor-not-allowed">
                Connect LinkedIn to Publish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Left Sidebar - Navigation */}
      <div className="w-16 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4 space-y-4 mt-16">
        {/* AI Write */}
        <div
          onClick={() => setActiveAITool("write")}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            activeAITool === "write"
              ? "bg-purple-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <div className="text-xs text-gray-400 text-center">AI Write</div>

        {/* AI Image */}
        <div
          onClick={() => setActiveAITool("image")}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            activeAITool === "image"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-xs text-gray-400 text-center">AI Image</div>

        {/* AI Twin */}
        <div
          onClick={() => setActiveAITool("twin")}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            activeAITool === "twin"
              ? "bg-green-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="text-xs text-gray-400 text-center">AI Twin</div>

        {/* Carousel */}
        <div
          onClick={() => setActiveAITool("carousel")}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            activeAITool === "carousel"
              ? "bg-orange-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2"
            />
          </svg>
        </div>
        <div className="text-xs text-gray-400 text-center">Carousel</div>

        {/* Video */}
        <div
          onClick={() => setActiveAITool("video")}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            activeAITool === "video"
              ? "bg-red-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-xs text-gray-400 text-center">Video</div>

        {/* Polls */}
        <div
          onClick={() => setActiveAITool("poll")}
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            activeAITool === "poll"
              ? "bg-yellow-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="text-xs text-gray-400 text-center">Polls</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex mt-16">
        {/* Left Panel - Form */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-6">
          {/* AI Image Form */}
          {activeAITool === "image" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Generate AI Images
                </h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
                {["Generate", "My creations"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setImageTab(tab)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                      imageTab === tab
                        ? "bg-slate-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {imageTab === "Generate" && (
                <>
                  {/* Image Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Describe your image in detail
                    </label>
                    <textarea
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder="What would you like to create"
                      className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                    <div className="flex items-center mt-2 text-xs text-blue-400 cursor-pointer">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Inspire me
                    </div>
                  </div>

                  {/* Style */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">
                      Style
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "Realistic", image: "/api/placeholder/80/80" },
                        { name: "Animation", image: "/api/placeholder/80/80" },
                      ].map((style) => (
                        <button
                          key={style.name}
                          onClick={() => setImageStyle(style.name)}
                          className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                            imageStyle === style.name
                              ? "border-blue-500"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="aspect-square bg-slate-700 flex items-center justify-center">
                            <div className="w-12 h-12 bg-orange-400 rounded-lg"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs py-1 px-2">
                            {style.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">
                      Aspect Ratio
                    </label>
                    <div className="flex space-x-3">
                      {[
                        { name: "Square", icon: "⬜", value: "Square" },
                        { name: "Landscape", icon: "▭", value: "Landscape" },
                        { name: "Portrait", icon: "▯", value: "Portrait" },
                      ].map((ratio) => (
                        <label
                          key={ratio.name}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="aspectRatio"
                            value={ratio.value}
                            checked={aspectRatio === ratio.value}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">
                            {ratio.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleCreateImage}
                    disabled={!imageDescription.trim() || isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {imageTab === "My creations" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400">No images created yet</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  className={`p-3 rounded-lg ${
                    error.startsWith("✅")
                      ? "bg-green-900/50 border border-green-700"
                      : "bg-red-900/50 border border-red-700"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      error.startsWith("✅") ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI Write Form */}
          {activeAITool === "write" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Create with AI
                </h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
                {["Add a topic", "Add a URL", "Upload a File"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                      activeTab === tab
                        ? "bg-slate-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Topic Tab */}
              {activeTab === "Add a topic" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Topic
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic here..."
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                  />
                </div>
              )}

              {/* URL Tab */}
              {activeTab === "Add a URL" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              )}

              {/* File Upload Tab */}
              {activeTab === "Upload a File" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Upload File
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-slate-500 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".txt,.pdf,.csv,.docx"
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <div>
                        <p className="text-white">{uploadedFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-8 h-8 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-gray-400">Click to upload file</p>
                        <p className="text-gray-500 text-xs">
                          TXT, PDF, CSV, DOCX
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Writing Style */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Writing style
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Mimic the style of Top LinkedIn influencers
                </p>
                <select
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="Socialsonic">Socialsonic</option>
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              {/* Post Category */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Post category
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Sets the main focus and purpose of your post
                </p>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="Thought Leadership">Thought Leadership</option>
                  <option value="Industry News">Industry News</option>
                  <option value="Personal Story">Personal Story</option>
                  <option value="Tips & Advice">Tips & Advice</option>
                  <option value="Company Update">Company Update</option>
                </select>
              </div>

              {/* Viral Template Toggle */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-white">
                        Use a viral template instead
                      </h3>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Replicate the success of viral LinkedIn posts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!useViralTemplate) {
                        setShowViralTemplateModal(true);
                      }
                      setUseViralTemplate(!useViralTemplate);
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useViralTemplate ? "bg-purple-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useViralTemplate ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Selected Template Preview */}
                {useViralTemplate && selectedViralTemplate && (
                  <div className="mt-4 p-3 bg-slate-600 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {selectedViralTemplate.author?.name?.[0] || "T"}
                        </div>
                        <span className="text-white text-sm font-medium">
                          {selectedViralTemplate.author?.name || "Template"}'s
                          Template
                        </span>
                      </div>
                      <button
                        onClick={() => setShowViralTemplateModal(true)}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-gray-300 text-xs line-clamp-2">
                      {selectedViralTemplate.content || "Template content"}
                    </p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                      <span>
                        🔥 {selectedViralTemplate.engagement?.reactions || 0}{" "}
                        reactions
                      </span>
                      <span>
                        💬 {selectedViralTemplate.engagement?.comments || 0}{" "}
                        comments
                      </span>
                    </div>
                  </div>
                )}

                {/* Browse Templates Button */}
                {useViralTemplate && !selectedViralTemplate && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowViralTemplateModal(true)}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Browse Viral Templates</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleCreateText}
                disabled={
                  isGenerating ||
                  (!topic.trim() && activeTab === "Add a topic") ||
                  (!url.trim() && activeTab === "Add a URL") ||
                  (!uploadedFile && activeTab === "Upload a File")
                }
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Create</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* AI Twin Form */}
          {activeAITool === "twin" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Create AI Twin
                </h2>
              </div>

              <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
                {["Generate", "My twins"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTwinTab(tab)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                      twinTab === tab
                        ? "bg-slate-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {twinTab === "Generate" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Describe your AI twin
                    </label>
                    <textarea
                      value={twinDescription}
                      onChange={(e) => setTwinDescription(e.target.value)}
                      placeholder="Professional headshot, business attire, confident expression..."
                      className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Style
                    </label>
                    <select
                      value={twinStyle}
                      onChange={(e) => setTwinStyle(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Casual">Casual</option>
                      <option value="Creative">Creative</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCreateTwin}
                    disabled={!twinDescription.trim() || isGenerating}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Twin...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Create Twin</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Carousel Form */}
          {activeAITool === "carousel" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Create Carousel
                </h2>
              </div>

              <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
                {["From topic", "Build manually"].map((mode, index) => (
                  <button
                    key={mode}
                    onClick={() =>
                      setCarouselBuildMode(index === 0 ? "topic" : "build")
                    }
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                      (carouselBuildMode === "topic" && index === 0) ||
                      (carouselBuildMode === "build" && index === 1)
                        ? "bg-slate-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {carouselBuildMode === "topic" ? (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Carousel Topic
                  </label>
                  <textarea
                    value={carouselTopic}
                    onChange={(e) => setCarouselTopic(e.target.value)}
                    placeholder="Enter the main topic for your carousel..."
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Carousel Title
                  </label>
                  <input
                    type="text"
                    value={carouselTitle}
                    onChange={(e) => setCarouselTitle(e.target.value)}
                    placeholder="Enter carousel title..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Tone
                </label>
                <select
                  value={carouselTone}
                  onChange={(e) => setCarouselTone(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="Formal">Formal</option>
                  <option value="Casual">Casual</option>
                  <option value="Professional">Professional</option>
                  <option value="Educational">Educational</option>
                </select>
              </div>

              <button
                onClick={handleCreateCarousel}
                disabled={
                  isGenerating ||
                  (carouselBuildMode === "topic" && !carouselTopic.trim()) ||
                  (carouselBuildMode === "build" && !carouselTitle.trim())
                }
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Carousel...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2"
                      />
                    </svg>
                    <span>Create Carousel</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Video Form */}
          {activeAITool === "video" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Create Video Script
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Video Topic
                </label>
                <textarea
                  value={videoTopic}
                  onChange={(e) => setVideoTopic(e.target.value)}
                  placeholder="What should your video be about?"
                  className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Video Style
                </label>
                <select
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                >
                  <option value="Educational">Educational</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Promotional">Promotional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Duration
                </label>
                <select
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                >
                  <option value="30s">30 seconds</option>
                  <option value="1min">1 minute</option>
                  <option value="2min">2 minutes</option>
                  <option value="5min">5 minutes</option>
                </select>
              </div>

              <button
                onClick={handleCreateVideo}
                disabled={!videoTopic.trim() || isGenerating}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Script...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Create Script</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Poll Form */}
          {activeAITool === "poll" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Create Poll
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Poll Question
                </label>
                <textarea
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="What question do you want to ask?"
                  className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Poll Options
                </label>
                <div className="space-y-2">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updatePollOption(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          onClick={() => removePollOption(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 4 && (
                  <button
                    onClick={addPollOption}
                    className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Add option</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Poll Duration
                </label>
                <select
                  value={pollDuration}
                  onChange={(e) => setPollDuration(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                >
                  <option value="1 day">1 day</option>
                  <option value="3 days">3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                </select>
              </div>

              <button
                onClick={handleCreatePoll}
                disabled={
                  !pollQuestion.trim() ||
                  pollOptions.some((option) => !option.trim()) ||
                  isGenerating
                }
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Poll...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Create Poll</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Enhanced Preview */}
        <div className="flex-1 bg-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Device View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1">
                {[
                  { id: "mobile", icon: "📱", label: "Mobile" },
                  { id: "tablet", icon: "📟", label: "Tablet" },
                  { id: "desktop", icon: "🖥️", label: "Desktop" },
                ].map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setDeviceView(device.id)}
                    className={`px-3 py-2 rounded-md text-sm transition-all ${
                      deviceView === device.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="mr-1">{device.icon}</span>
                    <span className="hidden sm:inline">{device.label}</span>
                  </button>
                ))}
              </div>

              {generatedVariations.length > 1 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Variations:</span>
                  {generatedVariations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedVariation(index);
                        setGeneratedContent(generatedVariations[index]);
                      }}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                        selectedVariation === index
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-gray-400 hover:bg-slate-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Container */}
            <div
              className={`mx-auto transition-all duration-300 ${
                deviceView === "mobile"
                  ? "max-w-sm"
                  : deviceView === "tablet"
                  ? "max-w-2xl"
                  : "max-w-4xl"
              }`}
            >
              {generatedContent ? (
                <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
                  {/* LinkedIn Post Header */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user?.firstName?.[0] || "U"}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">
                            {user?.firstName || "User"}{" "}
                            {user?.lastName || "Name"}
                          </h3>
                          <span className="text-blue-400 text-sm">• 1st</span>
                          {!user?.isDemoMode && (
                            <span className="text-green-400 text-xs bg-green-900/30 px-2 py-1 rounded">
                              ✓ LinkedIn
                            </span>
                          )}
                          {user?.isDemoMode && (
                            <span className="text-yellow-400 text-xs bg-yellow-900/30 px-2 py-1 rounded">
                              Demo Mode
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {user?.isDemoMode
                            ? "Frontend Developer at Optimize For Seo || MERN Full Stack Developer || React JS"
                            : "Content Creator using SocialSonic AI"}
                        </p>
                        <p className="text-xs text-gray-500">Just now • 🌍</p>
                      </div>

                      {/* Edit with AI Button */}
                      <div className="relative" ref={editMenuRef}>
                        <button
                          onClick={() => setShowEditMenu(!showEditMenu)}
                          className="flex items-center space-x-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                          disabled={isEditingWithAI}
                        >
                          {isEditingWithAI ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Editing...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>Edit with AI</span>
                            </>
                          )}
                        </button>

                        {/* Edit Menu Dropdown */}
                        {showEditMenu && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 py-2">
                            <div className="px-3 py-2 text-xs text-gray-400 border-b border-slate-700">
                              ✨ Suggest changes...
                            </div>

                            {[
                              {
                                id: "improve",
                                icon: "🔄",
                                label: "Keep Writing",
                                desc: "Continue the post",
                              },
                              {
                                id: "improve",
                                icon: "✨",
                                label: "Improve writing",
                                desc: "Make it better",
                              },
                              {
                                id: "hook",
                                icon: "🎣",
                                label: "Change hook",
                                desc: "Better opening",
                              },
                              {
                                id: "grammar",
                                icon: "📝",
                                label: "Fix spelling and grammar",
                                desc: "Correct errors",
                              },
                              {
                                id: "hashtags",
                                icon: "#️⃣",
                                label: "Generate hashtags",
                                desc: "Add relevant tags",
                              },
                              {
                                id: "translate",
                                icon: "🌐",
                                label: "Translate",
                                desc: "To other languages",
                              },
                              {
                                id: "longer",
                                icon: "📏",
                                label: "Make longer",
                                desc: "Add more content",
                              },
                              {
                                id: "shorter",
                                icon: "✂️",
                                label: "Make shorter",
                                desc: "Reduce length",
                              },
                              {
                                id: "tone-professional",
                                icon: "💼",
                                label: "Change tone",
                                desc: "Professional style",
                              },
                              {
                                id: "emojis",
                                icon: "😊",
                                label: "Add emojis",
                                desc: "Make it engaging",
                              },
                            ].map((item) => (
                              <button
                                key={`${item.id}-${item.label}`}
                                onClick={() => handleEditWithAI(item.id)}
                                className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-3"
                              >
                                <span className="text-lg">{item.icon}</span>
                                <div className="flex-1">
                                  <div className="text-sm text-white">
                                    {item.label}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {item.desc}
                                  </div>
                                </div>
                                {item.label === "Translate" && (
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    {generatedContent.type === "image" ? (
                      <div className="space-y-3">
                        <div className="text-white whitespace-pre-wrap leading-relaxed">
                          Check out this AI-generated image! 🎨
                        </div>
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={generatedContent.content.imageUrl}
                            alt={generatedContent.content.prompt}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="text-sm text-gray-400">
                          Prompt: {generatedContent.content.prompt}
                        </div>
                      </div>
                    ) : generatedContent.type === "twin" ? (
                      <div className="space-y-3">
                        <div className="text-white whitespace-pre-wrap leading-relaxed">
                          Meet my AI Twin! 👤
                        </div>
                        <div className="rounded-lg overflow-hidden max-w-sm">
                          <img
                            src={generatedContent.content.imageUrl}
                            alt={generatedContent.content.description}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="text-sm text-gray-400">
                          Style: {generatedContent.content.style}
                        </div>
                      </div>
                    ) : generatedContent.type === "carousel" ? (
                      <div className="space-y-3">
                        <div className="text-white whitespace-pre-wrap leading-relaxed">
                          {generatedContent.content.title} 📊
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="text-sm text-gray-300">
                            {generatedContent.content.content}
                          </div>
                        </div>
                      </div>
                    ) : generatedContent.type === "video" ? (
                      <div className="space-y-3">
                        <div className="text-white whitespace-pre-wrap leading-relaxed">
                          Video Script: {generatedContent.content.topic} 🎬
                        </div>
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="text-sm text-gray-300 whitespace-pre-wrap">
                            {generatedContent.content.script}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          Duration: {generatedContent.content.duration} | Style:{" "}
                          {generatedContent.content.style}
                        </div>
                      </div>
                    ) : generatedContent.type === "poll" ? (
                      <div className="space-y-3">
                        <div className="text-white whitespace-pre-wrap leading-relaxed">
                          {generatedContent.content.question} 📊
                        </div>
                        <div className="space-y-2">
                          {generatedContent.content.options.map(
                            (option, index) => (
                              <div
                                key={index}
                                className="bg-slate-700 rounded-lg p-3 text-sm text-gray-300"
                              >
                                {option}
                              </div>
                            )
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          Poll duration: {generatedContent.content.duration}
                        </div>
                      </div>
                    ) : (
                      <div className="text-white whitespace-pre-wrap leading-relaxed">
                        {typeof generatedContent.content === "string"
                          ? generatedContent.content
                          : generatedContent.content?.content ||
                            "Generated content will appear here"}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                          <span className="text-sm">Share</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          <span className="text-sm">Send</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add Comment Section */}
                  <div className="px-4 py-3 border-t border-slate-700">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Add first comment</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Your post preview will appear here
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Fill in the fields on the left to generate your LinkedIn
                    post
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Viral Template Modal */}
      <ViralTemplateModal
        isOpen={showViralTemplateModal}
        onClose={() => setShowViralTemplateModal(false)}
        onSelectTemplate={handleViralTemplateSelect}
      />
    </div>
  );
}