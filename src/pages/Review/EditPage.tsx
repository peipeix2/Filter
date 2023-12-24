import { useEditor, EditorContent } from '@tiptap/react'
import { useState, useEffect } from 'react'
import { Input, Button, Checkbox } from '@nextui-org/react'
import { FaStar } from 'react-icons/fa'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import {
  collection,
  setDoc,
  serverTimestamp,
  getDocs,
  collectionGroup,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { useNavigate, useParams } from 'react-router-dom'
import TagsInput from '../../components/TagsInput'
import useUserStore from '../../store/userStore'
import toast from 'react-hot-toast'
import StyleBtns from './StyleBtns'
import { extension } from './extension'
import { ReviewState, MovieFromFirestoreState } from '../../utils/type'

const EditPage = () => {
  const [moviesData, setMoviesData] = useState<MovieFromFirestoreState | null>(
    null
  )
  const [review, setReview] = useState<ReviewState | null>(null)
  const [revisedReview, setRevisedReview] = useState<string>('')
  const [hover, setHover] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const { revisedMoviesReview, setRevisedMoviesReview } = useMoviesReviewStore()
  const user = useUserStore((state) => state.user)
  const navigate = useNavigate()

  const { reviewId } = useParams()

  useEffect(() => {
    getMoviesReview()
  }, [])

  useEffect(() => {
    if (review) {
      getMoviesDetail(review.movie_id)
    }
  }, [review])

  const getMoviesReview = async () => {
    const querySnapshot = await getDocs(collectionGroup(db, 'REVIEWS'))
    querySnapshot.forEach((doc) => {
      if (doc.id === reviewId) {
        setReview(doc.data() as ReviewState)
        setTags(doc.data().tags)
        setRevisedMoviesReview('title', doc.data().title)
        setRevisedMoviesReview('review', doc.data().review)
        setRevisedMoviesReview('rating', doc.data().rating || 0)
        setHover(doc.data().rating || 0)
      }
    })
  }

  const getMoviesDetail = async (movieId: number) => {
    const movieRef = doc(db, 'MOVIES', String(movieId))
    const docSnap = await getDoc(movieRef)
    if (docSnap.exists()) {
      const movieInfo = docSnap.data()
      setMoviesData(movieInfo as MovieFromFirestoreState)
    }
  }

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          'border border-gray-400 p-4 min-h-[30rem] max-h-[30rem] overflow-y-auto outline-none',
      },
      transformPastedText(text) {
        return text.toUpperCase()
      },
    },
    extensions: extension,
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setRevisedReview(html)
    },
  })

  useEffect(() => {
    editor?.commands.setContent(revisedMoviesReview.review)
  }, [editor, revisedMoviesReview.review])

  if (!editor) {
    return null
  }

  if (!user?.userId) return
  if (!reviewId) return

  const updateMovieRatings = async () => {
    if (!review) return
    if (!moviesData) return
    try {
      await setDoc(
        doc(db, 'MOVIES', `${review.movie_id}`),
        {
          rating:
            (moviesData.rating * moviesData.ratings_count -
              review.rating +
              revisedMoviesReview.rating) /
            moviesData.ratings_count,
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const handleSubmitReview = async () => {
    if (formInvalid) {
      toast.error('請填寫評分！')
      return
    }

    const reviewData = {
      ...revisedMoviesReview,
      updated_at: serverTimestamp(),
      tags: tags,
    }

    reviewData.review = revisedReview

    try {
      const userRef = collection(db, 'USERS')
      await setDoc(doc(userRef, user.userId, 'REVIEWS', reviewId), reviewData, {
        merge: true,
      }),
        toast.success('修改已送出！')
      await updateMovieRatings()
      if (review) {
        navigate(`/movies/${review.movie_id}`)
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const formInvalid = !revisedMoviesReview.rating
  if (!review) return

  return (
    <section className="text-editor-container mx-auto my-8 max-w-4xl">
      <div className="mb-5 w-full">
        <Input
          type="text"
          label="標題"
          labelPlacement="outside-left"
          value={revisedMoviesReview.title}
          onChange={(e) => setRevisedMoviesReview('title', e.target.value)}
        />
      </div>
      <div className="rating-container mb-5 flex items-center">
        <span className="mr-2 text-sm">評分</span>
        {[...Array(5)].map((_, index) => {
          const ratingValue: number = index + 1
          return (
            <label key={index}>
              <input
                className="hidden"
                type="radio"
                name="score"
                id="score"
                value={ratingValue}
                onClick={() => setRevisedMoviesReview('rating', ratingValue)}
              />
              <FaStar
                size={30}
                color={
                  ratingValue <= (hover || revisedMoviesReview.rating)
                    ? '#f46854'
                    : '#e4e5e9'
                }
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          )
        })}
      </div>
      <StyleBtns editor={editor} />
      <div>
        <EditorContent editor={editor} />
      </div>
      <div className="tags-privacy mt-5">
        <TagsInput
          tags={tags}
          setTags={setTags}
          tagsInput={tagsInput}
          setTagsInput={setTagsInput}
        />
        <div className="flex items-center justify-start px-1 py-2">
          <span className="mr-2">隱私設定</span>
          <Checkbox
            classNames={{
              label: 'text-small',
            }}
            isSelected={!review.isPublic}
            onChange={(e) =>
              setRevisedMoviesReview('isPublic', !e.target.checked)
            }
          >
            不公開
          </Checkbox>
        </div>
      </div>

      <div className="submit-btn mt-5 flex justify-end">
        <Button
          size="lg"
          className="w-[100px] bg-[#89a9a6] text-white"
          onClick={handleSubmitReview}
        >
          送出
        </Button>
      </div>
    </section>
  )
}

export default EditPage
