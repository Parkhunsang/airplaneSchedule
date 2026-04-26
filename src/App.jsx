import React, { useEffect } from "react";
import loadingImage from "./assets/loading.webp";
import AppScreenContent from "./app/components/AppScreenContent";
import AuthNotice from "./app/components/AuthNotice";
import FirebaseConfigNotice from "./app/components/FirebaseConfigNotice";
import { useAppWorkflowActions } from "./app/hooks/useAppWorkflowActions";
import { useAuth } from "./app/hooks/useAuth";
import { useMonthlyScheduleWorkflow } from "./app/hooks/useMonthlyScheduleWorkflow";
import { useSchedules } from "./app/hooks/useSchedules";
import { useThumbnailWorkflow } from "./app/hooks/useThumbnailWorkflow";
import { useWorkflowStore } from "./app/store/useWorkflowStore";
import { deleteSchedule } from "./features/schedule/services/scheduleService";
import { firebaseConfigError } from "./firebaseConfig";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_WORKFLOW_KEY,
  SCREEN_KEYS,
  shouldShowStepper,
} from "./app/utils/scheduleViewUtils";
import { syncDocumentSeo } from "./app/utils/seo";

const STEP_MAP = {
  [SCREEN_KEYS.ENTRY]: 1,
  [SCREEN_KEYS.SETUP]: 2,
  [SCREEN_KEYS.RESULT]: 3,
};

function App() {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading, isSigningIn, isSigningOut, handleSignIn, handleSignOut } =
    useAuth();
  const { schedules, setSchedules, loading } = useSchedules(user?.uid);
  const language = useWorkflowStore((state) => state.language);
  const currentScreen = useWorkflowStore((state) => state.currentScreen);
  const sortOption = useWorkflowStore((state) => state.sortOption);
  const setLanguage = useWorkflowStore((state) => state.setLanguage);
  const setCurrentScreen = useWorkflowStore((state) => state.setCurrentScreen);
  const setSortOption = useWorkflowStore((state) => state.setSortOption);
  const setSelectedBgColor = useWorkflowStore(
    (state) => state.setSelectedBgColor,
  );
  const resetSessionState = useWorkflowStore((state) => state.resetSessionState);

  const workflow = useMonthlyScheduleWorkflow({
    schedules,
    sortOption,
    deleteSchedule: (scheduleId) => deleteSchedule(user?.uid, scheduleId),
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
    userId: user?.uid,
    setSchedules,
    workflow,
    thumbnailCache,
    thumbnailPreviewUrl,
    resetDefaultWorkflowThumbnail,
  });

  const handleChangeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("language", language);
    }

    syncDocumentSeo(language);
  }, [language]);

  useEffect(() => {
    resetSessionState();
  }, [resetSessionState, user?.uid]);

  const isAppLoading = authLoading || (Boolean(user) && loading);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="mb-3 w-full bg-[#1565C0] text-white shadow-lg">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{t("common.appTitle")}</h1>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              {t("common.appSubtitle")}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex items-center gap-2 pt-1 text-xs sm:text-sm">
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

            {user ? (
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="rounded-full bg-white/15 px-3 py-1 text-white/90">
                  {t("auth.continueAs", {
                    email: user.email ?? t("auth.googleUser"),
                  })}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="rounded-full bg-white px-3 py-1 font-semibold text-[#1565C0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSigningOut ? t("auth.signingOut") : t("auth.signOutButton")}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-3xl px-3">
          {firebaseConfigError ? (
            <FirebaseConfigNotice />
          ) : isAppLoading ? (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 py-12">
              <img
                src={loadingImage}
                alt={t(authLoading ? "auth.loadingSession" : "common.loadingData")}
                className="h-36 w-36 rounded-xl object-cover shadow-md sm:h-44 sm:w-44"
              />
              <p className="text-lg font-semibold text-gray-700">
                {authLoading ? t("auth.loadingSession") : t("common.loadingData")}
              </p>
            </div>
          ) : !user ? (
            <AuthNotice isSigningIn={isSigningIn} onSignIn={handleSignIn} />
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
