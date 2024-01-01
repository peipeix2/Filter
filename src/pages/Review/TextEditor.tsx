import { useEditor, EditorContent } from '@tiptap/react'
import { useState } from 'react'
import { Input, Button, Checkbox } from '@nextui-org/react'
import { FaStar } from 'react-icons/fa'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { useNavigate } from 'react-router-dom'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import TagsInput from '../../components/TagsInput'
import useUserStore from '../../store/userStore'
import toast from 'react-hot-toast'
import StyleBtns from './StyleBtns'
import { extension } from './extension'
import { countRating } from '../../utils/render'

const content = '<p>Type something here!</p>'

const TextEditor = () => {
  const [hover, setHover] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const {
    moviesReview,
    setMoviesReview,
    resetMoviesReview,
    moviesReviewsForId,
  } = useMoviesReviewStore()
  const moviesCommentsForId = useMoviesCommentStore(
    (state) => state.moviesCommentsForId
  )
  const user = useUserStore((state) => state.user)
  const navigate = useNavigate()

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
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setMoviesReview('review', html)
    },
  })

  if (!editor) {
    return null
  }

  if (!user?.userId) return

  const handleSubmitReview = async () => {
    if (formInvalid) {
      toast.error('請填寫評分！')
      return
    }

    const reviewData = {
      ...moviesReview,
      userId: user.userId,
      author: user.username,
      avatar: user.avatar,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      movie_id: moviesDetail.id,
      tags: tags,
      movie_title: moviesDetail.title,
      movie_original_title: moviesDetail.original_title,
      movie_backdrop_path: moviesDetail.backdrop_path,
      movie_poster: moviesDetail.poster_path,
      movie_release: moviesDetail.release_date,
    }

    try {
      const userRef = collection(db, 'USERS')
      addDoc(collection(userRef, user.userId, 'REVIEWS'), reviewData)

      resetMoviesReview()
      toast.success('影評已送出！')
      await updateMovieRatings()
      navigate(`/movies/${moviesDetail.id}`)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const updateMovieRatings = async () => {
    try {
      await setDoc(
        doc(db, 'MOVIES', `${moviesDetail.id}`),
        {
          ratings_count:
            moviesCommentsForId.length + moviesReviewsForId.length + 1,
          rating: countRating(
            moviesCommentsForId,
            moviesReviewsForId,
            moviesReview
          ),
          reviews_count: moviesReviewsForId.length + 1,
        },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const formInvalid = !moviesReview.rating

  return (
    <section className="text-editor-container mx-auto my-8 w-4/5 lg:max-w-4xl">
      <div className="mb-5 w-full">
        <Input
          type="text"
          label="標題"
          labelPlacement="outside-left"
          value={moviesReview.title}
          onChange={(e) => setMoviesReview('title', e.target.value)}
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
                onClick={() => setMoviesReview('rating', ratingValue)}
              />
              <FaStar
                size={30}
                color={
                  ratingValue <= (hover || moviesReview.rating)
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
          <span className="mr-2 text-sm">隱私設定</span>
          <Checkbox
            size="sm"
            classNames={{
              label: 'text-small',
            }}
            onChange={(e) => setMoviesReview('isPublic', !e.target.checked)}
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

export default TextEditor
