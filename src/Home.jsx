import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html, useProgress } from '@react-three/drei'

function Loader() {
    const { progress } = useProgress()
    return <Html center><p className={"font-sans"}>model {progress.toFixed(0)} % loaded</p></Html>
}

function MainScene() {
    const { scene, cameras } = useGLTF('/static/models/mainpage.glb') // Correctly use `useGLTF` here
    const { set } = useThree()
    const terrainRef = useRef()
    const lastFrameTime = useRef(Date.now())
    // set size based on page #
    useEffect(() => {
        if (cameras.length > 0) {
            cameras[0].fov = 30
            cameras[0].updateProjectionMatrix()
            set({ camera: cameras[0] })
        }
    }, [cameras, set])

    useFrame(() => {
        if (terrainRef.current) {
            const now = Date.now()
            const deltaTime = (now - lastFrameTime.current) / 1000
            lastFrameTime.current = now
            terrainRef.current.rotation.y += 0.0025 * deltaTime * 60
        }
    })

    return (
        <primitive
            object={scene}
            ref={node => {
                if (node) {
                    terrainRef.current = node.getObjectByName('Terrain')
                }
            }}
            castShadow
            receiveShadow
        />
    )
}

export default function App() {
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        if (window.history.state?.counter !== counter) {
            window.history.pushState({ counter }, `Page ${counter}`, `?page=${counter}`)
        }
    }, [counter])

    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.counter !== undefined) {
                setCounter(event.state.counter)
            }
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    function incrementCounter() {
        setCounter(prevCounter => prevCounter + 1)
    }

    function Runner({ counter }) {
        switch (counter) {
            case 0:
                return (
                    <>
                        <div className={'absolute p-[5vh] w-[50%] h-full z-10 text-left text-[3vh]'}>
                            <h1>Battle Ground Lake State Park</h1>
                        </div>
                        <div className={'absolute p-[10%] w-[50%] left-[50%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <p>Learn about the rich history of Washington&apos;s most interesting park!</p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Let&apos;s Go!
                            </button>
                        </div>
                        <Canvas
                            style={{
                                width: '80vh',
                                height: '80vh',
                                margin: "auto",
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 20,
                                pointerEvents: "none"
                            }}
                            shadows
                        >
                            <ambientLight intensity={Math.PI / 2} />
                            <directionalLight
                                position={[5, 5, 5]}
                                intensity={1}
                                castShadow
                                shadow-mapSize-width={1024}
                                shadow-mapSize-height={1024}
                                shadow-camera-far={50}
                                shadow-camera-left={-10}
                                shadow-camera-right={10}
                                shadow-camera-top={10}
                                shadow-camera-bottom={-10}
                            />
                            <Suspense fallback={<Loader />}>
                                <MainScene />
                            </Suspense>
                        </Canvas>
                    </>
                )
            case 1:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <h1>Origins of the Name <h1 className={"text-[3vh] pt-[20%]"}>Pt. 1</h1> </h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <p> <h2 className={'text-[4vh] font-bold font-sans'}>Summary</h2>
                                The name "Battle Ground" seems pretty odd for a natural park. It's named after the city
                                next to it, which never truly was a "battle ground." Rather, it was named after a
                                standoff between Captain William Strong and a group of Klickitat escapees...</p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 2:
                return  (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>1885</span>
                            <h1>Origins of the Name <h1 className={"text-[3vh] pt-[20%]"}>Pt. 1</h1></h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <p> <h2 className={'text-[4vh] font-bold font-sans'}>The Yakima War</h2>
                                The Yakima war was the stage for the conflict between Strong and the Klickitat. It began when gold had been found in the region of southern Washington, encouraging miners, who often mistreated Indigenous women. Due to the pressure of the miners, Indigenous people retaliated against them.</p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            default:
                return <h1>Page {counter}</h1>
        }
    }
    var size = '80vh'
    if (counter != 0) {
        size = '120vh'
    }
    return (
        <>
            <div className={"fixed bottom-[1vh] right-[3vh] text-black font-sans text-xl p-5"}>
                <p>Modelled and developed entirely, with blood sweat and tears, by <a href={"https://ineshd.com"} className={"text-blue-500"}>Inesh Dey</a>.</p>
            </div>
            <div className={`fixed mb-5 h-[80vh] bg-gray-800 relative rounded-2xl shadow-2xl overflow-clip transition-all`} style={{width: size}}>
                <Runner counter={counter} />
            </div>
        </>
    )
}
