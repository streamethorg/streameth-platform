import { config } from '@config';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(config.firebaseServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to update an event(session) document by ID
export const updateEventVideoById = async (eventVideoId: string, newData) => {
  try {
    const eventRef = db.collection('eventVideos').doc(eventVideoId);

    await eventRef.update(newData);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};

// Function to write an event(session) document by ID
export const createEventVideoById = async (eventVideoId: string, newData) => {
  try {
    const eventRef = db.collection('eventVideos').doc(eventVideoId);

    await eventRef.set(newData);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};
