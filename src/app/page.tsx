"use client"

import { useState } from 'react'
import FungiScreen from '@/components/FungiScreen'
import Marquee from '@/components/Marquee'

export default function HomePage() {
    const [booted, setBooted] = useState(false)
    const message = 'Born from the mind of a corrupted bio-GPU • '.repeat(20)

    return (
        <>
            {!booted && <FungiScreen onComplete={() => setBooted(true)} />}
            <div className={`${booted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
                <div className="min-h-screen bg-black text-lime-300 font-mono flex flex-col justify-center items-center gap-8 p-8">
                    <Marquee text={message.repeat(10)} duration={600} />
                    <h1 className="text-4xl text-white text-center">Main Page</h1>
                    <Marquee text={message.repeat(10)} reverse duration={600} />
                </div>
            </div>
        </>
    )
}
