import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* =====================================================================
   SYNAPSE — neural network with electricity travelling along the edges
   ===================================================================== */
function NeuralScene() {
  const group = useRef()
  const pulseRef = useRef()

  const { nodes, edges, edgePos } = useMemo(() => {
    const layers = [4, 6, 6, 4]
    const xs = [-2.4, -0.8, 0.8, 2.4]
    const nodes = []
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const y = ((i - (count - 1) / 2) / Math.max(1, count - 1)) * 3.0
        const z = (Math.random() - 0.5) * 0.7
        nodes.push({ pos: new THREE.Vector3(xs[li], y, z), layer: li })
      }
    })
    const edges = []
    let base = 0
    for (let li = 0; li < layers.length - 1; li++) {
      const a0 = base, b0 = base + layers[li]
      for (let a = 0; a < layers[li]; a++)
        for (let b = 0; b < layers[li + 1]; b++) edges.push([a0 + a, b0 + b])
      base += layers[li]
    }
    const edgePos = new Float32Array(edges.length * 6)
    edges.forEach((e, i) => {
      const A = nodes[e[0]].pos, B = nodes[e[1]].pos
      edgePos.set([A.x, A.y, A.z, B.x, B.y, B.z], i * 6)
    })
    return { nodes, edges, edgePos }
  }, [])

  // travelling pulses
  const PULSES = 46
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSES }, () => ({
        e: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.5 + Math.random() * 0.9,
        hot: Math.random() < 0.22,
      })),
    [edges.length]
  )
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3))
    const col = new Float32Array(PULSES * 3)
    pulses.forEach((p, i) => {
      const c = p.hot ? [1.0, 0.72, 0.5] : [0.85, 1.0, 0.88]
      col.set(c, i * 3)
    })
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [pulses])

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.18
    const arr = pulseGeo.attributes.position.array
    pulses.forEach((p, i) => {
      p.t += dt * p.speed
      if (p.t > 1) { p.t = 0; p.e = Math.floor(Math.random() * edges.length); p.speed = 0.5 + Math.random() * 0.9 }
      const e = edges[p.e]
      const A = nodes[e[0]].pos, B = nodes[e[1]].pos
      const t = p.t
      arr[i * 3] = A.x + (B.x - A.x) * t
      arr[i * 3 + 1] = A.y + (B.y - A.y) * t
      arr[i * 3 + 2] = A.z + (B.z - A.z) * t
    })
    pulseGeo.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6f9179" transparent opacity={0.28} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color="#3f6b4f" />
        </mesh>
      ))}
      <points ref={pulseRef} geometry={pulseGeo}>
        <pointsMaterial size={0.16} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  )
}

/* =====================================================================
   SIMTRADER — candlesticks breathing, price line weaving, % ticking
   ===================================================================== */
function CandlesScene() {
  const N = 13
  const refs = useRef([])
  const lineRef = useRef()
  const phases = useMemo(() => Array.from({ length: N }, (_, i) => i * 0.5), [])
  const linePts = useMemo(() => new Float32Array(N * 3), [])

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    for (let i = 0; i < N; i++) {
      const h = 0.7 + Math.abs(Math.sin(time * 0.8 + phases[i])) * 2.0
      const yc = Math.sin(time * 0.5 + phases[i] * 0.7) * 0.5
      const m = refs.current[i]
      if (m) {
        m.scale.y = h
        m.position.y = yc
        const rising = Math.cos(time * 0.8 + phases[i]) > 0
        m.material.color.set(rising ? '#3e9433' : '#c94f38')
        m.material.opacity = rising ? 1 : 0.9
      }
      linePts[i * 3] = (i - (N - 1) / 2) * 0.42
      linePts[i * 3 + 1] = yc + h * 0.5 + 0.12
      linePts[i * 3 + 2] = 0.05
    }
    if (lineRef.current) {
      lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(linePts.slice(), 3))
      lineRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={[0, -0.1, 0]}>
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[(i - (N - 1) / 2) * 0.42, 0, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshBasicMaterial color="#3e9433" transparent />
        </mesh>
      ))}
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#c94f38" />
      </line>
    </group>
  )
}

/* =====================================================================
   SOUNDSCAPES — rotating wire globe, sound rings pulsing from cities
   ===================================================================== */
function Ring({ origin }) {
  const ref = useRef()
  const t0 = useMemo(() => Math.random() * 2, [])
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime + t0) % 2) / 2
    if (ref.current) {
      const s = 0.1 + t * 1.4
      ref.current.scale.set(s, s, s)
      ref.current.material.opacity = (1 - t) * 0.9
      ref.current.lookAt(0, 0, 0)
    }
  })
  return (
    <mesh ref={ref} position={origin}>
      <ringGeometry args={[0.5, 0.58, 40]} />
      <meshBasicMaterial color="#c94f38" transparent side={THREE.DoubleSide} />
    </mesh>
  )
}
function GlobeScene() {
  const group = useRef()
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.22 })
  const cities = useMemo(() => {
    const pts = []
    const coords = [[0.5, 0.4], [-0.6, 1.1], [0.9, 2.4], [-0.3, 3.6], [0.2, 5.1]]
    coords.forEach(([lat, lon], i) => {
      const r = 1.85
      const x = r * Math.cos(lat) * Math.cos(lon)
      const y = r * Math.sin(lat)
      const z = r * Math.cos(lat) * Math.sin(lon)
      pts.push({ pos: new THREE.Vector3(x, y, z), hot: i === 0 })
    })
    return pts
  }, [])
  return (
    <group ref={group} rotation={[0.3, 0, 0.1]}>
      <mesh>
        <sphereGeometry args={[1.8, 26, 20]} />
        <meshBasicMaterial color="#4f817b" wireframe transparent opacity={0.55} />
      </mesh>
      {cities.map((c, i) => (
        <group key={i}>
          <mesh position={c.pos}>
            <sphereGeometry args={[c.hot ? 0.11 : 0.07, 16, 16]} />
            <meshBasicMaterial color={c.hot ? '#c94f38' : '#3f6b67'} />
          </mesh>
          {c.hot && <Ring origin={c.pos} />}
        </group>
      ))}
    </group>
  )
}

