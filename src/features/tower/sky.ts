import * as THREE from "three"

/**
 * Time of day down the page: blue hour with a coral horizon at the top, deep night by the
 * contact form. Keys are page progress (0..1).
 */
const KEYS = [
  { at: 0, zenith: "#1c2656", horizon: "#f2875f", sun: "#ff8a5c", sunPower: 0.9, sunHeight: 0.04 },
  { at: 0.5, zenith: "#141c42", horizon: "#b8546d", sun: "#ff6946", sunPower: 0.55, sunHeight: 0.0 },
  { at: 1, zenith: "#090d22", horizon: "#3f3a6e", sun: "#8a6cff", sunPower: 0.3, sunHeight: -0.05 },
].map((k) => ({
  ...k,
  zenith: new THREE.Color(k.zenith),
  horizon: new THREE.Color(k.horizon),
  sun: new THREE.Color(k.sun),
}))

export type SkyState = {
  zenith: THREE.Color
  horizon: THREE.Color
  sun: THREE.Color
  sunPower: number
  sunDir: THREE.Vector3
  /** how lit the city is — windows, lamps, headlights */
  night: number
}

/** Sun just under the south-west horizon (Blender −x,−y → three −x,+z). */
const SUN_AZIMUTH = new THREE.Vector2(-0.62, 0.78).normalize()

export function skyAt(p: number, out: SkyState): SkyState {
  let i = 0
  while (i < KEYS.length - 2 && p > KEYS[i + 1]!.at) i++
  const a = KEYS[i]!
  const b = KEYS[i + 1]!
  const t = THREE.MathUtils.clamp((p - a.at) / (b.at - a.at), 0, 1)
  out.zenith.copy(a.zenith).lerp(b.zenith, t)
  out.horizon.copy(a.horizon).lerp(b.horizon, t)
  out.sun.copy(a.sun).lerp(b.sun, t)
  out.sunPower = THREE.MathUtils.lerp(a.sunPower, b.sunPower, t)
  const h = THREE.MathUtils.lerp(a.sunHeight, b.sunHeight, t)
  out.sunDir.set(SUN_AZIMUTH.x, h, SUN_AZIMUTH.y).normalize()
  out.night = THREE.MathUtils.lerp(0.65, 1, p)
  return out
}

export const newSkyState = (): SkyState => ({
  zenith: new THREE.Color(),
  horizon: new THREE.Color(),
  sun: new THREE.Color(),
  sunPower: 1,
  sunDir: new THREE.Vector3(),
  night: 0.65,
})

export const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const skyFragment = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSun;
uniform vec3 uSunDir;
varying vec3 vDir;
void main() {
  float h = clamp(vDir.y, -0.2, 1.0);
  vec3 col = mix(uHorizon, uZenith, smoothstep(-0.02, 0.45, h));
  float d = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
  col += uSun * pow(d, 10.0) * 0.4;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`
