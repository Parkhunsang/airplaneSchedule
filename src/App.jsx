import React, { useEffect, useState } from "react";
import loadingImage from "./assets/loading.jpg";
import ScheduleEntryScreen from "./components/screens/ScheduleEntryScreen";
import WallpaperSetupScreen from "./components/screens/WallpaperSetupScreen";
import WallpaperResultScreen from "./components/screens/WallpaperResultScreen";
import {
  subscribeSchedules,
  addSchedule,
  deleteSchedule,
} from "./services/scheduleService";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);

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

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="mb-10 flex h-12 w-full items-center bg-purple-300 text-white shadow-lg">
        <h1 className="text-xl font-bold sm:text-2xl">HAN BI SCHEDULE</h1>
      </header>

      <main className="flex-1 w-full">
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
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-200 ease-out"
              style={{ transform: `translateX(-${currentScreen * 100}%)` }}
            >
              <ScheduleEntryScreen
                schedules={schedules}
                onAddSchedule={handleAddSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onNext={() => setCurrentScreen(1)}
              />
              <WallpaperSetupScreen
                onPrev={() => setCurrentScreen(0)}
                onNext={() => setCurrentScreen(2)}
              />
              <WallpaperResultScreen onPrev={() => setCurrentScreen(1)} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto w-full border-t border-gray-200 bg-white px-3 py-4 text-center sm:px-4 sm:py-6">
        <p className="text-xs opacity-75 sm:text-sm">
          2026 Schedule App - For Han Bi Yun
        </p>
      </footer>
    </div>
  );
}

export default App;
