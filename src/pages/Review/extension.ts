import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { mergeAttributes } from '@tiptap/react'

export const extension = [
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
]
