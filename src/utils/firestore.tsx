import { db } from "../../firebase"
import { collection, query, getDocs, where, setDoc, doc } from "firebase/firestore"

const firestore = {
  async checkIfSavedToFirestore (id:unknown) {
        const moviesRef = collection(db, 'MOVIES')
        const q = query(moviesRef, where("id", "==", id))
        const querySnapshot = await getDocs(q)

        if(querySnapshot.docs.length === 0) return false
        return true
    },

    async createMoviesDoc (data:any) {
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
    }
}

export default firestore