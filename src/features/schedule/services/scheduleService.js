import { db, firebaseConfigError } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const getSchedulesCollection = (userId) => {
  if (!db) {
    throw new Error(firebaseConfigError);
  }

  if (!userId) {
    throw new Error("A signed-in user is required.");
  }

  return collection(db, "users", userId, "schedules");
};

export const subscribeSchedules = (userId, onData, onError) => {
  if (!userId) {
    onData([]);
    return () => {};
  }

  try {
    const schedulesCollection = getSchedulesCollection(userId);
    const orderedSchedules = query(schedulesCollection, orderBy("date", "asc"));

    return onSnapshot(
      orderedSchedules,
      (snapshot) => {
        const schedulesData = snapshot.docs.map((snapshotDoc) => ({
          id: snapshotDoc.id,
          ...snapshotDoc.data(),
        }));

        onData(schedulesData);
      },
      onError,
    );
  } catch (error) {
    onError?.(error);
    return () => {};
  }
};

export const addSchedule = async (userId, newSchedule) => {
  const schedulesCollection = getSchedulesCollection(userId);
  const createdAt = newSchedule.createdAt ?? new Date().toISOString();

  return addDoc(schedulesCollection, {
    ...newSchedule,
    createdAt,
  });
};

export const deleteSchedule = async (userId, id) => {
  if (!db) {
    throw new Error(firebaseConfigError);
  }

  if (!userId) {
    throw new Error("A signed-in user is required.");
  }

  const scheduleDoc = doc(db, "users", userId, "schedules", id);
  await deleteDoc(scheduleDoc);
};
