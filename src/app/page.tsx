'use client'

import { useEffect, useState } from 'react'
import FungiScreen from '@/components/FungiScreen'
import Marquee from '@/components/Marquee'
import StorefrontItem from '@/components/StorefrontItem'
import GridShader from '@/components/GridShader'

export default function HomePage() {
    const [booted, setBooted] = useState(false)
    const [showMarquees, setShowMarquees] = useState(false)

    const message = 'Born from the mind of a corrupted bio-GPU • '.repeat(20)

    useEffect(() => {
        if (booted) {
            // Delay entrance animation just after boot
            const timeout = setTimeout(() => {
                setShowMarquees(true)
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [booted])

    return (
        <>
            {!booted && <FungiScreen onComplete={() => setBooted(true)} />}

            <div className={`${booted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
                {/* Top Marquee */}
                <div
                    className={`fixed top-0 left-0 w-full z-20 transition-transform duration-700 bg-black ${showMarquees ? 'translate-y-0' : '-translate-y-12'
                        }`}
                >
                    <Marquee text={message} duration={60} />
                </div>

                {/* Bottom Marquee */}
                <div
                    className={`fixed bottom-0 left-0 w-full z-20 transition-transform duration-700 bg-black ${showMarquees ? 'translate-y-0' : 'translate-y-12'
                        }`}
                >
                    <Marquee text={message} reverse duration={60} />
                </div>

                {/* Main Section */}
                <div className="relative min-h-screen bg-black text-lime-300 font-mono flex flex-col justify-center items-center p-8 pb-0">
                    {/* Shader sits absolutely behind everything here, at z-0 */}
                    <div className="absolute inset-0 z-0">
                        <GridShader />
                    </div>

                    {/* Heading centered in the viewport (z-10 so it’s above the shader, but below marquees) */}
                    <h1 className="text-8xl font-bold text-lime-300 text-center z-10">
                        FeverWare
                    </h1>
                </div>

                {/* Storefront Section (no top padding) */}
                <div className="bg-black pt-0 pb-12">
                    <StorefrontItem
                        number="01"
                        title="Neural Spore Tank"
                        description="An AI-simulated mycelium dream growing in stabilized magnetic substrate. Tap to preview ecosystem."
                    />
                    <StorefrontItem
                        number="02"
                        title="Neural Spore Tank"
                        description="An AI-simulated mycelium dream growing in stabilized magnetic substrate. Tap to preview ecosystem."
                        mirrored
                    />
                    <StorefrontItem
                        number="03"
                        title="Neural Spore Tank"
                        description="An AI-simulated mycelium dream growing in stabilized magnetic substrate. Tap to preview ecosystem."
                    />
                </div>
            </div>
        </>
    )
}
