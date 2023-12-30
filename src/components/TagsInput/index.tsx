import { TiDelete } from 'react-icons/ti'
import { Input } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { FaTag } from 'react-icons/fa6'

interface TagsProps {
  tags: string[]
  setTags: (value: string[]) => void
  tagsInput: string
  setTagsInput: (value: string) => void
}

const TagsInput = ({ tags, setTags, tagsInput, setTagsInput }: TagsProps) => {
  const addTags = (e: any) => {
    if (e.target.value !== '' && e.target.value.trim().length !== 0) {
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
        classNames={{
          label: 'text-sm lg:text-base',
          input: ['placeholder: text-xs lg:text-base'],
        }}
        variant="flat"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        onKeyUp={(e) => (e.key === 'Enter' ? addTags(e) : null)}
      />
      <div className="tag-input mt-5 flex items-center rounded px-2">
        <ul className="flex gap-1">
          {tags.map((tag, index) => {
            return (
              <Chip
                className="flex items-center bg-[#94a3ab] p-1 text-xs text-slate-100"
                key={index}
                size="sm"
                startContent={
                  <FaTag size={12} color="#f2f5f9" className="mx-1" />
                }
                endContent={
                  <TiDelete
                    className="mx-1 text-base"
                    color="#222222"
                    onClick={() => removeTags(index)}
                  />
                }
              >
                {tag}
              </Chip>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default TagsInput
