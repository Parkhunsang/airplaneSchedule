import React, { useEffect, useState } from "react";
import loadingImage from "./assets/loading.jpg";
import ScheduleEntryScreen from "./features/schedule/components/screens/ScheduleEntryScreen";
import WallpaperSetupScreen from "./features/wallpaper/components/screens/WallpaperSetupScreen";
import WallpaperResultScreen from "./features/wallpaper/components/screens/WallpaperResultScreen";
import { DEFAULT_EVENT_TYPE_COLORS } from "./features/wallpaper/constants/eventTypes";
import {
  subscribeSchedules,
  addSchedule,
  deleteSchedule,
} from "./features/schedule/services/scheduleService";
import { generateWallpaperImage } from "./features/wallpaper/utils/wallpaperGenerator";

const SORT_OPTIONS = {
  DATE_ASC: "date_asc",
  DATE_DESC: "date_desc",
  FLIGHT_DESC: "flight_desc",
  STANDBY_DESC: "standby_desc",
  TRAINING_DESC: "training_desc",
};

const compareByDateAsc = (a, b) => a.date.localeCompare(b.date);
const compareByDateDesc = (a, b) => b.date.localeCompare(a.date);

const getSortedSchedules = (schedules, sortOption) => {
  const sortedSchedules = [...schedules];

  switch (sortOption) {
    case SORT_OPTIONS.DATE_DESC:
      return sortedSchedules.sort(compareByDateDesc);
    case SORT_OPTIONS.FLIGHT_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "flight")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.STANDBY_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "standby")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.TRAINING_DESC:
      return sortedSchedules
        .filter((schedule) => schedule.eventType === "training")
        .sort(compareByDateDesc);
    case SORT_OPTIONS.DATE_ASC:
    default:
      return sortedSchedules.sort(compareByDateAsc);
  }
};

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DATE_ASC);
  const [selectedBgColor, setSelectedBgColor] = useState("#6d28d9");
  const [eventTypeColors, setEventTypeColors] = useState(
    DEFAULT_EVENT_TYPE_COLORS,
  );
  const [thumbnailFileName, setThumbnailFileName] = useState("");
  const [thumbnailDimensions, setThumbnailDimensions] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
  const [generatedWallpaperUrl, setGeneratedWallpaperUrl] = useState("");
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);

  useEffect(() => {
    const loadingStartTime = Date.now();
    let loadingTimer;

    const finishLoading = () => {
      const elapsed = Date.now() - loadingStartTime;
      const remaining = Math.max(0, 100 - elapsed);

      loadingTimer = setTimeout(() => {
        setLoading(false);
      }, remaining);
    };

    const unsubscribe = subscribeSchedules(
      (schedulesData) => {
        setSchedules(schedulesData);
        finishLoading();
      },
      (error) => {
        console.error("Firestore 연동 오류:", error);
        finishLoading();
      },
    );

    return () => {
      unsubscribe();
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
    };
  }, [thumbnailPreviewUrl]);

  const handleAddSchedule = async (newSchedule) => {
    try {
      await addSchedule(newSchedule);
    } catch (error) {
      console.error("비행편 추가 오류:", error);
      alert("비행편 추가에 실패했습니다. Firebase 설정을 확인해주세요.");
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
    } catch (error) {
      console.error("비행편 삭제 오류:", error);
      alert("비행편 삭제에 실패했습니다.");
    }
  };

  const handleBgColorChange = (nextColor) => {
    setSelectedBgColor(nextColor);
    setGeneratedWallpaperUrl("");
  };

  const handleEventTypeColorChange = (eventType, nextColor) => {
    setEventTypeColors((prev) => ({
      ...prev,
      [eventType]: nextColor,
    }));
    setGeneratedWallpaperUrl("");
  };

  const handleThumbnailSelect = (file) => {
    if (!file) {
      setGeneratedWallpaperUrl("");
      setThumbnailFileName("");
      setThumbnailDimensions(null);
      setThumbnailPreviewUrl("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setThumbnailFileName(file.name);
    const image = new Image();
    image.onload = () => {
      setThumbnailDimensions({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => {
      setThumbnailDimensions(null);
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(file);
    setThumbnailPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      setGeneratedWallpaperUrl("");
      return nextPreviewUrl;
    });
  };

  const handleGenerateWallpaper = async () => {
    if (!thumbnailPreviewUrl) {
      alert("이미지를 먼저 선택해주세요.");
      return false;
    }

    setIsGeneratingWallpaper(true);

    try {
      const referenceDate = schedules[0]?.date
        ? new Date(schedules[0].date)
        : new Date();

      const imageUrl = await generateWallpaperImage({
        backgroundColor: selectedBgColor,
        eventTypeColors,
        thumbnailImageUrl: thumbnailPreviewUrl,
        schedules,
        referenceDate,
      });

      setGeneratedWallpaperUrl(imageUrl);
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
    const generated = await handleGenerateWallpaper();
    if (generated) {
      setCurrentScreen(2);
    }
  };

  const handleDownloadWallpaper = () => {
    if (!generatedWallpaperUrl) return;

    const link = document.createElement("a");
    link.href = generatedWallpaperUrl;
    link.download = `schedule_wallpaper_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const visibleSchedules = getSortedSchedules(schedules, sortOption);

  const renderCurrentScreen = () => {
    if (currentScreen === 0) {
      return (
        <ScheduleEntryScreen
          schedules={visibleSchedules}
          sortOption={sortOption}
          onChangeSortOption={setSortOption}
          onAddSchedule={handleAddSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onNext={() => setCurrentScreen(1)}
        />
      );
    }

    if (currentScreen === 1) {
      return (
        <WallpaperSetupScreen
          selectedBgColor={selectedBgColor}
          onBgColorChange={handleBgColorChange}
          eventTypeColors={eventTypeColors}
          onEventTypeColorChange={handleEventTypeColorChange}
          thumbnailFileName={thumbnailFileName}
          thumbnailDimensions={thumbnailDimensions}
          thumbnailPreviewUrl={thumbnailPreviewUrl}
          onThumbnailSelect={handleThumbnailSelect}
          isGenerating={isGeneratingWallpaper}
          onPrev={() => setCurrentScreen(0)}
          onNext={handleSetupNext}
        />
      );
    }

    return (
      <WallpaperResultScreen
        generatedWallpaperUrl={generatedWallpaperUrl}
        onPrev={() => setCurrentScreen(1)}
        onGoHome={() => setCurrentScreen(0)}
        onDownload={handleDownloadWallpaper}
      />
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="mb-3 w-full bg-[#1565C0] text-white shadow-lg">
        <div className="flex h-12 w-full max-w-3xl items-center px-3">
          <h1 className="text-xl font-bold sm:text-2xl">HAN BI SCHEDULE</h1>
        </div>
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-3xl px-3">
          {loading ? (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 py-12">
              <img
                src={loadingImage}
                alt="로딩 이미지"
                className="h-36 w-36 rounded-xl object-cover shadow-md sm:h-44 sm:w-44"
              />
              <p className="text-lg font-semibold text-gray-700">
                Firebase에서 데이터를 불러오는 중...
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-5 flex w-full max-w-3xl items-center justify-between text-sm text-gray-500">
                <span>Step {currentScreen + 1} / 3</span>
                <div className="flex items-center gap-2" aria-hidden="true">
                  {[0, 1, 2].map((step) => (
                    <span
                      key={step}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        step === currentScreen ? "bg-[#1565C0]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {renderCurrentScreen()}
            </>
          )}
        </div>
      </main>

      <footer className="mt-auto w-full border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-3xl px-3 py-4 text-center sm:py-6">
          <p className="text-xs opacity-75 sm:text-sm">
            2026 Schedule App - For Han Bi Yun
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
