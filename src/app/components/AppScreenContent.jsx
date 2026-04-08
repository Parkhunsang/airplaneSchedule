import React from "react";
import MonthlyScheduleListScreen from "../../features/schedule/components/screens/MonthlyScheduleListScreen";
import ScheduleEntryScreen from "../../features/schedule/components/screens/ScheduleEntryScreen";
import WallpaperSetupScreen from "../../features/wallpaper/components/screens/WallpaperSetupScreen";
import WallpaperResultScreen from "../../features/wallpaper/components/screens/WallpaperResultScreen";

function AppScreenContent({
  currentScreen,
  screenKeys,
  monthOptions,
  workflowSchedules,
  sortOption,
  onSortOptionChange,
  onScreenChange,
  onAddSchedule,
  onDeleteSchedule,
  onSelectMonth,
  onDeleteMonth,
  onStartNew,
  isGenerating,
  generatingMonthLabel,
  deletingMonthKey,
  selectedBgColor,
  onBgColorChange,
  eventTypeColors,
  onEventTypeColorChange,
  thumbnailFileName,
  thumbnailDimensions,
  thumbnailPreviewUrl,
  onThumbnailSelect,
  onGenerateNext,
  onGoToMonthList,
  generatedWallpaperUrl,
  onDownload,
  activeMonthLabel,
}) {
  if (currentScreen === screenKeys.MONTH_LIST) {
    return (
      <MonthlyScheduleListScreen
        monthOptions={monthOptions}
        isGenerating={isGenerating}
        generatingLabel={generatingMonthLabel}
        deletingMonthKey={deletingMonthKey}
        onSelectMonth={onSelectMonth}
        onDeleteMonth={onDeleteMonth}
        onStartNew={onStartNew}
      />
    );
  }

  if (currentScreen === screenKeys.ENTRY) {
    return (
      <ScheduleEntryScreen
        schedules={workflowSchedules}
        sortOption={sortOption}
        onChangeSortOption={onSortOptionChange}
        onAddSchedule={onAddSchedule}
        onDeleteSchedule={onDeleteSchedule}
        onPrev={onGoToMonthList}
        onNext={() => onScreenChange(screenKeys.SETUP)}
      />
    );
  }

  if (currentScreen === screenKeys.SETUP) {
    return (
      <WallpaperSetupScreen
        selectedBgColor={selectedBgColor}
        onBgColorChange={onBgColorChange}
        eventTypeColors={eventTypeColors}
        onEventTypeColorChange={onEventTypeColorChange}
        thumbnailFileName={thumbnailFileName}
        thumbnailDimensions={thumbnailDimensions}
        thumbnailPreviewUrl={thumbnailPreviewUrl}
        onThumbnailSelect={onThumbnailSelect}
        isGenerating={isGenerating}
        onPrev={() => onScreenChange(screenKeys.ENTRY)}
        onNext={onGenerateNext}
      />
    );
  }

  if (currentScreen === screenKeys.SAVED_RESULT) {
    return (
      <WallpaperResultScreen
        generatedWallpaperUrl={generatedWallpaperUrl}
        onPrev={onGoToMonthList}
        onGoStepOne={() => onScreenChange(screenKeys.ENTRY)}
        onGoStepTwo={() => onScreenChange(screenKeys.SETUP)}
        onDownload={onDownload}
        title={activeMonthLabel || "저장된 월 스케줄 결과"}
        subtitle="저장된 월 일정으로 만든 이미지 목업입니다."
        stepLabel=""
        showPrevButton
        showHomeButton={false}
      />
    );
  }

  return (
    <WallpaperResultScreen
      generatedWallpaperUrl={generatedWallpaperUrl}
      onPrev={() => onScreenChange(screenKeys.SETUP)}
      onGoHome={onGoToMonthList}
      onGoStepOne={() => onScreenChange(screenKeys.ENTRY)}
      onGoStepTwo={() => onScreenChange(screenKeys.SETUP)}
      onDownload={onDownload}
    />
  );
}

export default AppScreenContent;
