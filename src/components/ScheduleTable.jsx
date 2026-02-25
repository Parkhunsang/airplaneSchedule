import React from "react";

function ScheduleTable({ schedules, onDelete }) {
  if (schedules.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-none p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 shadow-md text-center text-gray-600 dark:text-gray-400">
        <p className="text-base sm:text-lg font-medium mb-2">
          ?뱥 ?꾩쭅 ?깅줉??鍮꾪뻾?몄씠 ?놁뒿?덈떎.
        </p>
        <p className="text-sm sm:text-base">
          ?꾩쓽 ?쇱뿉???덈줈??鍮꾪뻾?몄쓣 異붽??대낫?몄슂!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-none p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-md w-full min-h-[400px]">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        ?뱤 ?깅줉??鍮꾪뻾??紐⑸줉
      </h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                ?좎쭨
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                異쒕컻
              </th>
              <th className="table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                ?꾩갑
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                ?몃챸
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                ?꾩갑吏
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-semibold">
                ?묒뾽
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm md:text-base"
              >
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900 dark:text-gray-100">
                  {schedule.date}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900 dark:text-gray-100">
                  {schedule.departureTime}
                </td>
                <td className="table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-4 text-gray-900 dark:text-gray-100">
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
                    title="??젣"
                    className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 px-2 sm:px-3 py-1 text-sm rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all transform hover:scale-105"
                  >
                    ?뿊截?
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 text-right text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>珥?{schedules.length}媛쒖쓽 鍮꾪뻾?몄씠 ?깅줉?섏뼱 ?덉뒿?덈떎.</p>
      </div>
    </div>
  );
}

export default ScheduleTable;
