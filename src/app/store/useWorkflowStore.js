import { create } from "zustand";
import { DEFAULT_EVENT_TYPE_COLORS } from "../../features/wallpaper/constants/eventTypes";
import {
  DEFAULT_BG_COLOR,
  SCREEN_KEYS,
  SORT_OPTIONS,
} from "../utils/scheduleViewUtils";

export const useWorkflowStore = create((set) => ({
  language:
    typeof window !== "undefined"
      ? window.localStorage.getItem("language") || "ko"
      : "ko",
  currentScreen: SCREEN_KEYS.MONTH_LIST,
  sortOption: SORT_OPTIONS.DATE_ASC,
  selectedBgColor: DEFAULT_BG_COLOR,
  eventTypeColors: { ...DEFAULT_EVENT_TYPE_COLORS },
  generatedWallpaperUrl: "",
  thumbnailCache: {},
  activeMonthKey: null,
  activeMonthLabel: "",
  generatingMonthLabel: "",
  deletingMonthKey: "",
  newWorkflowStartedAt: null,

  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("language", language);
    }

    set({ language });
  },
  setCurrentScreen: (currentScreen) => set({ currentScreen }),
  setSortOption: (sortOption) => set({ sortOption }),
  setSelectedBgColor: (selectedBgColor) =>
    set({ selectedBgColor, generatedWallpaperUrl: "" }),
  setEventTypeColors: (updater) =>
    set((state) => {
      const nextEventTypeColors =
        typeof updater === "function"
          ? updater(state.eventTypeColors)
          : updater;

      return {
        eventTypeColors: nextEventTypeColors,
        generatedWallpaperUrl: "",
      };
    }),
  setGeneratedWallpaperUrl: (generatedWallpaperUrl) => set({ generatedWallpaperUrl }),
  setThumbnailForWorkflow: (workflowKey, thumbnailState) =>
    set((state) => ({
      thumbnailCache: {
        ...state.thumbnailCache,
        [workflowKey]: thumbnailState,
      },
      generatedWallpaperUrl: "",
    })),
  setActiveMonthKey: (activeMonthKey) => set({ activeMonthKey }),
  setActiveMonthLabel: (activeMonthLabel) => set({ activeMonthLabel }),
  setGeneratingMonthLabel: (generatingMonthLabel) => set({ generatingMonthLabel }),
  setDeletingMonthKey: (deletingMonthKey) => set({ deletingMonthKey }),
  setNewWorkflowStartedAt: (newWorkflowStartedAt) => set({ newWorkflowStartedAt }),
  resetSessionState: () =>
    set({
      currentScreen: SCREEN_KEYS.MONTH_LIST,
      sortOption: SORT_OPTIONS.DATE_ASC,
      selectedBgColor: DEFAULT_BG_COLOR,
      eventTypeColors: { ...DEFAULT_EVENT_TYPE_COLORS },
      generatedWallpaperUrl: "",
      thumbnailCache: {},
      activeMonthKey: null,
      activeMonthLabel: "",
      generatingMonthLabel: "",
      deletingMonthKey: "",
      newWorkflowStartedAt: null,
    }),
  resetWorkflowVisuals: () =>
    set({
      selectedBgColor: DEFAULT_BG_COLOR,
      eventTypeColors: { ...DEFAULT_EVENT_TYPE_COLORS },
      generatedWallpaperUrl: "",
    }),
  resetThumbnailForWorkflow: (workflowKey) =>
    set((state) => ({
      thumbnailCache: {
        ...state.thumbnailCache,
        [workflowKey]: {
          fileName: "",
          dimensions: null,
          previewUrl: "",
        },
      },
      generatedWallpaperUrl: "",
    })),
}));
