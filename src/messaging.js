import { db, messaging } from "@/firebaseConfig";
import {doc, setDoc } from "firebase/firestore";
import { getToken, onMessage} from "firebase/messaging";

const VAPID_KEY = "BPRkdEiSeGdtleI23fA5rlrI_W1wn_3O34m8BbJsKePES9UMQqSgUcGq_9bXRCOcdNXfoKjjv3_q-Xz6ZeoQnfU";
const FCM_TOKEN_COLLECTION = "fcmTokens";

export async function requestNotificationPermissions(uid) {
    console.log("Requesting notifications permissions...");
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
        await saveMessagingDeviceToken(uid);
    } else {
        console.log("Unable to get permission to notify.");
    }
}

export async function saveMessagingDeviceToken(uid) {
    const msg = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY});

    if (fcmToken) {
        console.log("Got FCM device token: ", fcmToken);
        // Save device token to Firestore
        const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
        await setDoc(tokenRef, { fcmToken }); // overwrites document if already exists

        onMessage(msg, (message) => {
            console.log(
                'New foreground notification from Firebase Messaging',
                message.notification
            );
            new Notification(message.notification.title, { body: message.notification.body });
        })
    } else {
        // Need to request permission to show notifications
        requestNotificationPermissions(uid);
    }
}