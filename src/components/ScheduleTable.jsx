import React from "react";

function ScheduleTable({ schedules, onDelete }) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-none p-3 mb-0 text-center text-gray-600 dark:text-gray-400 bg-white">
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
    <div className="rounded-none p-3 mb-0 w-full min-h-[400px] bg-white">
      <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">
        등록된 비행편 목록
      </p>
      <div className="overflow-x-auto">
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
                    <div className="grid grid-cols-3 gap-2 text-gray-900 text-xs">
                      <div>
                        <p className="font-semibold">날짜</p>
                        <p className="text-sm">{schedule.date}</p>
                      </div>
                      <div>
                        <p className="font-semibold">출발</p>
                        <p className="text-sm">{schedule.departureTime}</p>
                      </div>
                      <div>
                        <p className="font-semibold">도착</p>
                        <p className="text-sm">{schedule.arrivalTime}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="font-semibold text-gray-900">편명</p>
                        <span className="inline-block mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                          {schedule.aircraft}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">도착지</p>
                        <span className="inline-block mt-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                          {schedule.destination}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-900">작업</p>
                        <button
                          onClick={() => onDelete(schedule.id)}
                          title="삭제"
                          className="mt-1 w-fit bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 px-2 py-1 text-xs rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="hidden sm:table-row border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm md:text-base">
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900">
                    {schedule.date}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900">
                    {schedule.departureTime}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900">
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
