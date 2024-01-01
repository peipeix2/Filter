import { useRef } from 'react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaQuoteLeft,
  FaImage,
  FaUndoAlt,
  FaRedoAlt,
} from 'react-icons/fa'
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai'
import { storage } from '../../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const StyleBtns = ({ editor }: any) => {
  const imgRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]

      addImage(file)
    }
  }

  const uploadImage = async (image: File) => {
    const imageRef = ref(storage, `/images/${image.name + uuidv4()}`)
    await uploadBytes(imageRef, image)

    const downloadURL = await getDownloadURL(imageRef)
    return downloadURL
  }

  const addImage = async (image: File) => {
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

  return (
    <div className="buttons flex flex-wrap items-center justify-center gap-x-8 border-l border-r border-t border-gray-400 p-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'rounded bg-[#89a9a6] p-1' : 'p-1'}
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
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 })
            ? 'rounded bg-[#89a9a6] p-1'
            : 'p-1'
        }
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 })
            ? 'rounded bg-[#89a9a6] p-1'
            : 'p-1'
        }
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
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
  )
}

export default StyleBtns
