import React, {Suspense, useEffect, useRef, useState} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Html, useGLTF, useProgress} from '@react-three/drei'

function Loader() {
    const {progress} = useProgress()
    return <Html center><p className={"font-sans"}>model {progress.toFixed(0)} % loaded</p></Html>
}

function MainScene() {
    const {scene, cameras} = useGLTF('/static/models/mainpage.glb') // Correctly use `useGLTF` here
    const {set} = useThree()
    const terrainRef = useRef()
    const lastFrameTime = useRef(Date.now())
    // set size based on page #
    useEffect(() => {
        if (cameras.length > 0) {
            cameras[0].fov = 30
            cameras[0].updateProjectionMatrix()
            set({camera: cameras[0]})
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
function Page1() {
    const { scene, cameras } = useGLTF('/static/models/page1.glb')
    const { set } = useThree()
    const terrainRef = useRef()
    const raindropsRef = useRef()
    const lastFrameTime = useRef(Date.now())

    useEffect(() => {
        if (cameras.length > 0) {
            cameras[0].fov = 25
            cameras[0].updateProjectionMatrix()
            set({ camera: cameras[0] })
        }
    }, [cameras, set])

    useFrame(() => {
        if (raindropsRef.current) {
            const now = Date.now()
            const deltaTime = (now - lastFrameTime.current) / 1000
            lastFrameTime.current = now
            raindropsRef.current.position.y -= 0.2 * deltaTime * 60
            if (raindropsRef.current.position.y < -2.5) {
                raindropsRef.current.position.y = 2.5
            }
        }
    })

    return (
        <primitive
            object={scene}
            ref={node => {
                if (node) {
                    terrainRef.current = node.getObjectByName('Terrain')
                    raindropsRef.current = node.getObjectByName('raindrops')
                }
            }}
            castShadow
            receiveShadow
        />
    )
}

function Page2() {
    const { scene, cameras } = useGLTF('/static/models/page2.glb')
    const { set } = useThree()
    const pin = useRef()
    useEffect(() => {
        if (cameras.length > 0) {
            cameras[0].fov = 40
            cameras[0].updateProjectionMatrix()
            set({ camera: cameras[0] })
        }
    }, [cameras, set])
    // make location pin spin
    useFrame(() => {
        if (pin.current) {
            pin.current.rotation.z += 0.01
        }
    })
    return (
        <primitive
            object={scene}
            ref={node => {
                if (node) {
                    pin.current = node.getObjectByName('location')
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
            window.history.pushState({counter}, `Page ${counter}`, `?page=${counter}`)
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

    function Runner({counter}) {
        switch (counter) {
            case 0:
                return (
                    <>
                        <div className={'absolute p-[5vh] w-[50%] h-full z-10 text-left text-[3vh]'}>
                            <h1>Battle Ground Lake State Park</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[50%] left-[50%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
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
                            <ambientLight intensity={Math.PI / 2}/>
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
                            <Suspense fallback={<Loader/>}>
                                <MainScene/>
                            </Suspense>
                        </Canvas>
                    </>
                )
            case 1:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh] leading-none'}>
                            <span className={'text-[8vh] font-bold font-sans'}>100,000 <span className={"text-[6vh]"}>Years Ago</span></span>
                            <div className={"leading-snug"}><br/></div>
                            <h1>Geography</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <p>
                                Battle Ground is a crater lake, meaning it formed by a volcanic cone, which over time
                                became filled with precipitation such as rain and snow (McDonald). It was formed around
                                100,000 years ago (Genis), and is part of the Boring Lava Field, around the
                                Portland-Vancouver border between Washington and Oregon (Ruth).
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                        <Canvas
                            style={{
                                width: '120vh',
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
                            <ambientLight intensity={Math.PI / 2}/>
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
                            <Suspense fallback={<Loader/>}>
                                <Page1/>
                            </Suspense>
                        </Canvas>
                    </>
                )
            case 2:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <h1>Origins of the Name <h1 className={"text-[3vh] pt-[20%]"}>Pt. 1</h1></h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <p><h2 className={'text-[4vh] font-bold font-sans'}>Summary</h2>
                                The name "Battle Ground" seems pretty odd for a natural park. It's named after the city
                                next to it, which never truly was a "battle ground" (Ruth). Rather, it was named after a
                                standoff between Captain William Strong and a group of Klickitat escapees...
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                        <Canvas
                            style={{
                                width: '120vh',
                                height: '80vh',
                                margin: "auto",
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 0,
                                pointerEvents: "none"
                            }}
                            shadows
                        >
                            <ambientLight intensity={Math.PI / 2}/>
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
                            <Suspense fallback={<Loader/>}>
                                <Page2/>
                            </Suspense>
                        </Canvas>
                    </>
                )
            case 3:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>1855</span>
                            <h1>Origins of the Name <h1 className={"text-[3vh] pt-[20%]"}>Pt. 2</h1></h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>The Yakima War</h2>
                            <p className={"h-[50%] overflow-y-scroll"}>
                                The lake’s name of Battle Ground is taken from the nearby town of Battle Ground, who
                                themselves got their name by interesting means. Its name goes all the way back to 1855,
                                during the Yakima War, a conflict between Americans and the Yakima plus their allies
                                (Caldbick). The conflict led to imprisonment of many American Indians to avoid the
                                chance of their revolt (Caldbick), akin to the method in which Japanese would later be
                                detained in World War II. One of these groups were the Klickitat, captured by the
                                Vancouver Barracks, an early military post in the Pacific Northwest (Caldbick).
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 4:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>1855</span>
                            <h1>Origins of the Name <h1 className={"text-[3vh] pt-[20%]"}>Pt. 3</h1></h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>The Standoff</h2>
                            <p className={"h-[50%] overflow-y-scroll"}>
                                The Klickitat, soon after attempting an escape, found themselves in a standoff near
                                modern day Battle Ground. Oddly enough, the standoff never actually resulted in a
                                “battle” as the name would make it seem (Ruth), but rather, ended short when Chief
                                Umtuch was shot by an unknown individual, resulting in a quick surrender and return to
                                the Barracks (Caldbick).
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 5:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>1916</span>
                            <h1>The Resort</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>A Resort by the Volcano</h2>
                            <p className={""}>
                                The lake was originally a privately owned resort in the 1900s, starting as a small
                                swimming area in 1916 (Genis) owned by Henry Blystone. The resort was a popular spot for
                                swimming and fishing at the time (Genis)
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 6:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>1960</span>
                            <h1>Transfer to a State Park</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>Plans of a Park</h2>
                            <p className={""}>
                                Some time around the 1960s, it was becoming evident that the state of Washington was
                                interested in converting the resort into a state park, purchasing surrounding real
                                estate (Hewitt)...
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 7:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>1968</span>
                            <h1>Transfer to a State Park</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>Private to Public</h2>
                            <p className={""}>
                                In 1968, the state of Washington officially converted the resort into a state park.
                                Although some amenities have changed, the park still allows for the rental of cabins,
                                and is currently a popular fishing spot. (Genis)
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 8:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>Now</span>
                            <h1>Geography</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>Human Intervention</h2>
                            <p className={""}>
                                Turning a crater lake into a recreational area means decisions must be made around it.
                                With no rivers connecting the lake to any other water way (Hewitt), fish aren't
                                available. The solution though, as done when it was a resort and now, is to manually
                                restock the fish
                                specifically for recreational purposes (Genis).
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            case 9:
                return (
                    <>
                        <div className={'absolute p-[10%] w-[40%] h-full z-10 text-left text-[1.5vh]'}>
                            <span className={'text-[8vh] font-bold font-sans'}>Now</span>
                            <h1>Geography</h1>
                        </div>
                        <div
                            className={'absolute p-[10%] w-[70%] left-[30%] h-full z-10 text-left text-[2.5vh] flex flex-col'}>
                            <h2 className={'text-[4vh] font-bold font-sans'}>Don't Go Too Deep!</h2>
                            <p className={""}>
                                Being crater lake also results in another interesting
                                quirk, which is its depth. The edge of the lake is relatively shallow, having that area
                                marked for swimming, while it can often get surprisingly deep, more than is usual for
                                lakes formed by other means (Genis).
                            </p>
                            <button onClick={incrementCounter}
                                    className={'m-[1vh] bg-blue-500 hover:bg-blue-700 text-white py-[0.5vh] px-4 rounded-full font-sans text-[2vh] ml-auto transition-colors'}>
                                Next
                            </button>
                        </div>
                    </>
                )
            default:

        }
    }

    var size = '80vh'
    if (counter != 0) {
        size = '120vh'
    }
    if (counter < 0) {
        setCounter(0)
    }
    return (
        <>
            {/* back button in corner, goes a page down */}
            <div className={"fixed top-[1vh] left-[1vh] text-black font-sans text-xl p-5"}>
                <button onClick={() => setCounter(counter - 1)}
                        className={"text-blue"}>← Go back a page
                </button>
            </div>
            <div className={"fixed bottom-[1vh] right-[3vh] text-black font-sans text-xl p-5"}>
                <p>Modelled and developed entirely, with blood, sweat, and tears, by <a href={"https://ineshd.com"}
                                                                                        className={"text-blue-500"}>Inesh
                    Dey</a>.</p>
            </div>
            <div
                className={`fixed mb-5 h-[80vh] bg-gray-800 relative rounded-2xl shadow-2xl overflow-clip transition-all`}
                style={{width: size}}>
                <Runner counter={counter}/>
            </div>
        </>
    )
}
