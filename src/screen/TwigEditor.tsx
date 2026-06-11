import { EditorContainer } from '@/components/EditorContainer'
import { Navbar } from '@/components/Navbar'
import { Serializer } from '@/components/Serializer'
import { useStore } from '@/store/store'

export const TwigEditor = () => {
  const { activeTab } = useStore();
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#080c14] text-slate-100">
      <Navbar />
      {activeTab === 'serializer' ? <Serializer /> : <EditorContainer />}
    </div>
  )
}
