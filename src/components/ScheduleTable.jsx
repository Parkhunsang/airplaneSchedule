import React from "react";

function ScheduleTable({ schedules, onDelete }) {
  if (schedules.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-none p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 shadow-md text-center text-gray-600 dark:text-gray-400">
        <p className="text-base sm:text-lg font-medium mb-2">
          아직 등록된 비행편이 없습니다.
        </p>
        <p className="text-sm sm:text-base">
          위의 폼에서 새로운 비행편을 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-none p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-md w-full min-h-[400px]">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        등록된 비행편 목록
      </h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm md:text-base">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                날짜
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                출발
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                도착
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                편명
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                도착지
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <React.Fragment key={schedule.id}>
                <tr className="sm:hidden border-b border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-3" colSpan={6}>
                    <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 text-sm">
                      <span>{schedule.date}</span>
                      <span>{schedule.departureTime}</span>
                      <span>{schedule.arrivalTime}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                          {schedule.aircraft}
                        </span>
                        <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                          {schedule.destination}
                        </span>
                      </div>
                      <button
                        onClick={() => onDelete(schedule.id)}
                        title="삭제"
                        className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 px-2 py-1 text-xs rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hidden sm:table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm md:text-base">
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900 dark:text-gray-100">
                    {schedule.date}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900 dark:text-gray-100">
                    {schedule.departureTime}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900 dark:text-gray-100">
                    {schedule.arrivalTime}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {schedule.aircraft}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {schedule.destination}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4">
                    <button
                      onClick={() => onDelete(schedule.id)}
                      title="삭제"
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 px-2 sm:px-3 py-1 text-sm rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all transform hover:scale-105"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 text-right text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>총 {schedules.length}개의 비행편이 등록되어 있습니다.</p>
      </div>
    </div>
  );
}

export default ScheduleTable;
