import React, { useState, useEffect } from "react";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleTable from "./components/ScheduleTable";
import loadingImage from "./assets/loading.jpg";
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
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-6 sm:py-8 px-3 sm:px-4 shadow-lg w-full">
        <div className="max-w-6xl mx-auto w-full h-12 flex items-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold">✈️ 항공 스케줄 관리</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 py-4 sm:py-8 w-full">
        <div className="w-full h-full">
          {loading && (
            <div className="flex flex-col justify-center items-center py-12 gap-4">
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
            <div className="flex flex-col gap-[20px]">
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
          © 2026 Schedule App - 박훈상과 함께
        </p>
      </footer>
    </div>
  );
}

export default App;
