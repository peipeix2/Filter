import { useState } from "react"
import { Textarea, Button } from "@nextui-org/react"

interface InputState {
  submitLabel: string
}

const InputForm = (Props:InputState) => {
  const [text, setText] = useState('')

  const handlePostComment = () => {
    console.log(text)
  }

  return (
    <div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={handlePostComment}>{Props.submitLabel}</Button>
    </div>
  )
}

export default InputForm