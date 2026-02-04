"use client";

export default function ComingSoonSection({ activeSection }) {
  return (
    <main
      className="flex-1 p-6 overflow-y-auto h-full scrollbar-hide flex items-center justify-center"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
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
        <h2 className="text-2xl font-bold text-white mb-2 capitalize">{activeSection}</h2>
        <p className="text-gray-400">This section is coming soon!</p>
      </div>
    </main>
  );
}