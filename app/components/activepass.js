import { ref, get } from 'firebase/database'
import { database } from '../firebase';

export default async function getActivePass(uid) {
  let passes = null;
  try {
    const snapshot = await get(ref(database, `users/${uid}/passes`));
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
    .filter((key) => (passes[key]["expiresOn"] > new Date().getTime()))
    .filter((key) => (passes[key]["sessions"] == undefined || Object.keys(passes[key]["sessions"]).length < passes[key]["amount"]));
  
  validPasses.sort((a, b) => passes[a]["expiresOn"] - passes[b]["expiresOn"]);
  return validPasses[0];
}