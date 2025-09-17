import { EditorContainer } from '@/components/EditorContainer'
import { Navbar } from '@/components/Navbar'
import { Serializer } from '@/components/Serializer'
import { useStore } from '@/store/store'
import React from 'react'

export const TwigEditor = () => {
  const { activeTab } = useStore();
  return (
    <div className='flex flex-col w-screen h-screen overflow-hidden'>
      <Navbar />
      {activeTab === 'serializer' ? <Serializer /> : <EditorContainer />}
    </div>
  )
}
