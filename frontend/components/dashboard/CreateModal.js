"use client";

export default function CreateModal({ 
  isModalOpen, 
  closeModal, 
  openCreateAI, 
  openWriteYourOwn, 
  carousel, 
  twin, 
  imageAi 
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-[800px] max-w-full max-h-full overflow-y-auto">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 shadow-xl"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="relative z-10 p-8 pb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent text-center mb-2">
            Ready to create your next LinkedIn post?
          </h2>
          <p className="text-slate-300 text-center text-sm">
            Choose how you'd like to create your content
          </p>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 px-8 pb-8">
          {/* Main Options */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Create with AI */}
            <div
              onClick={openCreateAI}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-xl p-4 mb-4 w-fit">
                <svg
                  className="w-8 h-8 text-purple-400"
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
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-2">
                Create with AI
              </h3>
              <p className="text-slate-300 text-sm">
                Let AI generate content based on your brief input
              </p>
            </div>

            {/* Write your own */}
            <div
              onClick={openWriteYourOwn}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 mb-4 w-fit">
                <svg
                  className="w-8 h-8 text-cyan-400"
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
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-2">
                Write your own
              </h3>
              <p className="text-slate-300 text-sm">
                Get AI assistance while writing your own content
              </p>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <p className="text-slate-400 text-sm font-medium">LinkedIn post assets</p>

            {/* Create a carousel */}
            <div
              onClick={carousel}
              className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-xl p-4 border border-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group flex items-center space-x-4"
            >
              <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg p-3 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                  Create a carousel
                </h4>
                <p className="text-slate-300 text-sm">
                  Let AI generate high-performing carousels in minutes
                </p>
              </div>
            </div>

            {/* Generate AI image */}
            <div
              onClick={imageAi}
              className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-xl p-4 border border-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group flex items-center space-x-4"
            >
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg p-3 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-amber-400"
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
              <div className="flex-1">
                <h4 className="font-semibold bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                  Generate AI image
                </h4>
                <p className="text-slate-300 text-sm">
                  Create stunning images instantly with AI
                </p>
              </div>
            </div>

            {/* Generate your AI twin */}
            <div
              onClick={twin}
              className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-xl p-4 border border-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group flex items-center space-x-4"
            >
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg p-3 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-emerald-400"
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
              <div className="flex-1">
                <h4 className="font-semibold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Generate your AI twin
                </h4>
                <p className="text-slate-300 text-sm">
                  Create eye-catching AI images that feature you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}