import React from "react";
import { useTranslation } from "react-i18next";
import ScheduleForm from "../ScheduleForm";
import ScheduleTable from "../ScheduleTable";

function ScheduleEntryScreen({
  schedules,
  sortOption,
  onChangeSortOption,
  onAddSchedule,
  onDeleteSchedule,
  onExportSchedules,
  onPrev,
  onNext,
}) {
  const { t } = useTranslation();

  return (
    <section className="min-w-full flex-none">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <ScheduleForm onAddSchedule={onAddSchedule} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>{t("schedule.sort")}</span>
            <select
              value={sortOption}
              onChange={(e) => onChangeSortOption(e.target.value)}
              className="min-h-[40px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1565C0] focus:outline-none"
            >
              <option value="date_asc">{t("schedule.sortDateAsc")}</option>
              <option value="date_desc">{t("schedule.sortDateDesc")}</option>
              <option value="flight_desc">Flight</option>
              <option value="standby_desc">Standby</option>
              <option value="training_desc">Training</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => onExportSchedules(schedules)}
            disabled={schedules.length === 0}
            className="inline-flex items-center justify-center rounded-full border border-[#1565C0] px-4 py-2 text-sm font-semibold text-[#1565C0] disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            {t("schedule.exportExcel")}
          </button>
        </div>
        <ScheduleTable schedules={schedules} onDelete={onDeleteSchedule} />
        <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:text-base"
          >
            {t("schedule.prev")}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={schedules.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E6DEB] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-base"
          >
            <span>{t("schedule.next")}</span>
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ScheduleEntryScreen;
