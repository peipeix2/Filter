import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAYbo5vGylXFm0y940WHiG03r8JS7fAo0k',
  authDomain: 'filter-14ea1.firebaseapp.com',
  projectId: 'filter-14ea1',
  storageBucket: 'filter-14ea1.appspot.com',
  messagingSenderId: '355785761965',
  appId: '1:355785761965:web:e180103aca7552280d5224',
  measurementId: 'G-VDBZCCYD69',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const storage = getStorage(app)

export const auth = getAuth(app)
