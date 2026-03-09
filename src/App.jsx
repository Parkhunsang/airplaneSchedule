import React, { useState, useEffect } from "react";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleTable from "./components/ScheduleTable";
import loadingImage from "./assets/loading.jpg";
import {
  subscribeSchedules,
  addSchedule,
  deleteSchedule,
} from "./services/scheduleService";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore에서 실시간 스케줄 가져오기
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
      // setSchedules는 onSnapshot 리스너에서 자동으로 업데이트됨
    } catch (error) {
      console.error("스케줄 추가 오류:", error);
      alert("스케줄 추가에 실패했습니다. Firebase를 설정해주세요.");
      throw error;
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      // setSchedules는 onSnapshot 리스너에서 자동으로 업데이트됨
    } catch (error) {
      console.error("스케줄 삭제 오류:", error);
      alert("스케줄 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-purple-300 text-white w-full h-12 shadow-lg flex items-center mb-10">
        <h1 className="text-xl sm:text-2xl font-bold">✈️ SCHEDULE</h1>
      </header>

      {/* Main Content */}
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
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 sm:py-6 px-3 sm:px-4 mt-auto border-t w-full bg-white border-gray-200">
        <p className="text-xs sm:text-sm opacity-75">
          © 2026 Schedule App - For Han Bi Yun
        </p>
      </footer>
    </div>
  );
}

export default App;
