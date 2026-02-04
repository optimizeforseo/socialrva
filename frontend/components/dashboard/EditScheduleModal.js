"use client";

export default function EditScheduleModal({
  isEditScheduleOpen,
  setIsEditScheduleOpen,
  timeSlots,
  setTimeSlots,
  newTimeSlot,
  setNewTimeSlot,
  frequency,
  setFrequency,
  editingSlot,
  setEditingSlot,
}) {
  if (!isEditScheduleOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Overlay */}
      <div
        onClick={() => setIsEditScheduleOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal - Enhanced */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header - Enhanced */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-2">
                Edit Post Schedule
              </h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Asia/Calcutta (GMT+06:30)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{timeSlots.length} active slots</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditScheduleOpen(false)}
              className="p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800/50 transition-all hover:rotate-90 duration-300"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Enhanced */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Add New Time Slot - Enhanced */}
          <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-400"
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
              </div>
              <h3 className="text-lg font-semibold text-white">Add New Time Slot</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Time</label>
                <input
                  type="time"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="everyday">Everyday</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const days =
                      frequency === "everyday"
                        ? {
                            Sun: true,
                            Mon: true,
                            Tue: true,
                            Wed: true,
                            Thu: true,
                            Fri: true,
                            Sat: true,
                          }
                        : frequency === "weekdays"
                        ? {
                            Sun: false,
                            Mon: true,
                            Tue: true,
                            Wed: true,
                            Thu: true,
                            Fri: true,
                            Sat: false,
                          }
                        : frequency === "weekends"
                        ? {
                            Sun: true,
                            Mon: false,
                            Tue: false,
                            Wed: false,
                            Thu: false,
                            Fri: false,
                            Sat: true,
                          }
                        : {
                            Sun: false,
                            Mon: false,
                            Tue: false,
                            Wed: false,
                            Thu: false,
                            Fri: false,
                            Sat: false,
                          };

                    setTimeSlots([
                      ...timeSlots,
                      {
                        id: Date.now(),
                        time: newTimeSlot,
                        days,
                      },
                    ]);
                    setNewTimeSlot("12:00");
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
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
                  <span>Add Slot</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timetable - Enhanced */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                <h3 className="text-lg font-semibold text-white">Weekly Schedule</h3>
              </div>
              {timeSlots.length > 0 && (
                <button
                  onClick={() => setTimeSlots([])}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
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
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {timeSlots.length === 0 ? (
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-12 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg mb-2">No time slots scheduled</p>
                <p className="text-gray-500 text-sm">Add your first time slot to get started</p>
              </div>
            ) : (
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-9 gap-2 p-4 bg-slate-800/50 border-b border-slate-700/50">
                  <div className="text-sm font-semibold text-gray-300 flex items-center space-x-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Time</span>
                  </div>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-sm font-semibold text-gray-300 text-center">
                      {day}
                    </div>
                  ))}
                  <div className="text-sm font-semibold text-gray-300 text-center">Actions</div>
                </div>

                {/* Time Slot Rows */}
                <div className="divide-y divide-slate-700/50">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className="grid grid-cols-9 gap-2 p-4 hover:bg-slate-800/50 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600/20 rounded-lg text-blue-400 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="time"
                          value={slot.time}
                          onChange={(e) => {
                            const updated = [...timeSlots];
                            updated[index].time = e.target.value;
                            setTimeSlots(updated);
                          }}
                          className="px-2 py-1 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="flex items-center justify-center">
                          <button
                            onClick={() => {
                              const updated = [...timeSlots];
                              updated[index].days[day] = !updated[index].days[day];
                              setTimeSlots(updated);
                            }}
                            className={`w-8 h-8 rounded-lg border-2 transition-all transform hover:scale-110 ${
                              slot.days[day]
                                ? "bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 shadow-lg shadow-blue-500/25"
                                : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
                            }`}
                          >
                            {slot.days[day] && (
                              <svg
                                className="w-full h-full text-white p-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingSlot(slot.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"
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
                        </button>
                        <button
                          onClick={() => {
                            setTimeSlots(timeSlots.filter((s) => s.id !== slot.id));
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Enhanced */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Changes will be saved to your schedule</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditScheduleOpen(false)}
              className="px-6 py-2.5 text-gray-400 hover:text-white border border-slate-700 rounded-xl hover:bg-slate-800/50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: Save to backend
                console.log("Saving schedule:", timeSlots);
                // API call would go here
                setIsEditScheduleOpen(false);
              }}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center space-x-2"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}