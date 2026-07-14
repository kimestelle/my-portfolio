export const BUBBLE_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = vec2(uv.x, 1.0 - uv.y);
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = viewPosition.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPosition;
}
`;

export const BUBBLE_FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D uAlbedo;
uniform vec3 uLightPosition;
uniform vec3 uViewPosition;
uniform float uWireframeMode;
uniform float uOpacity;
uniform float uTime;
uniform float uColorPhase;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

vec3 shiftingLight(float t) {
  vec3 galaxy = vec3(0.48, 0.34, 0.60);
  vec3 ember = vec3(0.94, 0.52, 0.28);
  vec3 sea = vec3(0.36, 0.70, 0.64);
  float cycle = fract(t) * 3.0;
  if (cycle < 1.0) return mix(galaxy, ember, smoothstep(0.0, 1.0, cycle));
  if (cycle < 2.0) return mix(ember, sea, smoothstep(1.0, 2.0, cycle));
  return mix(sea, galaxy, smoothstep(2.0, 3.0, cycle));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightPosition - vViewPosition);
  vec3 viewDirection = normalize(vViewPosition - uViewPosition);
  vec3 diagonalLight = -normalize(vec3(1.2, 1.0, 1.0));
  vec3 reflectedLight = reflect(-diagonalLight, normal);
  vec3 albedo = texture2D(uAlbedo, vUv).rgb;
  float luminance = dot(albedo, vec3(0.2126, 0.7152, 0.0722));
  albedo = mix(vec3(luminance), albedo, 1.35);
  albedo = (albedo - 0.5) * 1.12 + 0.5;
  albedo = clamp(albedo * 1.05, 0.0, 1.0);
  vec3 lightColor = shiftingLight(
    uColorPhase + uTime * 0.035 + vUv.x * 0.16 + vUv.y * 0.1
  );

  float specularAmount = pow(max(dot(reflectedLight, viewDirection), 0.0), 32.0);
  vec3 specular = mix(vec3(1.0), lightColor, 0.68) * specularAmount * 0.64;

  float rimAngle = dot(normal, viewDirection);
  rimAngle = pow(rimAngle, 2.0);
  vec3 neutralRim = vec3(0.7) + normal * 0.2;
  vec3 rimColor = mix(neutralRim, lightColor, 0.34) * (1.0 - rimAngle);

  vec3 finalColor = albedo + specular + rimColor + vec3(uWireframeMode);
  float alpha = clamp(rimAngle + specularAmount, 0.1, 0.97);
  gl_FragColor = vec4(finalColor, max(alpha, uOpacity));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
