import { EditorContainer } from '@/components/EditorContainer'
import { Navbar } from '@/components/Navbar'
import React from 'react'

export const TwigEditor = () => {
  return (
    <div className='flex flex-col w-screen h-screen overflow-hidden'>
      <Navbar />
      <EditorContainer />
    </div>
  )
}
