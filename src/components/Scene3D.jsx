import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying float vLight;
  varying float vHeight;

  // Olas suaves superpuestas => pliegues tipo seda.
  float surf(vec2 p) {
    return sin(p.x * 1.05 + uTime) * 0.6
         + sin(p.y * 0.7 - uTime * 0.8) * 0.6
         + sin((p.x + p.y) * 0.5 + uTime * 0.55) * 0.45
         + sin((p.x - p.y) * 0.9 - uTime * 0.4) * 0.25;
  }

  void main() {
    vec2 p = position.xy;
    float e = 0.04;
    float h = surf(p);

    // Normal analítica a partir de derivadas vecinas (para el sombreado).
    float hx = surf(p + vec2(e, 0.0));
    float hy = surf(p + vec2(0.0, e));
    vec3 nx = vec3(e, 0.0, hx - h);
    vec3 ny = vec3(0.0, e, hy - h);
    vec3 n = normalize(cross(nx, ny));

    vec3 lightDir = normalize(vec3(0.35, 0.55, 0.85));
    vLight = clamp(dot(n, lightDir), 0.0, 1.0);
    vHeight = h;

    vec3 pos = position;
    pos.z += h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  varying float vLight;
  varying float vHeight;

  void main() {
    float l = vLight;
    // Solo las crestas iluminadas son visibles; los valles se funden a negro.
    float a = smoothstep(0.12, 0.8, l);
    vec3 col = mix(uColor * 0.18, uColor, l);
    col += pow(l, 5.0) * 0.85;            // brillo cálido casi blanco en los picos
    col = mix(col, col * 1.05, smoothstep(-1.0, 1.0, vHeight));
    gl_FragColor = vec4(col, a);
  }
`

function Ribbon() {
  const matRef = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#F95C4B') },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.45
  })

  return (
    <mesh rotation={[-0.62, 0, 0.4]}>
      <planeGeometry args={[10, 13, 280, 280]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Ribbon />
    </Canvas>
  )
}
