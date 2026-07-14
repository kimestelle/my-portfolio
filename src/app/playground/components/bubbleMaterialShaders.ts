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

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightPosition - vViewPosition);
  vec3 viewDirection = normalize(vViewPosition - uViewPosition);
  vec3 diagonalLight = -normalize(vec3(1.2, 1.0, 1.0));
  vec3 reflectedLight = reflect(-diagonalLight, normal);
  vec3 albedo = texture2D(uAlbedo, vUv).rgb;

  float specularAmount = pow(max(dot(reflectedLight, viewDirection), 0.0), 32.0);
  vec3 specular = vec3(1.0) * specularAmount * 0.6;

  float rimAngle = dot(normal, viewDirection);
  rimAngle = pow(rimAngle, 2.0);
  vec3 rimColor = (vec3(0.7) + normal * 0.2) * (1.0 - rimAngle);

  vec3 finalColor = albedo + specular + rimColor + vec3(uWireframeMode);
  float alpha = clamp(rimAngle + specularAmount, 0.1, 0.97);
  gl_FragColor = vec4(finalColor, max(alpha, uOpacity));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
