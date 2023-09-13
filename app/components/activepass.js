import { getDatabase, ref, get, query, startAfter, orderByChild } from 'firebase/database'
import { app } from '../firebase';

export default async function getActivePass(uid) {
  const db = getDatabase(app);
  let passes = null;
  try {
    const q = query(ref(db, `passes/${uid}`), orderByChild('expiresOn'), startAfter(new Date().getTime()));
    const snapshot = await get(q);
    if (!snapshot.exists()) {
      console.warn("No passes found");
      return null;
    }
    passes = snapshot.val();
  }
  catch(error) {
    console.error(error);
    return null;
  }

  const validPasses = Object.keys(passes)
    .filter((key) => (passes[key]["private"] == false))
    .filter((key) => (passes[key]["sessions"] == undefined || Object.keys(passes[key]["sessions"]).length < passes[key]["amount"]));
  
  validPasses.sort((a, b) => passes[a]["expiresOn"] - passes[b]["expiresOn"]);
  return validPasses[0];
}