import { config } from '@config';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(config.firebaseServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to update an event(session) document by ID
export const updateEventById = async (eventId: string, newData) => {
  try {
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.update(newData);

    console.log(`Event with ID ${eventId} has been updated successfully`);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};
