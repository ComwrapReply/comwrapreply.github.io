// Firebase configuration for dynamic data storage
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Functions for SDLC data management
export const sdlcData = {
  // Get data from Firestore
  async getData() {
    try {
      const docRef = doc(db, 'sdlc', 'workflow');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  },

  // Save data to Firestore
  async saveData(data) {
    try {
      const docRef = doc(db, 'sdlc', 'workflow');
      await setDoc(docRef, {
        ...data,
        metadata: {
          ...data.metadata,
          lastAutoSave: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }
      });
      return true;
    } catch (error) {
      console.error('Error saving document:', error);
      return false;
    }
  },

  // Listen for real-time updates
  subscribeToUpdates(callback) {
    const docRef = doc(db, 'sdlc', 'workflow');
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }
};

export default app;
