import { db } from '../../firebase'
import {
  collection,
  query,
  getDocs,
  where,
  setDoc,
  doc,
  addDoc,
} from 'firebase/firestore'
import { MovieFromAPIState } from './type'

const firestore = {
  async checkIfSavedToFirestore(id: unknown) {
    const moviesRef = collection(db, 'MOVIES')
    const q = query(moviesRef, where('id', '==', id))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.docs.length === 0) return false
    return true
  },

  async createMoviesDoc(data: MovieFromAPIState[]) {
    for (const item of data) {
      const isSavedToFirestore = await this.checkIfSavedToFirestore(item.id)
      if (isSavedToFirestore) {
        console.log('movie already in database.')
      } else {
        console.log('movie not exists in database yet.')
        await setDoc(doc(db, 'MOVIES', `${item.id}`), {
          id: item.id,
          title: item.title,
          original_title: item.original_title,
          overview: item.overview,
          poster_path: item.poster_path,
          release_date: item.release_date,
          rating: 0,
          ratings_count: 0,
          comments_count: 0,
          reviews_count: 0,
          wishes_count: 0,
          tag: [],
        })
      }
    }
  },

  addDocToCollection: async (
    collection1: string,
    content: object,
    document1?: string,
    collection2?: string,
    document2?: string,
    collection3?: string
  ) => {
    if (!document1 || !collection2) {
      await addDoc(collection(db, collection1), content)
    }
    if (document1 && collection2 && !document2 && !collection3) {
      await addDoc(collection(db, collection1, document1, collection2), content)
    }
    if (document1 && collection2 && document2 && collection3) {
      await addDoc(
        collection(
          db,
          collection1,
          document1,
          collection2,
          document2,
          collection3
        ),
        content
      )
    }
  },
  setDoc: async (
    collection1: string,
    document1: string,
    content: object,
    collection2?: string,
    document2?: string
  ) => {
    if (!document2 || !collection2) {
      await setDoc(doc(db, collection1, document1), content, {
        merge: true,
      })
    }
    if (document2 && collection2) {
      await setDoc(
        doc(db, collection1, document1, collection2, document2),
        content,
        { merge: true }
      )
    }
  },
}

export default firestore
