import React from "react";
import { useTranslation } from "react-i18next";
import WallpaperBuilder from "../WallpaperBuilder";

function WallpaperResultScreen({
  generatedWallpaperUrl,
  onPrev,
  onGoHome,
  onDownload,
  onGoStepOne,
  onGoStepTwo,
  title,
  subtitle,
  stepLabel,
  showPrevButton = true,
  showHomeButton = true,
  showStepMoveButtons = true,
}) {
  const { t } = useTranslation();

  const resolvedTitle = title ?? t("wallpaper.resultTitle");
  const resolvedSubtitle = subtitle ?? t("wallpaper.resultSubtitle");
  const resolvedStepLabel = stepLabel ?? t("wallpaper.resultStepLabel");

  return (
    <section className="min-w-full min-w-0 flex-none">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5">
        <WallpaperBuilder title={resolvedTitle} subtitle={resolvedSubtitle}>
          <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-5">
            <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
              {resolvedStepLabel ? (
                <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
                  {resolvedStepLabel}
                </p>
              ) : null}

              {generatedWallpaperUrl ? (
                <div className="min-w-0 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#eef8ff_0%,#d7edf9_100%)] p-3 sm:p-4">
                  <div className="mx-auto w-full min-w-0 max-w-full rounded-[1.8rem] bg-slate-950 p-2 shadow-[0_22px_60px_rgba(15,23,42,0.28)] sm:max-w-[380px] sm:rounded-[2.2rem]">
                    <img
                      src={generatedWallpaperUrl}
                      alt="generated wallpaper"
                      className="block w-full rounded-[1.4rem] border border-white/30"
                    />
                  </div>

                  <div className="mt-4 rounded-lg bg-white p-4">
                    <p className="font-semibold text-slate-800">
                      {t("wallpaper.resultPreviewTitle")}
                    </p>
                    <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                      {t("wallpaper.resultPreviewDescription")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  {t("wallpaper.noResult")}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onDownload}
                disabled={!generatedWallpaperUrl}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#1E6DEB] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
              >
                {t("wallpaper.downloadImage")}
              </button>
              {showStepMoveButtons ? (
                <button
                  type="button"
                  onClick={onGoStepOne}
                  className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 sm:w-auto"
                >
                  {t("wallpaper.goStep1")}
                </button>
              ) : null}
              {showStepMoveButtons ? (
                <button
                  type="button"
                  onClick={onGoStepTwo}
                  className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 sm:w-auto"
                >
                  {t("wallpaper.goStep2")}
                </button>
              ) : null}
              {showPrevButton ? (
                <button
                  type="button"
                  onClick={onPrev}
                  className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 sm:w-auto"
                >
                  {t("schedule.prev")}
                </button>
              ) : null}
            </div>
          </div>
        </WallpaperBuilder>
        {showHomeButton ? (
          <div className="flex min-w-0 flex-col gap-3 pb-6 sm:flex-row sm:justify-start">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:w-auto sm:text-base"
            >
              {t("wallpaper.home")}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default WallpaperResultScreen;
