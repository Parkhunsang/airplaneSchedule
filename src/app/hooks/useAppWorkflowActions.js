import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addSchedule,
  deleteSchedule,
} from "../../features/schedule/services/scheduleService";
import { generateWallpaperImage } from "../../features/wallpaper/utils/wallpaperGenerator";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { SCREEN_KEYS } from "../utils/scheduleViewUtils";

export const useAppWorkflowActions = ({
  setSchedules,
  workflow,
  thumbnailCache,
  thumbnailPreviewUrl,
  resetDefaultWorkflowThumbnail,
}) => {
  const { t } = useTranslation();
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  const selectedBgColor = useWorkflowStore((state) => state.selectedBgColor);
  const eventTypeColors = useWorkflowStore((state) => state.eventTypeColors);
  const generatedWallpaperUrl = useWorkflowStore(
    (state) => state.generatedWallpaperUrl,
  );
  const setCurrentScreen = useWorkflowStore((state) => state.setCurrentScreen);
  const setEventTypeColors = useWorkflowStore((state) => state.setEventTypeColors);
  const setGeneratedWallpaperUrl = useWorkflowStore(
    (state) => state.setGeneratedWallpaperUrl,
  );
  const resetWorkflowVisuals = useWorkflowStore((state) => state.resetWorkflowVisuals);

  const handleAddSchedule = async (newSchedule) => {
    try {
      const createdAt = new Date().toISOString();
      const createdDoc = await addSchedule({
        ...newSchedule,
        createdAt,
      });

      setSchedules((prev) => {
        if (prev.some((schedule) => schedule.id === createdDoc.id)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: createdDoc.id,
            ...newSchedule,
            createdAt,
          },
        ];
      });
    } catch (error) {
      console.error("일정 추가 오류:", error);
      alert("일정 추가에 실패했습니다. Firebase 설정을 확인해주세요.");
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
    } catch (error) {
      console.error("일정 삭제 오류:", error);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  const handleEventTypeColorChange = (eventType, nextColor) => {
    setEventTypeColors((prev) => ({
      ...prev,
      [eventType]: nextColor,
    }));
  };

  const handleGenerateWallpaper = async ({
    targetSchedules,
    referenceDate,
    imageUrl,
    requireThumbnail = false,
  }) => {
    if (requireThumbnail && !imageUrl) {
      alert("이미지를 먼저 선택해주세요.");
      return false;
    }

    setIsGeneratingWallpaper(true);

    try {
      const wallpaperUrl = await generateWallpaperImage({
        backgroundColor: selectedBgColor,
        eventTypeColors,
        thumbnailImageUrl: imageUrl ?? "",
        schedules: targetSchedules,
        referenceDate,
      });

      setGeneratedWallpaperUrl(wallpaperUrl);
      return true;
    } catch (error) {
      console.error("배경화면 생성 오류:", error);
      alert("배경화면 생성에 실패했습니다.");
      return false;
    } finally {
      setIsGeneratingWallpaper(false);
    }
  };

  const handleSetupNext = async () => {
    const referenceDate = workflow.workflowSchedules[0]?.date
      ? new Date(workflow.workflowSchedules[0].date)
      : new Date();

    const generated = await handleGenerateWallpaper({
      targetSchedules: workflow.workflowSchedules,
      referenceDate,
      imageUrl: thumbnailPreviewUrl,
      requireThumbnail: true,
    });

    if (generated) {
      setCurrentScreen(
        workflow.activeMonthKey ? SCREEN_KEYS.SAVED_RESULT : SCREEN_KEYS.RESULT,
      );
    }
  };

  const handleOpenSavedMonth = async (monthOption) => {
    workflow.setActiveMonthKey(monthOption.key);
    workflow.setActiveMonthLabel(monthOption.label);
    workflow.setGeneratingMonthLabel(monthOption.label);

    const cachedThumbnail = thumbnailCache[monthOption.key];
    const generated = await handleGenerateWallpaper({
      targetSchedules: monthOption.schedules,
      referenceDate: new Date(`${monthOption.key}-01`),
      imageUrl: cachedThumbnail?.previewUrl ?? "",
      requireThumbnail: false,
    });

    if (generated) {
      setCurrentScreen(SCREEN_KEYS.SAVED_RESULT);
    }

    workflow.setGeneratingMonthLabel("");
  };

  const handleStartNew = () => {
    workflow.setActiveMonthKey(null);
    workflow.setActiveMonthLabel("");
    workflow.setGeneratingMonthLabel("");
    workflow.setNewWorkflowStartedAt(new Date().toISOString());
    resetWorkflowVisuals();
    resetDefaultWorkflowThumbnail();
    setCurrentScreen(SCREEN_KEYS.ENTRY);
  };

  const handleDownloadWallpaper = () => {
    if (!generatedWallpaperUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = generatedWallpaperUrl;
    link.download = `schedule_wallpaper_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportSchedulesToExcel = async (schedules) => {
    if (!schedules.length) {
      alert(t("schedule.noSchedulesToExport"));
      return;
    }

    try {
      const XLSX = await import("xlsx");

      const rows = schedules.map((schedule) => ({
        날짜: schedule.date ?? "",
        근무종류: schedule.eventType ?? "",
        레이오버: schedule.isLayover ? "Y" : "N",
        출발시간: schedule.departureTime ?? "",
        도착시간: schedule.arrivalTime ?? "",
        홍콩출발날짜: schedule.hongKongDepartureDate ?? "",
        홍콩출발시간: schedule.hongKongDepartureTime ?? "",
        홍콩도착시간: schedule.hongKongArrivalTime ?? "",
        편명: schedule.aircraft ?? "",
        목적지: schedule.destination ?? "",
        생성시각: schedule.createdAt ?? "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
      XLSX.writeFile(workbook, `schedule-list-${Date.now()}.xlsx`);
    } catch (error) {
      console.error("엑셀 파일 생성 오류:", error);
      alert(t("schedule.excelExportFailed"));
    }
  };

  return {
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
  };
};
