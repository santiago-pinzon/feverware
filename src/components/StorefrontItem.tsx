'use client'

import { useState } from 'react'
import './StorefrontItem.css'
import dynamic from 'next/dynamic'

interface StorefrontItemProps {
    number: string
    title: string
    description: string
    mirrored?: boolean
}

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false })

export default function StorefrontItem({ number, title, description, mirrored = false }: StorefrontItemProps) {
    const [hoverTarget, setHoverTarget] = useState<'text' | 'model' | null>(null)

    const isCoveringText = hoverTarget === null || hoverTarget === 'model'

    const overlayTranslate = isCoveringText
        ? (mirrored ? 'translate-x-0' : 'translate-x-full') // covering text
        : (mirrored ? 'translate-x-full' : 'translate-x-0') // moved to model

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden isolate"
            onMouseLeave={() => {
                console.log('Mouse leave')
                setHoverTarget(null)
            }}
        >
            <div className={`flex h-full ${mirrored ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Left side (may be model or text depending on mirrored) */}
                <div
                    className="basis-1/2 bg-zinc-900 flex items-center justify-center relative z-10"
                    onMouseEnter={() => {
                        console.log(`Hovered visual left side (role: ${'model'})`)
                        setHoverTarget('model')
                    }}
                >
                    <ModelViewer modelPath="/models/Duck.glb" />
                </div>

                {/* Right side */}
                <div
                    className="basis-1/2 bg-zinc-800 text-white p-6 flex flex-col justify-center relative z-10"
                    onMouseEnter={() => {
                        const role = mirrored ? 'model' : 'text'
                        console.log(`Hovered visual right side (role: ${'text'})`)
                        setHoverTarget('text')
                    }}
                >
                    <h2 className="text-3xl font-bold mb-2">{title}</h2>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
            </div>

            <div
                className={`absolute top-0 left-0 h-full w-1/2 z-20 transition-transform duration-700 ease-in-out pointer-events-none ${overlayTranslate}`}
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
