import React from "react";
import ScheduleForm from "../ScheduleForm";
import ScheduleTable from "../ScheduleTable";

function ScheduleEntryScreen({
  schedules,
  onAddSchedule,
  onDeleteSchedule,
  onNext,
}) {
  return (
    <section className="min-w-full flex-none">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <ScheduleForm onAddSchedule={onAddSchedule} />
        <ScheduleTable schedules={schedules} onDelete={onDeleteSchedule} />
        <div className="flex justify-end pb-6">
          <button
            type="button"
            onClick={onNext}
            disabled={schedules.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1565C0] pl-5 pr-5 py-3 text-sm font-semibold text-white  disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-base"
          >
            <span className="">다음</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ScheduleEntryScreen;
