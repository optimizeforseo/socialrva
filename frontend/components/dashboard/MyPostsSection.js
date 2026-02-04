"use client";

export default function MyPostsSection({ 
  myPostsTab, 
  setMyPostsTab, 
  timeSlots, 
  setIsEditScheduleOpen 
}) {
  return (
    <main
      className="flex-1 p-6 overflow-y-auto h-full scrollbar-hide"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My posts</h1>
          <p className="text-gray-400">
            {timeSlots.length > 0
              ? `${timeSlots.length} time slot${timeSlots.length > 1 ? "s" : ""} configured for posting`
              : "You have no scheduled posts."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 mb-6">
          {[
            { label: "Scheduled", count: timeSlots.length },
            { label: "Published", count: 0 },
            { label: "Drafts", count: 0 },
            { label: "Errors", count: 0 },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setMyPostsTab(tab.label)}
              className={`flex-1 px-4 py-2 text-sm rounded-md transition-all ${
                myPostsTab === tab.label
                  ? "bg-slate-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}{" "}
              <span className="ml-1 text-xs opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Edit Post Schedule Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsEditScheduleOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800/50 transition-all"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit post schedule</span>
          </button>
        </div>

        {/* Scheduled Posts - List View */}
        {myPostsTab === "Scheduled" && (
          <div className="space-y-4">
            {timeSlots.length > 0 ? (
              <>
                {(() => {
                  const today = new Date();
                  const upcomingDates = [];
                  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                  const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December",
                  ];

                  // Generate next 4 weeks of dates
                  for (let i = 0; i < 28; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const dayKey = dayNames[date.getDay()];

                    // Check if any time slot is scheduled for this day
                    const slotsForDay = timeSlots.filter((slot) => slot.days[dayKey]);

                    if (slotsForDay.length > 0) {
                      upcomingDates.push({
                        date,
                        dayName: dayNames[date.getDay()],
                        fullDayName: [
                          "Sunday", "Monday", "Tuesday", "Wednesday",
                          "Thursday", "Friday", "Saturday",
                        ][date.getDay()],
                        month: monthNames[date.getMonth()],
                        day: date.getDate(),
                        slots: slotsForDay,
                      });
                    }
                  }

                  return upcomingDates.slice(0, 10).map((dateInfo, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all"
                    >
                      {/* Date Header */}
                      <div className="px-6 py-4 border-b border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white">
                          {dateInfo.fullDayName}{" "}
                          <span className="text-gray-400 font-normal">
                            {dateInfo.month} {dateInfo.day}
                          </span>
                        </h3>
                      </div>

                      {/* Time Slots */}
                      <div className="p-4 space-y-3">
                        {dateInfo.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-white font-medium text-base">
                                  {slot.time}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  Press "Add to queue" to place your post here
                                </span>
                              </div>
                              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all">
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </>
            ) : (
              <div className="space-y-6">
                {/* Empty State */}
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-12 text-center">
                  <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Schedule Configured</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Set up your posting schedule to see your weekly calendar view here
                  </p>
                  <button
                    onClick={() => setIsEditScheduleOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 inline-flex items-center space-x-2"
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Create Schedule</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs */}
        {myPostsTab === "Published" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-400">No published posts yet</p>
          </div>
        )}

        {myPostsTab === "Drafts" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <p className="text-gray-400">1 draft saved</p>
          </div>
        )}

        {myPostsTab === "Errors" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-400">No errors</p>
          </div>
        )}
      </div>
    </main>
  );
}