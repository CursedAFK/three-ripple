import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useCallback, useMemo, useRef } from 'react'
import { TextureLoader } from 'three'
import circleImg from '/images/circle.webp'

function Points() {
  const imgTex = useLoader(TextureLoader, circleImg)

  const bufferRef = useRef(null)

  let t = 0
  let f = 0.002
  let a = 3

  const graph = useCallback(
    function (x, z) {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a
    },
    [t, f, a]
  )

  const count = 100
  const sep = 3

  const positions = useMemo(
    function () {
      const position = []

      for (let xi = 0; xi < count; xi++) {
        for (let zi = 0; zi < count; zi++) {
          const x = sep * (xi - count / 2)
          const z = sep * (zi - count / 2)
          const y = graph(x, z)

          position.push(x, y, z)
        }
      }

      return new Float32Array(position)
    },
    [count, sep, graph]
  )

  useFrame(function (state) {
    t += 15

    const positions = bufferRef.current.array

    let i = 0

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        const x = sep * (xi - count / 2)
        const z = sep * (zi - count / 2)

        positions[i + 1] = graph(x, z)

        i += 3
      }
    }

    bufferRef.current.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry attach='geometry'>
        <bufferAttribute
          ref={bufferRef}
          attach='attributes-position'
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach='material'
        map={imgTex}
        color={0x00aaff}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  )
}

function AnimationCanvas() {
  return (
    <Canvas camera={{ position: [100, 10, 0], fov: 75 }}>
      <OrbitControls />
      <Points />
    </Canvas>
  )
}

export default function App() {
  return (
    <div className='anim'>
      <Suspense fallback={<div>Loading ...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  )
}
