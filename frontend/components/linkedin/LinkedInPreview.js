"use client";

import { useState } from "react";

export default function LinkedInPreview({
  content,
  user,
  type = "text",
  imageUrl = null,
  metadata = {},
}) {
  const [deviceView, setDeviceView] = useState("desktop");
  const [showActions, setShowActions] = useState(false);

  // Mock engagement data
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [comments, setComments] = useState(Math.floor(Math.random() * 15) + 3);
  const [shares, setShares] = useState(Math.floor(Math.random() * 8) + 1);

  const formatContent = (text) => {
    if (!text) return "";

    // Add line breaks and format hashtags
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line.split(" ").map((word, wordIndex) => {
          if (word.startsWith("#")) {
            return (
              <span
                key={wordIndex}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {word}{" "}
              </span>
            );
          }
          return word + " ";
        })}
        {index < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const getDeviceStyles = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-md mx-auto";
      case "desktop":
      default:
        return "max-w-2xl mx-auto";
    }
  };

  const getImageStyles = () => {
    switch (deviceView) {
      case "mobile":
        return "aspect-square";
      case "tablet":
        return "aspect-video";
      case "desktop":
      default:
        return metadata?.aspectRatio === "portrait"
          ? "aspect-[3/4]"
          : metadata?.aspectRatio === "landscape"
          ? "aspect-video"
          : "aspect-square";
    }
  };

  return (
    <div className="space-y-4">
      {/* Device Toggle */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className="flex bg-slate-800 rounded-lg p-1">
          {[
            { key: "mobile", icon: "📱", label: "Mobile" },
            { key: "tablet", icon: "📟", label: "Tablet" },
            { key: "desktop", icon: "💻", label: "Desktop" },
          ].map((device) => (
            <button
              key={device.key}
              onClick={() => setDeviceView(device.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                deviceView === device.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <span>{device.icon}</span>
              <span className="hidden sm:inline">{device.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LinkedIn Post Preview */}
      <div className={`${getDeviceStyles()} transition-all duration-300`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-600 text-sm font-medium">1st</span>
                </div>

                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.headline || "Professional | Content Creator"}
                </p>

                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs text-gray-500">2m</span>
                  <span className="text-gray-400">•</span>
                  <svg
                    className="w-3 h-3 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600 p-1">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            {type === "text" && content && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {formatContent(content)}
                </p>
              </div>
            )}

            {type === "image" && imageUrl && (
              <div className="space-y-3">
                {content && (
                  <p className="text-gray-800 leading-relaxed">
                    {formatContent(content)}
                  </p>
                )}
                <div
                  className={`${getImageStyles()} overflow-hidden rounded-lg bg-gray-100`}
                >
                  <img
                    src={imageUrl}
                    alt="Generated content"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjOUI5QkEzIi8+CjwvZz4KPC9zdmc+";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Metadata Display */}
            {metadata && Object.keys(metadata).length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2 text-xs">
                  {metadata.writingStyle && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {metadata.writingStyle}
                    </span>
                  )}
                  {metadata.postCategory && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {metadata.postCategory}
                    </span>
                  )}
                  {metadata.style && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {metadata.style}
                    </span>
                  )}
                  {metadata.aspectRatio && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                      {metadata.aspectRatio}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Engagement Bar */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                      </svg>
                    </div>
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                  </div>
                  <span>{likes} reactions</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span>{comments} comments</span>
                <span>{shares} reposts</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-around">
              {[
                {
                  icon: (
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
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                  ),
                  label: "Like",
                  action: () => setLikes((prev) => prev + 1),
                },
                {
                  icon: (
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
                  ),
                  label: "Comment",
                  action: () => setComments((prev) => prev + 1),
                },
                {
                  icon: (
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
                  ),
                  label: "Repost",
                  action: () => setShares((prev) => prev + 1),
                },
                {
                  icon: (
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
                  ),
                  label: "Send",
                  action: () => {},
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Actions */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={() => setShowActions(!showActions)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center space-x-2"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>Preview Options</span>
        </button>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-2">
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span>Save Draft</span>
        </button>

        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-2">
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span>Publish Now</span>
        </button>
      </div>

      {/* Additional Options */}
      {showActions && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 animate-slideIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Engagement
              </label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Likes:</span>
                  <span className="text-blue-400">{likes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Comments:</span>
                  <span className="text-green-400">{comments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Shares:</span>
                  <span className="text-purple-400">{shares}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Performance
              </label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Reach:</span>
                  <span className="text-yellow-400">
                    {(likes * 15 + comments * 8 + shares * 25).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Engagement Rate:</span>
                  <span className="text-cyan-400">
                    {(((likes + comments + shares) / 100) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Actions</label>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
                  Schedule Post
                </button>
                <button className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
                  Add to Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}