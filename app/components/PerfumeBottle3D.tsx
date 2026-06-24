'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Text } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'

// Profil tourné (lathe) : silhouette ronde, épaules galbées, col fin, bouchon avec
// petit bouton-vaporisateur. Faible nombre de points -> peu de polygones.
const BOTTLE_PROFILE = [
  new THREE.Vector2(0.02, 0),
  new THREE.Vector2(0.16, 0.05),
  new THREE.Vector2(0.21, 0.15),
  new THREE.Vector2(0.21, 1.35),
  new THREE.Vector2(0.23, 1.45),
  new THREE.Vector2(0.13, 1.55),
  new THREE.Vector2(0.085, 1.62),
  new THREE.Vector2(0.085, 1.85),
  new THREE.Vector2(0.16, 1.9),
  new THREE.Vector2(0.17, 2.05),
  new THREE.Vector2(0.17, 2.1),
  new THREE.Vector2(0.1, 2.14),
  new THREE.Vector2(0.1, 2.18),
  new THREE.Vector2(0, 2.2),
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function Bottle({ glassSamples }: { glassSamples: number }) {
  const group = useRef<Group>(null)
  const reduceMotion = useReducedMotion()

  useFrame((_, delta) => {
    if (group.current && !reduceMotion) group.current.rotation.y += delta * 0.5
  })

  return (
    <group ref={group} position={[0, -1.1, 0]}>
      {/* flacon en verre holographique */}
      <mesh>
        <latheGeometry args={[BOTTLE_PROFILE, 24]} />
        <MeshTransmissionMaterial
          color="#38BDF8"
          thickness={0.4}
          roughness={0.05}
          transmission={1}
          ior={1.3}
          chromaticAberration={0.04}
          samples={glassSamples}
          resolution={256}
          background={new THREE.Color('#060B14')}
        />
      </mesh>

      {/* étiquette PARFUMLAYER gravée sur la face avant */}
      <Text
        position={[0, 0.75, 0.225]}
        fontSize={0.085}
        letterSpacing={0.12}
        color="#E6F1FF"
        anchorX="center"
        anchorY="middle"
      >
        PARFUMLAYER
      </Text>
    </group>
  )
}

export default function PerfumeBottle3D() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 6.8], fov: 24 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, isMobile ? 1 : 1.5]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} color="#38BDF8" />
      <pointLight position={[2, 2, 3]} intensity={2.2} color="#38BDF8" />
      <pointLight position={[-2, -1, 2]} intensity={1.4} color="#22D3EE" />
      <pointLight position={[0, 2, -3]} intensity={1.2} color="#0EA5E9" />
      <Bottle glassSamples={isMobile ? 2 : 4} />
    </Canvas>
  )
}
