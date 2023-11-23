import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { useState } from 'react'
import { storage } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { Input, Button, Checkbox } from '@nextui-org/react'
import { FaStar } from 'react-icons/fa'
import useMoviesReviewStore from '../../store/moviesReviewStore'
import useMoviesDetailStore from '../../store/moviesDetailStore'
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useNavigate } from 'react-router-dom'
import useMoviesCommentStore from '../../store/moviesCommentStore'
import TagsInput from '../../components/TagsInput'
import useUserStore from '../../store/userStore'

const extensions = [StarterKit, Underline, Image]

const content = '<p>Type something here!</p>'

const TextEditor = () => {
  const [image, setImage] = useState<File | string | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const moviesDetail = useMoviesDetailStore((state) => state.moviesDetail)
  const moviesReview = useMoviesReviewStore((state) => state.moviesReview)
  const setMoviesReview = useMoviesReviewStore((state) => state.setMoviesReview)
  const resetMoviesReview = useMoviesReviewStore(
    (state) => state.resetMoviesReview
  )
  const moviesCommentsForId = useMoviesCommentStore((state) => state.moviesCommentsForId)
  const moviesReviewsForId = useMoviesReviewStore((state) => state.moviesReviewsForId)
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
    extensions,
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setMoviesReview('review', html)
      console.log(html)
    },
  })

  if (!editor) {
    return null
  }

  if (!user?.userId) return

  const uploadImage = async (image: any) => {
    const imageRef = ref(storage, `/images/${image.name + uuidv4()}`)
    await uploadBytes(imageRef, image)

    const downloadURL = await getDownloadURL(imageRef)
    return downloadURL
  }

  const addImage = async () => {
    let imageURL = null
    if (image) {
      imageURL = await uploadImage(image)
    }

    if (imageURL) {
      editor.chain().focus().setImage({ src: imageURL }).run()
      setImage(null)
    }
  }

  const handleSubmitReview = async () => {
    if (formInvalid) {
      window.alert('請填寫評分！')
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
        tags: tags
      }

    try {
      const docRef = collection(db, 'REVIEWS')
      const userRef = collection(db, 'USERS')
      Promise.all([
        addDoc(docRef, reviewData),
        addDoc(collection(userRef, user.userId, 'REVIEWS'), reviewData),
      ])
      resetMoviesReview()
      window.alert('影評已送出！')
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
          rating: countRating(),
          reviews_count: moviesReviewsForId.length + 1
        },
        { merge: true }
      )
      console.log('Movie ratings updated successfully.')
    } catch (error) {
      console.error('Error updating movie ratings: ', error)
    }
  }

  const countRating = () => {
    const sumForComments = moviesCommentsForId.reduce(
      (acc, comment) => acc + comment.rating,
      0
    )
    const sumForReviews = moviesReviewsForId.reduce(
      (acc, review) => acc + review.rating,
      0
    )
    const rating =
      (sumForComments + sumForReviews + moviesReview.rating) /
      (moviesCommentsForId.length + moviesReviewsForId.length + 1)
    return rating
  }

  const formInvalid = !moviesReview.rating

  return (
    <section className="text-editor-container mx-auto my-8 max-w-4xl">
      <div className="mb-3 w-full">
        <Input
          type="text"
          label="標題"
          labelPlacement="outside-left"
          value={moviesReview.title}
          onChange={(e) => setMoviesReview('title', e.target.value)}
        />
      </div>
      <div className="rating-container mb-3 flex items-center">
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
                    ? 'orange'
                    : '#e4e5e9'
                }
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          )
        })}
      </div>
      <div className="buttons flex flex-wrap items-center gap-x-4 border-l border-r border-t border-gray-400 p-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive('bold') ? 'rounded bg-gray-200 p-1' : 'p-1'
          }
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive('italic') ? 'rounded bg-gray-200 p-1' : 'p-1'
          }
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive('underline') ? 'rounded bg-gray-200 p-1' : 'p-1'
          }
        >
          Underline
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive('heading', { level: 1 })
              ? 'rounded bg-gray-200 p-1'
              : 'p-1'
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 })
              ? 'rounded bg-gray-200 p-1'
              : 'p-1'
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive('heading', { level: 3 })
              ? 'rounded bg-gray-200 p-1'
              : 'p-1'
          }
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          OrderList
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive('blockquote') ? 'rounded bg-gray-200 p-1' : 'p-1'
          }
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          BulletList
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          redo
        </button>
        <div>
          <button onClick={addImage}>AddImage</button>
          <input
            type="file"
            accept=".jpg, .png"
            onChange={(e) => {
              const files = e.target.files || []
              setImage(files[0])
            }}
          />
        </div>
      </div>
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
            onChange={(e) => setMoviesReview('isPublic', !e.target.checked)}
          >
            不公開
          </Checkbox>
        </div>
      </div>

      <div className="submit-btn mt-5 flex justify-end">
        <Button size="lg" className="w-[200px]" onClick={handleSubmitReview}>
          送出
        </Button>
      </div>
    </section>
  )
}

export default TextEditor
