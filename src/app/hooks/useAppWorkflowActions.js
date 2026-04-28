import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addSchedule,
  deleteSchedule,
  updateSchedule,
} from "../../features/schedule/services/scheduleService";
import { generateWallpaperImage } from "../../features/wallpaper/utils/wallpaperGenerator";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { SCREEN_KEYS } from "../utils/scheduleViewUtils";

export const useAppWorkflowActions = ({
  userId,
  setSchedules,
  workflow,
  thumbnailCache,
  thumbnailPreviewUrl,
  resetDefaultWorkflowThumbnail,
  syncScheduleToCalendar,
  deleteScheduleFromCalendar,
  updateScheduleInCalendar,
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
      const createdDoc = await addSchedule(userId, {
        ...newSchedule,
        createdAt,
      });
      const createdSchedule = {
        id: createdDoc.id,
        ...newSchedule,
        createdAt,
      };

      setSchedules((prev) => {
        if (prev.some((schedule) => schedule.id === createdDoc.id)) {
          return prev;
        }

        return [...prev, createdSchedule];
      });

      if (syncScheduleToCalendar) {
        try {
          const createdEvent = await syncScheduleToCalendar({
            schedule: createdSchedule,
            appScheduleId: createdDoc.id,
          });

          if (createdEvent?.id) {
            await updateSchedule(userId, createdDoc.id, {
              googleCalendarEventId: createdEvent.id,
              googleCalendarSyncedAt: new Date().toISOString(),
            });
          }
        } catch (calendarError) {
          console.error("Google Calendar sync error:", calendarError);
        }
      }
    } catch (error) {
      console.error("Schedule add error:", error);
      alert(t("schedule.addFailed"));
      throw error;
    }
  };

  const handleDeleteSchedule = async (scheduleOrId) => {
    const schedule =
      typeof scheduleOrId === "object" && scheduleOrId !== null
        ? scheduleOrId
        : null;
    const scheduleId = schedule?.id ?? scheduleOrId;

    try {
      if (schedule?.googleCalendarEventId && deleteScheduleFromCalendar) {
        try {
          await deleteScheduleFromCalendar(schedule.googleCalendarEventId);
        } catch (calendarError) {
          console.error("Google Calendar delete error:", calendarError);
        }
      }

      await deleteSchedule(userId, scheduleId);
    } catch (error) {
      console.error("Schedule delete error:", error);
      alert(t("schedule.deleteFailed"));
    }
  };

  const handleUpdateSchedule = async (updatedSchedule) => {
    try {
      const { id, ...scheduleUpdates } = updatedSchedule;

      await updateSchedule(userId, id, scheduleUpdates);

      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === id
            ? {
                ...schedule,
                ...scheduleUpdates,
              }
            : schedule,
        ),
      );

      if (updatedSchedule.googleCalendarEventId && updateScheduleInCalendar) {
        try {
          await updateScheduleInCalendar({
            schedule: updatedSchedule,
            googleCalendarEventId: updatedSchedule.googleCalendarEventId,
            appScheduleId: updatedSchedule.id,
          });
        } catch (calendarError) {
          console.error("Google Calendar update error:", calendarError);
        }
      } else if (syncScheduleToCalendar) {
        try {
          const createdEvent = await syncScheduleToCalendar({
            schedule: updatedSchedule,
            appScheduleId: updatedSchedule.id,
          });

          if (createdEvent?.id) {
            await updateSchedule(userId, updatedSchedule.id, {
              googleCalendarEventId: createdEvent.id,
              googleCalendarSyncedAt: new Date().toISOString(),
            });
          }
        } catch (calendarError) {
          console.error("Google Calendar create-after-update error:", calendarError);
        }
      }
    } catch (error) {
      console.error("Schedule update error:", error);
      alert(t("schedule.addFailed"));
      throw error;
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
      alert(t("wallpaper.selectPhotoFirst"));
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
      console.error("Wallpaper generation error:", error);
      alert(t("wallpaper.generateFailed"));
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
        Date: schedule.date ?? "",
        EventType: schedule.eventType ?? "",
        Layover: schedule.isLayover ? "Y" : "N",
        DepartureTime: schedule.departureTime ?? "",
        ArrivalTime: schedule.arrivalTime ?? "",
        HongKongDepartureDate: schedule.hongKongDepartureDate ?? "",
        HongKongDepartureTime: schedule.hongKongDepartureTime ?? "",
        HongKongArrivalTime: schedule.hongKongArrivalTime ?? "",
        Airline: schedule.airline ?? "",
        FlightNumber: schedule.aircraft ?? "",
        Destination: schedule.destination ?? "",
        CreatedAt: schedule.createdAt ?? "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
      XLSX.writeFile(workbook, `schedule-list-${Date.now()}.xlsx`);
    } catch (error) {
      console.error("Excel export error:", error);
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
    handleUpdateSchedule,
    handleEventTypeColorChange,
    handleSetupNext,
    handleOpenSavedMonth,
    handleStartNew,
    handleDownloadWallpaper,
    handleExportSchedulesToExcel,
  };
};
