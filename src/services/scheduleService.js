import { db } from "../firebaseConfig";
import {
  collection,
  query,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export const subscribeSchedules = (onData, onError) => {
  const schedulesCollection = collection(db, "schedules");
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
};

export const addSchedule = async (newSchedule) => {
  const schedulesCollection = collection(db, "schedules");

  return addDoc(schedulesCollection, {
    ...newSchedule,
    createdAt: new Date().toISOString(),
  });
};

export const deleteSchedule = async (id) => {
  const scheduleDoc = doc(db, "schedules", id);
  await deleteDoc(scheduleDoc);
};
