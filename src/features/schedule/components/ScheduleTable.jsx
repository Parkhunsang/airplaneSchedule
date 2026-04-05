import React from "react";
import { EVENT_TYPE_LABELS } from "../../wallpaper/constants/eventTypes";

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

const EVENT_TYPE_BADGE_STYLES = {
  flight: "bg-[#DBEAFE] text-[#1D4ED8]",
  off: "bg-[#F3E8FF] text-[#7E22CE]",
  training: "bg-[#FCE7F3] text-[#BE185D]",
  standby: "bg-[#FEF3C7] text-[#B45309]",
};

const getEventTypeLabel = (schedule) =>
  EVENT_TYPE_LABELS[schedule.eventType] ?? EVENT_TYPE_LABELS.flight;

const getAircraftLabel = (schedule) => {
  if (schedule.eventType && schedule.eventType !== "flight") {
    return getEventTypeLabel(schedule);
  }

  return (
    schedule.aircraft ||
    schedule.flightNumber ||
    schedule.flightNo ||
    schedule.flight ||
    "-"
  );
};

const getDestinationLabel = (schedule) => {
  if (schedule.eventType && schedule.eventType !== "flight") {
    return getEventTypeLabel(schedule);
  }

  return (
    schedule.destination ||
    schedule.arrivalAirport ||
    schedule.destinationName ||
    schedule.city ||
    "-"
  );
};

const formatDisplayTime = (time, layoverTime) => {
  if (!time || time === "-") {
    return "-";
  }

  if (!layoverTime || layoverTime === "-") {
    return time;
  }

  return `${time} / ${layoverTime}`;
};

function ScheduleTable({ schedules, onDelete }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      {schedules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
          <p className="mb-2 text-base font-medium sm:text-lg">
            아직 등록된 일정이 없습니다.
          </p>
          <p className="text-sm sm:text-base">
            위의 폼에서 새로운 일정을 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="min-h-[200px]">
          <p className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
            등록된 일정 목록
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-x-0 border-spacing-y-[6px] text-sm md:text-base">
              <thead className="hidden sm:table-header-group">
                <tr className="bg-[#1565C0] text-white">
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    날짜
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    구분
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    출발
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    도착
                  </th>
                  <th className="px-3 py-2 text-left font-semibold sm:px-4 sm:py-3 md:px-6">
                    상세
                  </th>
                  <th className="px-3 py-2 text-center font-semibold sm:px-4 sm:py-3 md:px-6">
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {schedules.map((schedule) => {
                  const eventType = schedule.eventType ?? "flight";
                  const aircraftLabel = getAircraftLabel(schedule);
                  const destinationLabel = getDestinationLabel(schedule);
                  const departureDisplay = formatDisplayTime(
                    schedule.departureTime,
                    schedule.hongKongDepartureTime,
                  );
                  const arrivalDisplay = formatDisplayTime(
                    schedule.arrivalTime,
                    schedule.hongKongArrivalTime,
                  );
                  const badgeStyle =
                    EVENT_TYPE_BADGE_STYLES[eventType] ??
                    EVENT_TYPE_BADGE_STYLES.flight;

                  return (
                    <React.Fragment key={schedule.id}>
                      <tr className="border-b border-gray-200 sm:hidden">
                        <td className="p-0" colSpan={6}>
                          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <div className="space-y-3 p-4">
                              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 text-xs text-gray-900">
                                <div>
                                  <p className="font-light">날짜</p>
                                  <p className="text-sm font-light">
                                    {schedule.date}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 font-medium ${badgeStyle}`}
                                >
                                  {getEventTypeLabel(schedule)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 border-b border-gray-100 pb-2 text-xs">
                                <div className="flex flex-col gap-1">
                                  <p className="font-semibold text-gray-500">
                                    출발
                                  </p>
                                  <p className="text-sm font-normal">
                                    {departureDisplay}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="font-semibold text-gray-500">
                                    편명
                                  </p>
                                  <span className="inline-flex items-center justify-center rounded-full bg-[#E0F2FE] px-3 py-1 font-medium text-[#0369A1]">
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
                                    {arrivalDisplay}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="font-semibold text-gray-500">
                                    목적지
                                  </p>
                                  <span className="inline-flex items-center justify-center rounded-full bg-[#CCFBF1] px-3 py-1 font-medium text-[#0F766E]">
                                    {destinationLabel}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onDelete(schedule.id)}
                              className="flex h-7 w-full items-center justify-center gap-1 bg-[#E53935] py-4 text-white transition-all hover:bg-[#E53935] active:bg-red-700"
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
                          <span
                            className={`inline-flex min-w-[96px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${badgeStyle}`}
                          >
                            {getEventTypeLabel(schedule)}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          {departureDisplay}
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          {arrivalDisplay}
                        </td>
                        <td className="px-3 py-2 sm:px-4 md:px-6">
                          <div className="flex flex-col gap-2">
                            <span className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-medium text-[#0369A1] sm:text-sm">
                              {aircraftLabel}
                            </span>
                            <span className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-[#CCFBF1] px-3 py-1 text-xs font-medium text-[#0F766E] sm:text-sm">
                              {destinationLabel}
                            </span>
                          </div>
                        </td>
                        <td className="h-full p-0 text-center">
                          <button
                            onClick={() => onDelete(schedule.id)}
                            className="flex h-full w-full min-h-[68px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 text-base font-bold text-white transition-all hover:bg-red-700 active:bg-red-800 sm:min-w-[110px]"
                          >
                            <DeleteIcon />
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
              총 <strong>{schedules.length}</strong>개의 일정이 등록되어
              있습니다.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ScheduleTable;
