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
    <div className="min-h-[200px]">
      <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">
        등록된 비행편 목록
      </p>
      <div>
        <table className="w-full text-sm md:text-base border-separate border-spacing-y-[6px] border-spacing-x-0">
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
          {/* 모바일 */}
          <tbody>
            {schedules.map((schedule) => (
              <React.Fragment key={schedule.id}>
                <tr className="sm:hidden border-b border-gray-200">
                  <td className="px-3 py-3" colSpan={6}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-6 text-gray-900 text-xs border-b border-gray-200 pb-2">
                        <p className="font-light">날짜</p>
                        <p className="text-sm font-light">{schedule.date}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs border-b border-gray-200 pb-2">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold">출발</p>
                          <p className="text-sm font-normal">
                            {schedule.departureTime}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-gray-900">편명</p>
                          <span className="inline-flex items-center justify-center min-w-[88px] bg-blue-100 text-blue-800 font-medium rounded-full">
                            {schedule.aircraft}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs border-b border-gray-200 pb-2">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold">도착</p>
                          <p className="text-sm font-normal">
                            {schedule.arrivalTime}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-gray-900">도착지</p>
                          <span className="inline-flex items-center justify-center min-w-[88px] bg-purple-100 text-purple-800 font-medium rounded-full">
                            {schedule.destination}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-b bg-red-200 h-8 justify-center">
                        <button
                          onClick={() => onDelete(schedule.id)}
                          title="삭제"
                          className="mt-1 w-fit px-2 py-1 text-lg rounded-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                {/* 웹 */}
                <tr className="hidden sm:table-row border-b border-gray-200 text-sm md:text-base">
                  <td>{schedule.date}</td>
                  <td>{schedule.departureTime}</td>
                  <td>{schedule.arrivalTime}</td>
                  <td>
                    <span className="inline-flex items-center justify-center px-3 py-1 min-w-[80px] bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                      {schedule.aircraft}
                    </span>
                  </td>
                  <td>
                    <span className="inline-flex items-center justify-center px-3 py-1 min-w-[340px] bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                      {schedule.destination}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => onDelete(schedule.id)}
                      title="삭제"
                      className="bg-red-100 text-red-600 border border-red-300 px-2 sm:px-3 py-1 text-sm rounded-lg"
                    >
                      🗑️
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
