import {
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db, firebaseConfigError } from "../../../firebaseConfig";

export const migrateLegacySchedulesToUser = async (userId) => {
  if (!db) {
    throw new Error(firebaseConfigError);
  }

  if (!userId) {
    throw new Error("A signed-in user is required.");
  }

  const legacySnapshot = await getDocs(collection(db, "schedules"));

  if (legacySnapshot.empty) {
    return { migratedCount: 0 };
  }

  let batch = writeBatch(db);
  let operationCount = 0;

  for (const snapshotDoc of legacySnapshot.docs) {
    const targetRef = doc(db, "users", userId, "schedules", snapshotDoc.id);

    batch.set(targetRef, snapshotDoc.data(), { merge: true });
    operationCount += 1;

    if (operationCount === 450) {
      await batch.commit();
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  return { migratedCount: legacySnapshot.docs.length };
};
