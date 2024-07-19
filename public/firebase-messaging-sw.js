importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyB49eQ4TrCod9HyTAcNJqCFido3Sb9WPHI",
    authDomain: "dictapp-21983.firebaseapp.com",
    projectId: "dictapp-21983",
    storageBucket: "dictapp-21983.appspot.com",
    messagingSenderId: "672180765503",
    appId: "1:672180765503:web:de6516c6516a13707b498a",
    measurementId: "G-RQJ0PNMW5D",
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    console.log('Received background message: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationBody = {
        body: payload.notification.body,
    }

    self.registration.showNotification(notificationTitle, notificationBody);
})