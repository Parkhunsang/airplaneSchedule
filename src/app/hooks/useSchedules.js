import { useEffect, useState } from "react";
import { subscribeSchedules } from "../../features/schedule/services/scheduleService";

export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return {
    schedules,
    setSchedules,
    loading,
  };
};
