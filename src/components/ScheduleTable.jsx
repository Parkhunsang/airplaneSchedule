import React from "react";

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-current"
      fill="currentColor"
    >
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9Zm4 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" />
    </svg>
  );
}

const getAircraftLabel = (schedule) =>
  schedule.aircraft ||
  schedule.flightNumber ||
  schedule.flightNo ||
  schedule.flight ||
  "-";

const getDestinationLabel = (schedule) =>
  schedule.destination ||
  schedule.arrivalAirport ||
  schedule.destinationName ||
  schedule.city ||
  "-";

function ScheduleTable({ schedules, onDelete }) {
  if (schedules.length === 0) {
    return (
      <div className="mb-0 rounded-none border border-gray-200 bg-white p-8 text-center text-gray-600">
        <p className="mb-2 text-base font-medium sm:text-lg">
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
      <p className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
        등록된 비행편 목록
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-x-0 border-spacing-y-[6px] text-sm md:text-base">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                날짜
              </th>
              <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                출발
              </th>
              <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                도착
              </th>
              <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                편명
              </th>
              <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                도착지
              </th>
              <th className="px-3 py-2 text-center font-semibold sm:px-4 sm:py-3 md:px-6">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent">
            {schedules.map((schedule) => {
              const aircraftLabel = getAircraftLabel(schedule);
              const destinationLabel = getDestinationLabel(schedule);

              return (
                <React.Fragment key={schedule.id}>
                  <tr className="border-b border-gray-200 sm:hidden">
                    <td className="p-0" colSpan={6}>
                      <div className="flex flex-col border border-gray-200 bg-white">
                        <div className="space-y-3 p-4">
                          <div className="flex items-center gap-6 border-b border-gray-100 pb-2 text-xs text-gray-900">
                            <p className="font-light">날짜</p>
                            <p className="text-sm font-light">
                              {schedule.date}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-gray-100 pb-2 text-xs">
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold text-gray-500">
                                출발
                              </p>
                              <p className="text-sm font-normal">
                                {schedule.departureTime}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold text-gray-500">
                                편명
                              </p>
                              <span className="inline-flex items-center justify-center rounded-none bg-blue-100 px-3 py-1 font-medium text-blue-800">
                                {aircraftLabel}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold text-gray-500">
                                도착
                              </p>
                              <p className="text-sm font-normal">
                                {schedule.arrivalTime}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold text-gray-500">
                                도착지
                              </p>
                              <span className="inline-flex items-center justify-center rounded-none bg-purple-100 px-3 py-1 font-medium text-purple-800">
                                {destinationLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => onDelete(schedule.id)}
                          className="flex w-full items-center justify-center gap-1 rounded-none bg-red-600 py-5 font-regular text-white transition-all hover:bg-red-700 active:bg-red-800"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr className="hidden h-[68px] border-b border-gray-200 bg-white text-sm transition-colors hover:bg-gray-50 sm:table-row md:text-base">
                    <td className="px-3 py-2 sm:px-4 md:px-6">
                      {schedule.date}
                    </td>
                    <td className="px-3 py-2 sm:px-4 md:px-6">
                      {schedule.departureTime}
                    </td>
                    <td className="px-3 py-2 sm:px-4 md:px-6">
                      {schedule.arrivalTime}
                    </td>
                    <td className="px-3 py-2 sm:px-4 md:px-6">
                      <span className="inline-flex min-w-[80px] items-center justify-center rounded-none bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 sm:text-sm">
                        {aircraftLabel}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 md:px-6">
                      <span className="inline-flex min-w-[340px] items-center justify-center rounded-none bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 sm:text-sm">
                        {destinationLabel}
                      </span>
                    </td>
                    <td className="h-full p-0 text-center">
                      <button
                        onClick={() => onDelete(schedule.id)}
                        className="flex h-full w-full min-h-[68px] items-center justify-center gap-2 rounded-none bg-red-600 px-4 text-base font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] active:bg-red-800 sm:min-w-[110px]"
                      >
                        <DeleteIcon />
                        <span>삭제</span>
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4 text-right text-xs text-gray-600 sm:mt-6 sm:pt-6 sm:text-sm">
        <p>
          총 <strong>{schedules.length}</strong>개의 비행편이 등록되어 있습니다.
        </p>
      </div>
    </div>
  );
}

export default ScheduleTable;
