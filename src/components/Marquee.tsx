'use client'

interface MarqueeProps {
    text: string
    reverse?: boolean
    duration?: number
}

export default function Marquee({ text, reverse = false, duration = 20 }: MarqueeProps) {
    return (
        <div className="overflow-hidden w-full border-y border-lime-300 py-2 h-10 relative">
            <div
                className={`flex w-max animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap`}
                style={{ animationDuration: `${duration}s` }}
            >
                <span className="px-4">{text}</span>
                <span className="px-4">{text}</span>
            </div>
        </div>
    )
}
