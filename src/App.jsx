import React from "react";
import loadingImage from "./assets/loading.jpg";
import AppScreenContent from "./app/components/AppScreenContent";
import FirebaseConfigNotice from "./app/components/FirebaseConfigNotice";
import { useAppWorkflowActions } from "./app/hooks/useAppWorkflowActions";
import { firebaseConfigError } from "./firebaseConfig";
import { useMonthlyScheduleWorkflow } from "./app/hooks/useMonthlyScheduleWorkflow";
import { useSchedules } from "./app/hooks/useSchedules";
import { useThumbnailWorkflow } from "./app/hooks/useThumbnailWorkflow";
import { useWorkflowStore } from "./app/store/useWorkflowStore";
import { deleteSchedule } from "./features/schedule/services/scheduleService";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_WORKFLOW_KEY,
  SCREEN_KEYS,
  shouldShowStepper,
} from "./app/utils/scheduleViewUtils";

const STEP_MAP = {
  [SCREEN_KEYS.ENTRY]: 1,
  [SCREEN_KEYS.SETUP]: 2,
  [SCREEN_KEYS.RESULT]: 3,
};

function App() {
  const { t, i18n } = useTranslation();
  const { schedules, setSchedules, loading } = useSchedules();
  const language = useWorkflowStore((state) => state.language);
  const currentScreen = useWorkflowStore((state) => state.currentScreen);
  const sortOption = useWorkflowStore((state) => state.sortOption);
  const setLanguage = useWorkflowStore((state) => state.setLanguage);
  const setCurrentScreen = useWorkflowStore((state) => state.setCurrentScreen);
  const setSortOption = useWorkflowStore((state) => state.setSortOption);
  const setSelectedBgColor = useWorkflowStore(
    (state) => state.setSelectedBgColor,
  );

  const workflow = useMonthlyScheduleWorkflow({
    schedules,
    sortOption,
    deleteSchedule,
    screenKeys: SCREEN_KEYS,
  });

  const workflowKey = workflow.activeMonthKey ?? DEFAULT_WORKFLOW_KEY;

  const {
    thumbnailFileName,
    thumbnailDimensions,
    thumbnailPreviewUrl,
    thumbnailCache,
    handleThumbnailSelect,
    resetDefaultWorkflowThumbnail,
  } = useThumbnailWorkflow({
    workflowKey,
    defaultWorkflowKey: DEFAULT_WORKFLOW_KEY,
  });

  const {
    isGeneratingWallpaper,
    selectedBgColor,
    eventTypeColors,
    generatedWallpaperUrl,
    handleAddSchedule,
    handleDeleteSchedule,
    handleEventTypeColorChange,
    handleSetupNext,
    handleOpenSavedMonth,
    handleStartNew,
    handleDownloadWallpaper,
    handleExportSchedulesToExcel,
  } = useAppWorkflowActions({
    setSchedules,
    workflow,
    thumbnailCache,
    thumbnailPreviewUrl,
    resetDefaultWorkflowThumbnail,
  });

  const handleChangeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    i18n.changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="mb-3 w-full bg-[#1565C0] text-white shadow-lg">
        <div className="flex h-12 w-full max-w-3xl items-center justify-between px-3">
          <h1 className="text-xl font-bold sm:text-2xl">{t("common.appTitle")}</h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="hidden sm:inline">{t("common.language")}</span>
            <button
              type="button"
              onClick={() => handleChangeLanguage("ko")}
              className={`rounded-full px-3 py-1 font-semibold ${
                language === "ko"
                  ? "bg-white text-[#1565C0]"
                  : "bg-white/20 text-white"
              }`}
            >
              KO
            </button>
            <button
              type="button"
              onClick={() => handleChangeLanguage("en")}
              className={`rounded-full px-3 py-1 font-semibold ${
                language === "en"
                  ? "bg-white text-[#1565C0]"
                  : "bg-white/20 text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-3xl px-3">
          {firebaseConfigError ? (
            <FirebaseConfigNotice />
          ) : loading ? (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 py-12">
              <img
                src={loadingImage}
                alt={t("common.loadingData")}
                className="h-36 w-36 rounded-xl object-cover shadow-md sm:h-44 sm:w-44"
              />
              <p className="text-lg font-semibold text-gray-700">
                {t("common.loadingData")}
              </p>
            </div>
          ) : (
            <>
              {shouldShowStepper(currentScreen) ? (
                <div className="mx-auto mb-5 flex w-full max-w-3xl items-center justify-between text-sm text-gray-500">
                  <span>
                    {t("common.step")} {STEP_MAP[currentScreen]} / 3
                  </span>
                  <div className="flex items-center gap-2" aria-hidden="true">
                    {[
                      SCREEN_KEYS.ENTRY,
                      SCREEN_KEYS.SETUP,
                      SCREEN_KEYS.RESULT,
                    ].map((step) => (
                      <span
                        key={step}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          step === currentScreen
                            ? "bg-[#1565C0]"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <AppScreenContent
                currentScreen={currentScreen}
                screenKeys={SCREEN_KEYS}
                monthOptions={workflow.monthOptions}
                workflowSchedules={workflow.workflowSchedules}
                sortOption={sortOption}
                onSortOptionChange={setSortOption}
                onScreenChange={setCurrentScreen}
                onAddSchedule={handleAddSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onExportSchedules={handleExportSchedulesToExcel}
                onSelectMonth={handleOpenSavedMonth}
                onDeleteMonth={workflow.handleDeleteMonth}
                onStartNew={handleStartNew}
                isGenerating={isGeneratingWallpaper}
                generatingMonthLabel={workflow.generatingMonthLabel}
                deletingMonthKey={workflow.deletingMonthKey}
                selectedBgColor={selectedBgColor}
                onBgColorChange={setSelectedBgColor}
                eventTypeColors={eventTypeColors}
                onEventTypeColorChange={handleEventTypeColorChange}
                thumbnailFileName={thumbnailFileName}
                thumbnailDimensions={thumbnailDimensions}
                thumbnailPreviewUrl={thumbnailPreviewUrl}
                onThumbnailSelect={handleThumbnailSelect}
                onGenerateNext={handleSetupNext}
                onGoToMonthList={() => setCurrentScreen(SCREEN_KEYS.MONTH_LIST)}
                generatedWallpaperUrl={generatedWallpaperUrl}
                onDownload={handleDownloadWallpaper}
                activeMonthLabel={workflow.activeMonthLabel}
              />
            </>
          )}
        </div>
      </main>

      <footer className="mt-auto w-full border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-3xl px-3 py-4 text-center sm:py-6">
          <p className="text-xs opacity-75 sm:text-sm">
            {t("common.footer")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
