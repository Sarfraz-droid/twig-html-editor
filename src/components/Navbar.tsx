import React from 'react'
import { AddFunctionDrawer } from './AddFunctionDrawer'
import { HeaderDrawer } from './HeaderDrawer'
import { ShareButton } from './ShareButton'
import { Button } from './ui/button'
import { useStore } from '@/store/store'

export const Navbar = () => {
    const { activeTab, setActiveTab } = useStore();
    return (
        <div className='flex items-center justify-between p-4 h-[10vh]'>
            <h1 className='text-2xl font-bold'>
                Twig HTML Editor
            </h1>
            <div className='flex items-center gap-2'>
                <Button
                    variant={activeTab === 'code' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('code')}
                >
                    Code
                </Button>
                <Button
                    variant={activeTab === 'serializer' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('serializer')}
                >
                    Serializer
                </Button>
            </div>
            <div className='pr-4 flex items-center gap-3'>
                <ShareButton />
                <HeaderDrawer />
                <AddFunctionDrawer />
            </div>
        </div>
    )
}
