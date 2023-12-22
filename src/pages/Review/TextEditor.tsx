import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { mergeAttributes } from '@tiptap/react'
import { useState, useRef } from 'react'
import { storage } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { Input, Button, Checkbox } from '@nextui-org/react'
import {
  FaStar,
  FaBold,
  FaItalic,
  FaUnderline,
  FaQuoteLeft,
  FaImage,
  FaUndoAlt,
  FaRedoAlt,
} from 'react-icons/fa'
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
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai'
import toast from 'react-hot-toast'

const content = '<p>Type something here!</p>'

const TextEditor = () => {
  const [hover, setHover] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState<string>('')
  const imgRef = useRef<HTMLInputElement>(null)
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
    extensions: [
      StarterKit,
      Underline,
      Image,
      Heading.configure({ levels: [1, 2, 3] })
        .extend({
          levels: [1, 2, 3],
          renderHTML({ node, HTMLAttributes }) {
            const level = this.options.levels.includes(node.attrs.level)
              ? node.attrs.level
              : this.options.levels[0]
            const classes: { [index: number]: string } = {
              1: 'text-2xl font-extrabold',
              2: 'text-xl font-extrabold',
              3: 'text-lg font-bold',
            }
            return [
              `h${level}`,
              mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `${classes[level]}`,
              }),
              0,
            ]
          },
        })
        .configure({ levels: [1, 2, 3] }),
      Blockquote.configure({
        HTMLAttributes: {
          class:
            'p-4 my-4 italic font-medium leading-relaxed text-gray-900 dark:text-white border-l-4 border-gray-300',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'p-4 list-decimal',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'p-4 list-disc',
        },
      }),
    ],
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

  const handleImageChange = (event: any) => {
    const file = event.target.files[0]

    addImage(file)
  }

  const uploadImage = async (image: any) => {
    const imageRef = ref(storage, `/images/${image.name + uuidv4()}`)
    await uploadBytes(imageRef, image)

    const downloadURL = await getDownloadURL(imageRef)
    return downloadURL
  }

  const addImage = async (image: any) => {
    let imageURL = null
    if (image) {
      imageURL = await uploadImage(image)
    }

    if (imageURL) {
      editor.chain().focus().setImage({ src: imageURL }).run()
    }
  }

  const handlePickImg = () => {
    if (imgRef.current) {
      imgRef.current.click()
    }
  }

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
          rating: countRating(),
          reviews_count: moviesReviewsForId.length + 1,
        },
        { merge: true }
      )
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
      <div className="buttons flex flex-wrap items-center justify-center gap-x-8 border-l border-r border-t border-gray-400 p-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive('bold') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'
          }
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive('italic') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'
          }
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive('underline') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'
          }
        >
          <FaUnderline />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive('heading', { level: 1 })
              ? 'rounded bg-[#89a9a6] p-1'
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
              ? 'rounded bg-[#89a9a6] p-1'
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
              ? 'rounded bg-[#89a9a6] p-1'
              : 'p-1'
          }
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive('blockquote') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'
          }
        >
          <FaQuoteLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive('orderedList') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'
          }
        >
          <AiOutlineOrderedList className="text-xl font-bold" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive('bulletList') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'
          }
        >
          <AiOutlineUnorderedList className="text-xl font-bold" />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <FaUndoAlt />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <FaRedoAlt />
        </button>
        <div>
          <button onClick={handlePickImg}>
            <FaImage className="mt-1 text-xl" />
          </button>
          <input
            className="hidden"
            type="file"
            accept=".jpg, .png"
            ref={imgRef}
            onChange={handleImageChange}
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
