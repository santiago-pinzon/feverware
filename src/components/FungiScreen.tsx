'use client'

import { useEffect, useRef, useState } from 'react'

const EMPTY = ' '

type Direction = [number, number]
type Cell = {
    char: string
    age: number // -1 = empty, 0 = fresh
}
type Grid = Cell[][]
type Pos = {
    r: number
    c: number
    dir: Direction
    generation: number
}

const directions: Direction[] = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
]

const asciiMap: Record<string, string> = {
    '0,1': '—', '0,-1': '—',
    '1,0': '|', '-1,0': '|',
    '1,1': '\\', '-1,-1': '\\',
    '1,-1': '/', '-1,1': '/',
}

function chooseRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function createGrid(rows: number, cols: number): Grid {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ char: EMPTY, age: -1 }))
    )
}

export default function FungiScreen({ onComplete }: { onComplete?: () => void }) {
    const measureRef = useRef<HTMLDivElement>(null)
    const [charSize, setCharSize] = useState({ width: 8, height: 16 })
    const [grid, setGrid] = useState<Grid>([])
    const [growthFront, setGrowthFront] = useState<Pos[]>([])

    // Measure monospace character size
    useEffect(() => {
        if (measureRef.current) {
            const rect = measureRef.current.getBoundingClientRect()
            setCharSize({ width: rect.width, height: rect.height })
        }
    }, [])

    // Initialize grid and seed growth
    useEffect(() => {
        if (!charSize.width || !charSize.height || typeof window === 'undefined') return

        const cols = Math.floor(window.innerWidth / charSize.width)
        const rows = Math.floor(window.innerHeight / charSize.height)
        const r = Math.floor(rows / 2)
        const c = Math.floor(cols / 2)

        const newGrid = createGrid(rows, cols)
        newGrid[r][c] = { char: '|', age: 0 }

        setGrid(newGrid)
        setGrowthFront([{ r, c, dir: [1, 0], generation: 0 }])
    }, [charSize])

    // Growth and aging
    useEffect(() => {
        if (grid.length === 0 || growthFront.length === 0) return

        const interval = setInterval(() => {
            const newGrid = grid.map((row) => row.map((cell) => {
                if (cell.age >= 0) return { ...cell, age: cell.age + 1 }
                return cell
            }))
            const newFront: Pos[] = []
            let alive = false

            for (const { r, c, dir, generation } of growthFront) {
                const isImmortal = generation < 4
                if (!isImmortal && Math.random() < 0.2) continue

                const [dr, dc] = dir
                const nextR = r + dr
                const nextC = c + dc

                if (
                    nextR < 0 || nextC < 0 ||
                    nextR >= newGrid.length || nextC >= newGrid[0].length ||
                    newGrid[nextR][nextC].char !== EMPTY
                ) continue

                const key = `${dr},${dc}`
                const char = asciiMap[key] ?? chooseRandom(['|', '/', '\\', '—'])
                newGrid[nextR][nextC] = { char, age: 0 }
                newFront.push({ r: nextR, c: nextC, dir, generation: generation + 1 })
                alive = true

                const branchAttempts = Math.floor(Math.random() * 3) + 1
                for (let i = 0; i < branchAttempts; i++) {
                    if (Math.random() < 0.6) {
                        const branchDir = chooseRandom(
                            directions.filter(([br, bc]) => br !== -dr || bc !== -dc)
                        )
                        const br = r + branchDir[0]
                        const bc = c + branchDir[1]

                        if (
                            br >= 0 && bc >= 0 &&
                            br < newGrid.length && bc < newGrid[0].length &&
                            newGrid[br][bc].char === EMPTY
                        ) {
                            const branchKey = `${branchDir[0]},${branchDir[1]}`
                            const branchChar = asciiMap[branchKey] ?? '|'
                            newGrid[br][bc] = { char: branchChar, age: 0 }
                            newFront.push({ r: br, c: bc, dir: branchDir, generation: generation + 1 })
                            alive = true
                        }
                    }
                }
            }

            setGrid(newGrid)
            setGrowthFront(newFront)

            if (!alive && onComplete) {
                setTimeout(() => onComplete(), 1000)
            }
        }, 40)

        return () => clearInterval(interval)
    }, [grid, growthFront, onComplete])

    return (
        <div className="fixed inset-0 bg-black font-mono text-xs leading-none text-green-500">
            <div
                ref={measureRef}
                className="invisible absolute top-0 left-0"
                style={{ whiteSpace: 'pre' }}
            >
                M
            </div>

            <pre className="w-screen h-screen overflow-hidden m-0 p-0 text-glow-pulse">
                {grid.map((row, r) => (
                    <div key={r}>{row.map((cell) => cell.char).join('')}</div>
                ))}
            </pre>

        </div>
    )
}
