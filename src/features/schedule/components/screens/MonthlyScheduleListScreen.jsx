import React from "react";
import { useTranslation } from "react-i18next";

function MonthlyScheduleListScreen({
  monthOptions,
  isGenerating,
  generatingLabel,
  deletingMonthKey,
  onSelectMonth,
  onDeleteMonth,
  onStartNew,
}) {
  const { t } = useTranslation();

  return (
    <section className="min-w-full flex-none">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("monthList.title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              {t("monthList.description")}
            </p>
          </div>

          {monthOptions.length > 0 ? (
            <div className="space-y-3">
              {monthOptions.map((option) => {
                const isDeleting = deletingMonthKey === option.key;
                const isOpening =
                  isGenerating && generatingLabel === option.label;

                return (
                  <div
                    key={option.key}
                    className="flex items-stretch gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectMonth(option)}
                      disabled={isGenerating || isDeleting}
                      className="flex flex-1 items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div>
                        <p className="text-base font-semibold text-gray-900 sm:text-lg">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {t("monthList.totalSchedules", {
                            count: option.schedules.length,
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#1565C0]">
                        {isOpening
                          ? t("monthList.opening")
                          : t("monthList.open")}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteMonth(option)}
                      disabled={isGenerating || isDeleting}
                      className="shrink-0 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting
                        ? t("monthList.deleting")
                        : t("monthList.delete")}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              {t("monthList.empty")}
            </div>
          )}
        </section>

        <div className="flex justify-end pb-6">
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center justify-center rounded-full bg-[#1E6DEB] px-5 py-3 text-sm font-semibold text-white sm:text-base"
          >
            {t("monthList.startNew")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default MonthlyScheduleListScreen;
