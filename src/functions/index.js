//Firebase cloud functions index

import functions from "firebase-functions";
import admin from "firebase-admin";

export const FCM_TOKEN_COLLECTION = "fcmTokens";
export const FCM_TOKEN_KEY = "fcmToken";

export const sendNotification = functions.https.onCall(async (data, context) => {
    const { uid, message } = data;
  
    try {
      const documentSnapshot = await admin.firestore().collection(FCM_TOKEN_COLLECTION).doc(uid).get();
      const token = documentSnapshot.data()[FCM_TOKEN_KEY];
  
      const payload = {
        token,
        notification: {
          title: 'Nudge successful',
          body: message,
        }
      };
  
      const response = await admin.messaging().send(payload);
      functions.logger.log('Successfully sent message:', response);
      return { success: true, response };
    } catch (error) {
      functions.logger.log('Error:', error);
      return { success: false, error: error.message };
    }
  });