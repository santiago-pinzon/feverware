'use client'

import { useState } from 'react'
import './StorefrontItem.css'
import dynamic from 'next/dynamic'

interface StorefrontItemProps {
    number: string
    title: string
    description: string
    price: number
    mirrored?: boolean
}

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false })

export default function StorefrontItem({
    number,
    title,
    description,
    price,
    mirrored = false,
}: StorefrontItemProps) {
    const [hoverTarget, setHoverTarget] = useState<'text' | 'model' | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [clicked, setClicked] = useState(false)

    const isCoveringText = hoverTarget === null || hoverTarget === 'model'
    const overlayTranslate = isCoveringText
        ? mirrored
            ? 'translate-x-0'
            : 'translate-x-full'
        : mirrored
            ? 'translate-x-full'
            : 'translate-x-0'

    const decrement = () => setQuantity(q => Math.max(1, q - 1))
    const increment = () => setQuantity(q => q + 1)

    const handlePurchase = () => {
        setClicked(true)
        console.log(`Purchased ${quantity} item(s) for $${(price * quantity).toFixed(2)}`)
        setTimeout(() => setClicked(false), 300)
    }

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden isolate"
            onMouseLeave={() => setHoverTarget(null)}
        >
            <div className={`flex h-full ${mirrored ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Left side (model) */}
                <div
                    className="basis-1/2 bg-zinc-900 flex items-center justify-center relative z-10"
                    onMouseEnter={() => setHoverTarget('model')}
                >
                    <ModelViewer modelPath="/models/Duck.glb" />
                </div>

                {/* Right side (text + bottom strip inside) */}
                <div
                    className="basis-1/2 bg-zinc-800 text-white p-6 pb-36 flex flex-col justify-start relative z-10"
                    onMouseEnter={() => setHoverTarget('text')}
                >
                    {/* Main content */}
                    <div className="flex-grow">
                        <h2 className="text-3xl font-bold mb-2">{title}</h2>
                        <p className="text-sm opacity-80">{description}</p>
                    </div>

                    {/* Bottom strip, full width of right side only */}
                    <div className="absolute bottom-0 left-0 w-full h-11 bg-zinc-700 grid grid-cols-2 divide-x divide-zinc-600">
                        <div className="flex items-center justify-center">
                            {/* Quantity selector */}
                            <button
                                onClick={decrement}
                                className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded-l outline-none"
                            >
                                –
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                onClick={increment}
                                className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded-r outline-none"
                            >
                                +
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handlePurchase}
                            className={
                                `w-full h-full flex items-center justify-center bg-lime-300 text-black hover:bg-lime-400 focus:outline-none transition-shadow duration-300 ease-in-out` +
                                (clicked ? ' ring-4 ring-lime-400 ring-opacity-75' : '')
                            }
                        >
                            Purchase (${(price * quantity).toFixed(2)})
                        </button>
                    </div>
                </div>
            </div>

            {/* Number-overlay SVG */}
            <div
                className={`absolute top-0 left-0 h-full w-1/2 z-20 transition-transform duration-700 ease-in-out pointer-events-none ${overlayTranslate}`}
            >
                <svg
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <mask id={`number-mask-${number}`} maskUnits="userSpaceOnUse">
                            <rect width="100%" height="100%" fill="white" />
                            <text
                                x="50%"
                                y="50%"
                                dy=".1em"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fontSize="40"
                                fontWeight="bold"
                                stroke="black"
                                strokeWidth="3"
                                fill="black"
                                fontFamily="monospace"
                            >
                                {number}
                            </text>
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="#0f0f0f"
                        mask={`url(#number-mask-${number})`}
                    />
                </svg>
            </div>
        </div>
    )
}
