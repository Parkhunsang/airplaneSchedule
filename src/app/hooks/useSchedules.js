import { useEffect, useState } from "react";
import { subscribeSchedules } from "../../features/schedule/services/scheduleService";

export const useSchedules = (userId) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSchedules([]);
      setLoading(false);
      return () => {};
    }

    setLoading(true);
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
      userId,
      (schedulesData) => {
        setSchedules(schedulesData);
        finishLoading();
      },
      (error) => {
        console.error("Firestore subscription error:", error);
        finishLoading();
      },
    );

    return () => {
      unsubscribe();

      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, [userId]);

  return {
    schedules,
    setSchedules,
    loading,
  };
};
