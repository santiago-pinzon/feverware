'use client'

import { useState } from 'react'
import './StorefrontItem.css'

interface StorefrontItemProps {
    number: string
    title: string
    description: string
    mirrored?: boolean
}

export default function StorefrontItem({ number, title, description, mirrored = false }: StorefrontItemProps) {
    const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null)

    const isCoveringText = hoverSide === null || hoverSide === (mirrored ? 'left' : 'right')
    const overlayTranslate = isCoveringText ? 'translate-x-full' : 'translate-x-0'

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden isolate"
            onMouseLeave={() => setHoverSide(null)}
        >
            <div className={`flex h-full ${mirrored ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                    className="basis-1/2 bg-zinc-900 flex items-center justify-center relative z-10"
                    onMouseEnter={() => setHoverSide('left')}
                >
                    <div className="text-white text-lg">[3D MODEL]</div>
                </div>
                <div
                    className="basis-1/2 bg-zinc-800 text-white p-6 flex flex-col justify-center relative z-10"
                    onMouseEnter={() => setHoverSide('right')}
                >
                    <h2 className="text-3xl font-bold mb-2">{title}</h2>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
            </div>

            <div
                className={`absolute top-0 left-0 h-full w-1/2 z-20 transition-transform duration-700 ease-in-out pointer-events-none ${mirrored ? (overlayTranslate === 'translate-x-0' ? 'translate-x-full' : 'translate-x-0') : overlayTranslate}`}
            >
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <mask id={`number-mask-${number}`} maskUnits="userSpaceOnUse">
                            <rect width="100%" height="100%" fill="white" />
                            <text
                                x="50%"
                                y="50%"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="40"
                                fill="black"
                                fontFamily="monospace"
                            >
                                {number}
                            </text>
                        </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="#0f0f0f" mask={`url(#number-mask-${number})`} />
                </svg>
            </div>
        </div>
    )
}