/* =====================================================================
   LUMINAFT — planet with orbiting satellites + drifting starfield
   ===================================================================== */
function OrbitScene() {
  const g = useRef()
  const stars = useMemo(() => {
    const a = new Float32Array(220 * 3)
    for (let i = 0; i < 220; i++) {
      a[i * 3] = (Math.random() - 0.5) * 10
      a[i * 3 + 1] = (Math.random() - 0.5) * 7
      a[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    return a
  }, [])
  const orbits = useMemo(() => [
    { r: 2.4, tilt: -0.4, speed: 0.6, size: 0.14 },
    { r: 3.2, tilt: 0.5, speed: -0.4, size: 0.1 },
    { r: 1.7, tilt: 0.2, speed: 0.9, size: 0.09 },
  ], [])
  const sat = useRef([])
  const starRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (g.current) g.current.rotation.y += 0.002
    orbits.forEach((o, i) => {
      const m = sat.current[i]
      if (m) {
        const a = t * o.speed
        m.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r * Math.sin(o.tilt), Math.sin(a) * o.r * Math.cos(o.tilt))
      }
    })
    if (starRef.current) starRef.current.rotation.z += 0.0004
  })
  return (
    <group ref={g}>
      <points ref={starRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#f6dcd4" transparent opacity={0.8} sizeAttenuation />
      </points>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#e08a76" wireframe transparent opacity={0.6} />
      </mesh>
      {orbits.map((o, i) => (
        <mesh key={i} ref={(el) => (sat.current[i] = el)}>
          <sphereGeometry args={[o.size, 16, 16]} />
          <meshBasicMaterial color="#f6dcd4" />
        </mesh>
      ))}
      {orbits.map((o, i) => (
        <mesh key={`o${i}`} rotation={[Math.PI / 2 + o.tilt, 0, 0]}>
          <torusGeometry args={[o.r, 0.006, 8, 80]} />
          <meshBasicMaterial color="#f6dcd4" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

/* =====================================================================
   WALLPAPP — drifting parallax layers behind a ticking clock ring
   ===================================================================== */
function DriftScene() {
  const layers = useRef([])
  const hand = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    layers.current.forEach((m, i) => {
      if (m) m.position.x = Math.sin(t * (0.1 + i * 0.05)) * (0.4 + i * 0.25)
    })
    if (hand.current) hand.current.rotation.z = -t * 0.6
  })
  const cols = ['#8fb2cc', '#b9d2e2', '#dcebf4']
  return (
    <group>
      {cols.map((c, i) => (
        <mesh key={i} ref={(el) => (layers.current[i] = el)} position={[0, -1.2 + i * 0.2, -i * 0.5]}>
          <planeGeometry args={[8, 2.4, 1, 1]} />
          <meshBasicMaterial color={c} transparent opacity={0.5 - i * 0.1} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0.5]}>
        <ringGeometry args={[0.85, 0.92, 48]} />
        <meshBasicMaterial color="#e6f0f8" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={hand} position={[0, 0.5, 0.55]}>
        <boxGeometry args={[0.04, 0.6, 0.02]} />
        <meshBasicMaterial color="#e6f0f8" />
      </mesh>
    </group>
  )
}

/* =====================================================================
   DAIRYMIND — a wireframe "twin" forming from a rotating point cloud
   ===================================================================== */
function TwinScene() {
  const g = useRef()
  const scan = useRef()
  const cloud = useMemo(() => {
    const n = 500
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      // points on a torus-knot-ish blob → reads as a scanned 3D form
      const u = Math.random() * Math.PI * 2
      const v = Math.random() * Math.PI * 2
      const R = 1.5, r = 0.55
      a[i * 3] = (R + r * Math.cos(v)) * Math.cos(u)
      a[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u) * 0.7
      a[i * 3 + 2] = r * Math.sin(v)
    }
    return a
  }, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (g.current) { g.current.rotation.y += 0.004; g.current.rotation.x = Math.sin(t * 0.3) * 0.2 }
    if (scan.current) scan.current.position.y = Math.sin(t * 0.9) * 1.4
  })
  return (
    <group ref={g} rotation={[0.4, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cloud, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#6b551f" transparent opacity={0.85} sizeAttenuation />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial color="#7a6428" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 2.1, 40]} />
        <meshBasicMaterial color="#c94f38" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const SCENES = {
  huna: NeuralScene,
  simtrader: CandlesScene,
  soundscapes: GlobeScene,
  luminaft: OrbitScene,
  wallpapp: DriftScene,
  dairymind: TwinScene,
}

export default function ProjectScene({ id }) {
  const Scene = SCENES[id]
  if (!Scene) return null
  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 46 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Scene />
    </Canvas>
  )
}
