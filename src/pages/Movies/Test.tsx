import { Image } from '@nextui-org/react'

const Test = () => {
  return (
    <div className="flex flex-col bg-red-200" id="generated-card">
      <div className="font-bold text-[#222222]">
        <span>恍若賢妻</span>
        <span>Wifelike</span>
      </div>
      <div className="w-full">
        <Image src="https://image.tmdb.org/t/p/w500/tea2gDZPxw0wfKC2S2VRWHagtt4.jpg" />
      </div>
    </div>
  )
}

export default Test
