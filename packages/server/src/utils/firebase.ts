import { config } from '@config';
import admin, { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
  type: config.firebase.type,
  project_id: config.firebase.projectId,
  private_key_id: config.firebase.privateKey,
  private_key: config.firebase.privateKey,
  client_email: config.firebase.clientEmail,
  client_id: config.firebase.clientId,
  auth_uri: config.firebase.authUri,
  token_uri: config.firebase.tokenUri,
  auth_provider_x509_cert_url: config.firebase.authProviderCert,
  client_x509_cert_url: config.firebase.clientCert,
  universe_domain: config.firebase.domain,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
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
