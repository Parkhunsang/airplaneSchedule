import { useMemo } from "react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import {
  getMonthKey,
  getMonthOptions,
  getSortedSchedules,
} from "../utils/scheduleViewUtils";

export const useMonthlyScheduleWorkflow = ({
  schedules,
  sortOption,
  deleteSchedule,
  screenKeys,
}) => {
  const activeMonthKey = useWorkflowStore((state) => state.activeMonthKey);
  const activeMonthLabel = useWorkflowStore((state) => state.activeMonthLabel);
  const generatingMonthLabel = useWorkflowStore(
    (state) => state.generatingMonthLabel,
  );
  const deletingMonthKey = useWorkflowStore((state) => state.deletingMonthKey);
  const newWorkflowStartedAt = useWorkflowStore(
    (state) => state.newWorkflowStartedAt,
  );
  const setActiveMonthKey = useWorkflowStore((state) => state.setActiveMonthKey);
  const setActiveMonthLabel = useWorkflowStore((state) => state.setActiveMonthLabel);
  const setGeneratingMonthLabel = useWorkflowStore(
    (state) => state.setGeneratingMonthLabel,
  );
  const setDeletingMonthKey = useWorkflowStore((state) => state.setDeletingMonthKey);
  const setNewWorkflowStartedAt = useWorkflowStore(
    (state) => state.setNewWorkflowStartedAt,
  );
  const setGeneratedWallpaperUrl = useWorkflowStore(
    (state) => state.setGeneratedWallpaperUrl,
  );
  const setCurrentScreen = useWorkflowStore((state) => state.setCurrentScreen);

  const workflowSchedules = useMemo(() => {
    const baseSchedules = activeMonthKey
      ? schedules.filter(
          (schedule) => getMonthKey(schedule.date) === activeMonthKey,
        )
      : newWorkflowStartedAt
        ? schedules.filter((schedule) => {
            if (!schedule.createdAt) {
              return false;
            }

            return schedule.createdAt >= newWorkflowStartedAt;
          })
        : [];

    return getSortedSchedules(baseSchedules, sortOption);
  }, [activeMonthKey, newWorkflowStartedAt, schedules, sortOption]);

  const monthOptions = useMemo(() => getMonthOptions(schedules), [schedules]);

  const handleDeleteMonth = async (monthOption) => {
    const shouldDelete = window.confirm(
      `${monthOption.label}의 일정 ${monthOption.schedules.length}개를 모두 삭제할까요?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingMonthKey(monthOption.key);

    try {
      await Promise.all(
        monthOption.schedules.map((schedule) => deleteSchedule(schedule.id)),
      );

      if (activeMonthKey === monthOption.key) {
        setActiveMonthKey(null);
        setActiveMonthLabel("");
        setGeneratedWallpaperUrl("");
        setCurrentScreen(screenKeys.MONTH_LIST);
      }
    } catch (error) {
      console.error("월별 스케줄 삭제 오류:", error);
      alert("월별 스케줄 삭제에 실패했습니다.");
    } finally {
      setDeletingMonthKey("");
    }
  };

  return {
    workflowSchedules,
    monthOptions,
    activeMonthKey,
    activeMonthLabel,
    generatingMonthLabel,
    deletingMonthKey,
    newWorkflowStartedAt,
    setActiveMonthKey,
    setActiveMonthLabel,
    setGeneratingMonthLabel,
    setNewWorkflowStartedAt,
    handleDeleteMonth,
  };
};
