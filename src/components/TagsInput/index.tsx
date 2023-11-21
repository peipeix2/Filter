import { FaDeleteLeft } from 'react-icons/fa6'
import { Input } from '@nextui-org/react'

interface TagsProps {
  tags: string[]
  setTags: (value: string[]) => void
  tagsInput: string
  setTagsInput: (value: string) => void
}

const TagsInput = ({ tags, setTags, tagsInput, setTagsInput }:TagsProps) => {
  const addTags = (e: any) => {
    if (e.target.value.length !== '' && e.target.value.trim().length !== 0) {
      setTags([...tags, e.target.value])
      setTagsInput('')
    }
  }

  const removeTags = (indexToRemove: number) => {
    setTags(tags.filter((_: string, index: number) => index !== indexToRemove))
  }

  return (
    <>
      <Input
        label="標籤"
        placeholder="按Enter自訂標籤"
        variant="flat"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        onKeyUp={(e) => (e.key === 'Enter' ? addTags(e) : null)}
      />
      <div className="tag-input mt-5 flex items-center rounded px-2">
        <ul className="flex gap-1">
          {tags.map((tag, index) => {
            return (
              <li
                className="tag flex items-center rounded bg-slate-950 p-1 text-white"
                key={index}
              >
                <span className="text-sm">{tag}</span>
                <FaDeleteLeft
                  className="mx-1 text-xs"
                  onClick={() => removeTags(index)}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default TagsInput
