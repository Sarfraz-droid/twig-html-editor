import React from 'react'
import { AddFunctionDrawer } from './AddFunctionDrawer'
// import { HeaderDrawer } from './HeaderDrawer'

export const Navbar = () => {
    return (
        <div className='flex items-center justify-between p-4 h-[10vh]'>
            <h1 className='text-2xl font-bold'>
                Twig HTML Editor
            </h1>
            <div className='pr-4 flex items-center gap-3'>
                {/* <HeaderDrawer /> */}
                <AddFunctionDrawer />
            </div>
        </div>
    )
}
