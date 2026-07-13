export const BUBBLE_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
  vUv = vec2(uv.x, 1.0 - uv.y);
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}
`;

export const BUBBLE_FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uAlbedo;
uniform vec3 uLightDirection;

varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
  if (!gl_FrontFacing) normal *= -1.0;

  vec3 viewDirection = normalize(-vViewPosition);
  vec3 lightDirection = normalize(uLightDirection);
  vec3 halfVector = normalize(viewDirection + lightDirection);
  vec3 albedo = texture2D(uAlbedo, vUv).rgb;

  float diffuse = 0.84 + 0.16 * max(dot(normal, lightDirection), 0.0);
  float specular = pow(max(dot(normal, halfVector), 0.0), 52.0) * 0.24;

  float grazing = 1.0 - abs(dot(normal, viewDirection));
  float thinRim = smoothstep(0.62, 0.96, grazing);
  vec3 tangent = normalize(vec3(-normal.y, normal.x, 0.001));
  float anisotropic = pow(max(0.0, 1.0 - abs(dot(tangent, halfVector))), 68.0);
  float hue = atan(normal.y, normal.x) / 6.2831853 + 0.5 + normal.z * 0.1;
  vec3 spectrum = 0.58 + 0.42 * cos(6.2831853 * (hue + vec3(0.0, 0.34, 0.67)));
  vec3 spectralRim = spectrum * thinRim * (0.06 + anisotropic * 0.42);

  vec3 color = albedo * diffuse + vec3(specular) + spectralRim;
  float alpha = 0.72 + thinRim * 0.22 + specular * 0.06;
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.97));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
