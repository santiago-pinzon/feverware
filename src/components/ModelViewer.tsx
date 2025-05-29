'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { Suspense } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from '@react-three/fiber'

function Model({ url }: { url: string }) {
    const gltf = useLoader(GLTFLoader, url)
    return <primitive object={gltf.scene} />
}

export default function ModelViewer({ modelPath }: { modelPath: string }) {
    return (
        <Canvas style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 5, 5]} />
            <Suspense fallback={null}>
                <Stage environment="city">
                    <Model url={modelPath} />
                </Stage>
            </Suspense>
            <OrbitControls enableZoom={false} />
        </Canvas>
    )
}
