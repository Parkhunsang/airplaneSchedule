import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ScheduleForm from "../ScheduleForm";
import ScheduleTable from "../ScheduleTable";

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
  actions = null,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
        >
          <span className="text-xl font-bold text-gray-900 sm:text-2xl">
            {title}
          </span>
          <span
            aria-hidden="true"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1565C0] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ˅
          </span>
        </button>
        {actions}
      </div>

      {isOpen ? <div className="p-4 sm:p-5">{children}</div> : null}
    </section>
  );
}

function ScheduleEntryScreen({
  schedules,
  sortOption,
  onChangeSortOption,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onExportSchedules,
  onPrev,
  onNext,
}) {
  const { t } = useTranslation();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isListOpen, setIsListOpen] = useState(true);

  useEffect(() => {
    if (!editingSchedule || typeof window === "undefined") {
      return;
    }

    setIsFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [editingSchedule]);

  return (
    <section className="min-w-full flex-none">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-5">
        <CollapsibleSection
          title={editingSchedule?.id ? "일정 수정" : t("schedule.addTitle")}
          isOpen={isFormOpen}
          onToggle={() => setIsFormOpen((prev) => !prev)}
        >
          <ScheduleForm
            onAddSchedule={onAddSchedule}
            onUpdateSchedule={onUpdateSchedule}
            editingSchedule={editingSchedule}
            onCancelEdit={() => setEditingSchedule(null)}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={t("schedule.listTitle")}
          isOpen={isListOpen}
          onToggle={() => setIsListOpen((prev) => !prev)}
          actions={
            isListOpen ? (
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
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
            ) : null
          }
        >
          <div className="flex flex-col gap-3 sm:hidden">
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
          <ScheduleTable
            schedules={schedules}
            onDelete={onDeleteSchedule}
            onEdit={setEditingSchedule}
          />
        </CollapsibleSection>

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
