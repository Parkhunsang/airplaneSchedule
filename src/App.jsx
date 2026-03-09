import React, { useState, useEffect } from "react";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleTable from "./components/ScheduleTable";
import WallpaperBuilder from "./components/WallpaperBuilder";
import loadingImage from "./assets/loading.jpg";
import {
  subscribeSchedules,
  addSchedule,
  deleteSchedule,
} from "./services/scheduleService";
import { generateWallpaperImage } from "./utils/wallpaperGenerator";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWallpaperBuilder, setShowWallpaperBuilder] = useState(false);
  const [wallpaperStep, setWallpaperStep] = useState(1);
  const [selectedBgColor, setSelectedBgColor] = useState("#6d28d9");
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

  const handleThumbnailSelect = (file) => {
    if (!file) {
      setGeneratedWallpaperUrl("");
      setThumbnailPreviewUrl("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setThumbnailPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      setGeneratedWallpaperUrl("");
      return nextPreviewUrl;
    });
  };

  const handleBgColorChange = (nextColor) => {
    setSelectedBgColor(nextColor);
    setGeneratedWallpaperUrl("");
  };

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
      // setSchedules는 onSnapshot 리스너에서 자동 업데이트
    } catch (error) {
      console.error("스케줄 추가 오류:", error);
      alert("스케줄 추가에 실패했습니다. Firebase를 설정해주세요.");
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      // setSchedules는 onSnapshot 리스너에서 자동 업데이트
    } catch (error) {
      console.error("스케줄 삭제 오류:", error);
      alert("스케줄 삭제에 실패했습니다.");
    }
  };

  const handleGenerateWallpaper = async () => {
    if (!thumbnailPreviewUrl) {
      alert("썸네일 이미지를 먼저 선택해 주세요.");
      return;
    }

    setIsGeneratingWallpaper(true);
    try {
      const referenceDate = schedules[0]?.date
        ? new Date(schedules[0].date)
        : new Date();

      const imageUrl = await generateWallpaperImage({
        backgroundColor: selectedBgColor,
        thumbnailImageUrl: thumbnailPreviewUrl,
        schedules,
        referenceDate,
      });
      setGeneratedWallpaperUrl(imageUrl);
      setWallpaperStep(3);
    } catch (error) {
      console.error("바탕화면 생성 오류:", error);
      alert("바탕화면 생성에 실패했습니다.");
    } finally {
      setIsGeneratingWallpaper(false);
    }
  };

  const handleDownloadWallpaper = () => {
    if (!generatedWallpaperUrl) return;

    const a = document.createElement("a");
    a.href = generatedWallpaperUrl;
    a.download = `schedule_wallpaper_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleStartWallpaperBuilder = () => {
    setShowWallpaperBuilder(true);
    setWallpaperStep(1);
    setGeneratedWallpaperUrl("");
  };

  const handleResetWallpaperBuilder = () => {
    setWallpaperStep(1);
    setGeneratedWallpaperUrl("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className="bg-purple-300 text-white w-full h-12 shadow-lg flex items-center mb-10">
        <h1 className="text-xl sm:text-2xl font-bold">✈️ SCHEDULE</h1>
      </header>

      <main className="flex-1 w-full h-full">
        <div className="w-full h-full">
          {loading && (
            <div className="flex flex-col justify-center items-center py-12 gap-4 min-h-screen w-full">
              <img
                src={loadingImage}
                alt="로딩 이미지"
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-xl shadow-md"
              />
              <p className="text-lg font-semibold text-gray-700">
                Firebase에서 데이터를 불러오는 중...
              </p>
            </div>
          )}
          {!loading && (
            <div className="flex flex-col gap-[20px] px-3">
              <ScheduleForm onAddSchedule={handleAddSchedule} />
              <ScheduleTable
                schedules={schedules}
                onDelete={handleDeleteSchedule}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleStartWallpaperBuilder}
                  disabled={schedules.length === 0}
                  className="px-5 py-3 rounded-full bg-purple-500 text-white text-sm sm:text-base font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  다음으로
                </button>
              </div>
              {showWallpaperBuilder && (
                <WallpaperBuilder
                  wallpaperStep={wallpaperStep}
                  selectedBgColor={selectedBgColor}
                  onBgColorChange={handleBgColorChange}
                  onNextStep={() => setWallpaperStep(2)}
                  thumbnailPreviewUrl={thumbnailPreviewUrl}
                  onThumbnailSelect={handleThumbnailSelect}
                  onGenerate={handleGenerateWallpaper}
                  isGenerating={isGeneratingWallpaper}
                  generatedWallpaperUrl={generatedWallpaperUrl}
                  onDownload={handleDownloadWallpaper}
                  onRestart={handleResetWallpaperBuilder}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 sm:py-6 px-3 sm:px-4 mt-auto border-t w-full bg-white border-gray-200">
        <p className="text-xs sm:text-sm opacity-75">
          © 2026 Schedule App - For Han Bi Yun
        </p>
      </footer>
    </div>
  );
}

export default App;
