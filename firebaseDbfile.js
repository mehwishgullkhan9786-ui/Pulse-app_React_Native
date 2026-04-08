import { db, auth } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log("Registration error:", error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log("Login error:", error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("Logout error:", error.message);
  }
};
export const savePulseData = async (userId, pulseValue) => {
  try {
    await addDoc(collection(db, "pulseData"), {
      userId,
      pulse: pulseValue,
      createdAt: new Date()
    });
    console.log("Pulse data saved!");
  } catch (error) {
    console.log("Error saving data:", error.message);
  }
};


export const getPulseData = async () => {
  const querySnapshot = await getDocs(collection(db, "pulseData"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};