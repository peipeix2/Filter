// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAYbo5vGylXFm0y940WHiG03r8JS7fAo0k',
    authDomain: 'filter-14ea1.firebaseapp.com',
    projectId: 'filter-14ea1',
    storageBucket: 'filter-14ea1.appspot.com',
    messagingSenderId: '355785761965',
    appId: '1:355785761965:web:e180103aca7552280d5224',
    measurementId: 'G-VDBZCCYD69',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
