import React, { useState, useEffect } from "react";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleTable from "./components/ScheduleTable";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function App() {
  const [schedules, setSchedules] = useState([]);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [theme]);

  // Firestore에서 실시간 스케줄 가져오기
  useEffect(() => {
    const schedulesCollection = collection(db, "schedules");

    const unsubscribe = onSnapshot(
      schedulesCollection,
      (snapshot) => {
        const schedulesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchedules(schedulesData);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore 연동 오류:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleAddSchedule = async (newSchedule) => {
    try {
      const schedulesCollection = collection(db, "schedules");
      await addDoc(schedulesCollection, {
        ...newSchedule,
        createdAt: new Date().toISOString(),
      });
      // setSchedules는 onSnapshot 리스너에서 자동으로 업데이트됨
    } catch (error) {
      console.error("스케줄 추가 오류:", error);
      alert("스케줄 추가에 실패했습니다. Firebase를 설정해주세요.");
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const scheduleDoc = doc(db, "schedules", id);
      await deleteDoc(scheduleDoc);
      // setSchedules는 onSnapshot 리스너에서 자동으로 업데이트됨
    } catch (error) {
      console.error("스케줄 삭제 오류:", error);
      alert("스케줄 삭제에 실패했습니다.");
    }
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const bgClass =
    theme === "light"
      ? "bg-gray-50 text-gray-900"
      : theme === "dark"
        ? "bg-gray-900 text-gray-50"
        : "bg-gradient-to-br from-purple-500 to-purple-700 text-white";

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-6 sm:py-8 px-3 sm:px-4 shadow-lg w-full">
        <div className="max-w-6xl mx-auto w-full h-12 flex items-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold">✈️ 항공 스케줄 관리</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-2 sm:px-4 py-4 sm:py-8 w-full">
        <div className="w-full h-full">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <p
                className={`text-lg font-semibold ${
                  theme === "light"
                    ? "text-gray-700"
                    : theme === "dark"
                      ? "text-gray-300"
                      : "text-white"
                }`}
              >
                Firebase에서 데이터를 불러오는 중...
              </p>
            </div>
          )}
          {!loading && (
            <>
              <ScheduleForm onAddSchedule={handleAddSchedule} />
              <ScheduleTable
                schedules={schedules}
                onDelete={handleDeleteSchedule}
              />
            </>
          )}

          {/* Theme Selector */}
          <div
            className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg backdrop-blur-sm ${
              theme === "light"
                ? "bg-white shadow-md"
                : theme === "dark"
                  ? "bg-gray-800 shadow-lg"
                  : "bg-white/20 shadow-lg"
            }`}
          >
            <h3
              className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                theme === "blue" ? "text-white" : ""
              }`}
            >
              테마 선택:
            </h3>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {["light", "dark", "blue"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg font-medium transition-all ${
                    theme === t
                      ? "bg-purple-600 text-white border-2 border-white shadow-lg"
                      : theme === "light"
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-white/30 text-white hover:bg-white/40"
                  }`}
                >
                  {t === "light"
                    ? "🌞 라이트"
                    : t === "dark"
                      ? "🌙 다크"
                      : "💜 블루"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`text-center py-4 sm:py-6 px-3 sm:px-4 mt-auto border-t w-full ${
          theme === "light"
            ? "bg-white border-gray-200"
            : theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white/10 border-white/20"
        }`}
      >
        <p className="text-xs sm:text-sm opacity-75">
          © 2026 Schedule App - 박훈상과 함께
        </p>
      </footer>
    </div>
  );
}

export default App;
