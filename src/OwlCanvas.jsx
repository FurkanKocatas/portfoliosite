import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Great horned owl (low-poly, Poly by Google, CC-BY). Static mesh — the whole owl
// turns to follow the cursor + a gentle idle. Auto-framed to its bounding sphere so
// it is always fully visible whatever the container size. Lazy-loaded.
const URL = `${import.meta.env.BASE_URL}owl.glb`
const BASE_Y = 0.5 // resting turn toward the viewer (tweak if it faces wrong)
const BASE_X = 0.03
const MARGIN = 1.12 // <1 fills more, >1 leaves breathing room

function Owl() {
  const { scene } = useGLTF(URL)
  const rot = useRef()

  // normalise: bounding sphere radius 1, centred at origin (rotation-invariant)
  useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const sph = box.getBoundingSphere(new THREE.Sphere())
    const s = 1 / (sph.radius || 1)
    scene.scale.setScalar(s)
    scene.position.set(-sph.center.x * s, -sph.center.y * s, -sph.center.z * s)
    scene.traverse((o) => { if (o.isMesh) o.material.side = THREE.FrontSide })
  }, [scene])

  useFrame((state, dt) => {
    const { camera, size, pointer, clock } = state
    // fit the unit sphere to whichever axis is tighter
    const vFOV = (camera.fov * Math.PI) / 180
    const distV = 1 / Math.tan(vFOV / 2)
    const distH = 1 / (Math.tan(vFOV / 2) * (size.width / Math.max(1, size.height)))
    camera.position.set(0, 0, Math.max(distV, distH) * MARGIN)
    camera.lookAt(0, 0, 0)

    if (rot.current) {
      const k = Math.min(1, dt * 4)
      const ty = BASE_Y + pointer.x * 0.6
      const tx = BASE_X - pointer.y * 0.26
      rot.current.rotation.y += (ty - rot.current.rotation.y) * k
      rot.current.rotation.x += (tx - rot.current.rotation.x) * k
      rot.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.03
    }
  })

  return <group ref={rot}><primitive object={scene} /></group>
}
useGLTF.preload(URL)

export default function OwlCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <hemisphereLight args={['#fdfbf3', '#33531f', 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.25} />
      <directionalLight position={[-4, 1, -3]} intensity={0.5} color="#d8e84c" />
      <Suspense fallback={null}><Owl /></Suspense>
    </Canvas>
  )
}
