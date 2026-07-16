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

export const BACKGROUND_VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const BACKGROUND_FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D uCurrentBackground;
uniform sampler2D uNextBackground;
uniform sampler2D uTile;
uniform float uHasCurrentBackground;
uniform float uHasNextBackground;
uniform vec4 uCurrentBackgroundUvTransform;
uniform vec4 uNextBackgroundUvTransform;
uniform vec2 uViewportSize;
uniform vec2 uTileUvScale;
uniform vec2 uRevealOrigin;
uniform float uRevealRadius;
uniform float uRevealProgress;

const float SANDPAPER_OPACITY = 1.0;

varying vec2 vUv;

vec3 neutralBackground(vec2 uv) {
  vec3 warmWhite = vec3(1.0, 0.9804, 0.9569);
  vec3 warmShadow = vec3(0.9686, 0.9412, 0.9098);
  float diagonal = clamp(uv.x * 0.36 + (1.0 - uv.y) * 0.64, 0.0, 1.0);
  return mix(warmWhite, warmShadow, diagonal);
}

vec3 visibleSandpaper(vec3 sampleColor) {
  vec3 paperBase = vec3(0.904, 0.88, 0.846);
  return clamp(vec3(1.0) + (sampleColor - paperBase) * 4.5, 0.32, 1.06);
}

float smootherstep01(float value) {
  float t = clamp(value, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / uViewportSize;
  vec2 tileUv = vec2(
    gl_FragCoord.x,
    uViewportSize.y - gl_FragCoord.y
  ) * uTileUvScale;
  vec3 sandpaper = visibleSandpaper(texture2D(uTile, tileUv).rgb);

  vec3 currentImage = neutralBackground(screenUv);
  if (uHasCurrentBackground > 0.5) {
    vec2 currentUv = screenUv * uCurrentBackgroundUvTransform.xy
      + uCurrentBackgroundUvTransform.zw;
    currentImage = texture2D(
      uCurrentBackground,
      clamp(currentUv, vec2(0.001), vec2(0.999))
    ).rgb;
  }
  vec3 currentComposite = mix(
    currentImage,
    currentImage * sandpaper,
    SANDPAPER_OPACITY
  );

  vec3 finalComposite = currentComposite;
  if (uHasNextBackground > 0.5) {
    vec2 nextUv = screenUv * uNextBackgroundUvTransform.xy
      + uNextBackgroundUvTransform.zw;
    vec3 nextImage = texture2D(
      uNextBackground,
      clamp(nextUv, vec2(0.001), vec2(0.999))
    ).rgb;
    vec3 nextComposite = mix(
      nextImage,
      nextImage * sandpaper,
      SANDPAPER_OPACITY
    );
    float easedReveal = smootherstep01(uRevealProgress);
    float revealOpacity = smootherstep01((uRevealProgress - 0.04) / 0.9);
    float finalRadius = length(uViewportSize) * 1.8;
    float revealRadius = mix(uRevealRadius, finalRadius, easedReveal);
    float reveal = 1.0 - smoothstep(
      revealRadius * 0.68,
      revealRadius,
      distance(gl_FragCoord.xy, uRevealOrigin)
    );
    finalComposite = mix(currentComposite, nextComposite, reveal * revealOpacity);
  }

  gl_FragColor = vec4(finalComposite, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
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
uniform sampler2D uBackground;
uniform float uHasBackground;
uniform float uBackgroundStrength;
uniform sampler2D uTile;
uniform vec2 uTileUvScale;
uniform vec2 uInvResolution;
uniform vec2 uViewportSize;
uniform float uFocalLength;
uniform vec3 uSphereCenterView;
uniform float uSphereRadiusView;
uniform float uBackgroundPlaneZ;
uniform vec4 uBackgroundUvTransform;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

const float SANDPAPER_OPACITY = 0.5;

vec3 neutralBackground(vec2 uv) {
  vec3 warmWhite = vec3(1.0, 0.9804, 0.9569);
  vec3 warmShadow = vec3(0.9686, 0.9412, 0.9098);
  float diagonal = clamp(uv.x * 0.36 + (1.0 - uv.y) * 0.64, 0.0, 1.0);
  return mix(warmWhite, warmShadow, diagonal);
}

vec3 visibleSandpaper(vec3 sampleColor) {
  vec3 paperBase = vec3(0.904, 0.88, 0.846);
  return clamp(vec3(1.0) + (sampleColor - paperBase) * 4.5, 0.32, 1.06);
}

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
  vec3 viewDirection = normalize(uViewPosition - vViewPosition);
  vec3 reflectedLight = reflect(-lightDirection, normal);
  vec2 cameraPlanePosition = (gl_FragCoord.xy - uViewportSize * 0.5) / uFocalLength;
  vec3 incidentRay = normalize(vec3(cameraPlanePosition, -1.0));
  float centerProjection = dot(incidentRay, uSphereCenterView);
  float sphereDiscriminant = centerProjection * centerProjection
    - (dot(uSphereCenterView, uSphereCenterView) - uSphereRadiusView * uSphereRadiusView);
  float safeDiscriminant = max(sphereDiscriminant, 0.0);
  float surfaceDistance = centerProjection - sqrt(safeDiscriminant);
  vec3 sphereSurfacePoint = incidentRay * surfaceDistance;
  vec3 sphereNormal = normalize(sphereSurfacePoint - uSphereCenterView);
  float sphereZ = clamp(
    sqrt(safeDiscriminant) / max(uSphereRadiusView, 0.0001),
    0.0,
    1.0
  );
  vec2 projectedSphereCenter = vec2(
    uSphereCenterView.x * uFocalLength / -uSphereCenterView.z,
    uSphereCenterView.y * uFocalLength / -uSphereCenterView.z
  ) + uViewportSize * 0.5;
  float projectedSphereRadius = uFocalLength * uSphereRadiusView / sqrt(max(
    uSphereCenterView.z * uSphereCenterView.z - uSphereRadiusView * uSphereRadiusView,
    0.0001
  ));
  vec2 projectedSpherePosition = (gl_FragCoord.xy - projectedSphereCenter)
    / max(projectedSphereRadius, 0.0001);
  float sphereRadiusSquared = dot(projectedSpherePosition, projectedSpherePosition);
  float albedoCoverage = 1.0 - smoothstep(0.20, 1.08, sphereRadiusSquared);
  float refractionMask = (1.0 - smoothstep(1.005, 1.06, sphereRadiusSquared))
    * mix(0.5, 1.45, smoothstep(0.32, 1.0, sphereRadiusSquared));
  float rimWidthCap = smoothstep(0.965, 0.992, sphereRadiusSquared)
    * (1.0 - smoothstep(1.008, 1.038, sphereRadiusSquared));
  float lightFacing = clamp(dot(sphereNormal, lightDirection) * 0.5 + 0.5, 0.0, 1.0);
  float directionalAlbedoCoverage = clamp(
    albedoCoverage * mix(0.72, 1.08, smoothstep(0.12, 0.92, lightFacing)),
    0.0,
    1.0
  );
  vec3 albedo = texture2D(uAlbedo, vUv).rgb;
  float luminance = dot(albedo, vec3(0.2126, 0.7152, 0.0722));
  float centerPop = smoothstep(0.34, 0.94, sphereZ);
  float albedoSaturation = 1.28 + centerPop * 0.24;
  float albedoContrast = 1.08 + centerPop * 0.12;
  albedo = mix(vec3(luminance), albedo, albedoSaturation);
  albedo = (albedo - 0.5) * albedoContrast + 0.5;
  albedo = clamp(albedo, 0.0, 1.0);
  vec2 screenUv = gl_FragCoord.xy * uInvResolution;
  vec3 refractedRay = refract(incidentRay, sphereNormal, 0.78);
  float backgroundDistance = (uBackgroundPlaneZ - sphereSurfacePoint.z)
    / min(refractedRay.z, -0.0001);
  vec3 backgroundPoint = sphereSurfacePoint + refractedRay * backgroundDistance;
  vec2 projectedBackgroundPixel = vec2(
    backgroundPoint.x * uFocalLength / -backgroundPoint.z,
    backgroundPoint.y * uFocalLength / -backgroundPoint.z
  ) + uViewportSize * 0.5;
  vec2 physicalRefractionUv = projectedBackgroundPixel * uInvResolution;
  vec2 refractedScreenUv = mix(screenUv, physicalRefractionUv, refractionMask);

  // Tile coordinates follow the straight and sphere-projected screen points.
  // They are folded into the video samples below instead of being rendered as
  // a second wallpaper layer.
  vec2 straightTileUv = vec2(
    gl_FragCoord.x,
    uViewportSize.y - gl_FragCoord.y
  ) * uTileUvScale;
  vec2 refractedTileUv = vec2(
    projectedBackgroundPixel.x,
    uViewportSize.y - projectedBackgroundPixel.y
  ) * uTileUvScale;
  vec3 straightSandpaper = visibleSandpaper(texture2D(uTile, straightTileUv).rgb);
  vec3 refractedSandpaper = visibleSandpaper(texture2D(uTile, refractedTileUv).rgb);
  vec3 straightBackground = neutralBackground(screenUv);
  vec3 refractedBackground = neutralBackground(refractedScreenUv);

  // The image is selected first, then receives the same sandpaper multiply as
  // the full-stage shader. Refraction compares coordinates in that finished
  // composite, so image and paper grain bend together as one surface.
  if (uHasBackground > 0.5) {
    vec2 straightBackgroundUv = screenUv * uBackgroundUvTransform.xy
      + uBackgroundUvTransform.zw;
    vec2 refractedBackgroundUv = refractedScreenUv * uBackgroundUvTransform.xy
      + uBackgroundUvTransform.zw;
    straightBackground = texture2D(
      uBackground,
      clamp(straightBackgroundUv, vec2(0.001), vec2(0.999))
    ).rgb;
    refractedBackground = texture2D(
      uBackground,
      clamp(refractedBackgroundUv, vec2(0.001), vec2(0.999))
    ).rgb;
  }
  vec3 straightComposite = mix(
    straightBackground,
    straightBackground * straightSandpaper,
    SANDPAPER_OPACITY
  );
  vec3 refractedComposite = mix(
    refractedBackground,
    refractedBackground * refractedSandpaper,
    SANDPAPER_OPACITY
  );
  vec3 refractedContribution = (refractedComposite - straightComposite)
    * refractionMask * 0.86 * uBackgroundStrength;

  vec3 lightColor = shiftingLight(
    uColorPhase + uTime * 0.035 + vUv.x * 0.16 + vUv.y * 0.1
  );

  float specularAmount = pow(max(dot(reflectedLight, viewDirection), 0.0), 36.0);

  // Anisotropic GGX lobe on the analytical sphere. The azimuthal tangent
  // stretches the highlight without another texture lookup or render pass.
  vec3 sphereTangent = normalize(cross(vec3(0.0, 1.0, 0.0), sphereNormal) + vec3(0.0001, 0.0, 0.0));
  vec3 sphereBitangent = normalize(cross(sphereNormal, sphereTangent));
  vec3 halfDirection = normalize(lightDirection + viewDirection);
  float tangentHalf = dot(sphereTangent, halfDirection) / 0.14;
  float bitangentHalf = dot(sphereBitangent, halfDirection) / 0.46;
  float normalHalf = max(dot(sphereNormal, halfDirection), 0.0);
  float anisotropicDenominator = tangentHalf * tangentHalf
    + bitangentHalf * bitangentHalf + normalHalf * normalHalf;
  float anisotropicAmount = clamp(
    normalHalf / max(0.14 * 0.46 * anisotropicDenominator * anisotropicDenominator, 0.001) * 0.055,
    0.0,
    1.0
  ) * directionalAlbedoCoverage;
  float highlightLuminance = dot(lightColor, vec3(0.2126, 0.7152, 0.0722));
  vec3 saturatedHighlight = mix(vec3(highlightLuminance), lightColor, 1.58);
  vec3 specular = clamp(saturatedHighlight * 1.08, 0.0, 1.0)
    * (specularAmount * 0.34 + anisotropicAmount * 0.82);

  float rimAngle = dot(normal, viewDirection);
  rimAngle = pow(rimAngle, 2.0);
  float rimAmount = pow(max(1.0 - rimAngle, 0.0), 1.8);
  float rimOpacityBand = rimWidthCap * smoothstep(0.48, 0.92, rimAmount);
  float rimLuminance = dot(lightColor, vec3(0.2126, 0.7152, 0.0722));
  vec3 saturatedRimLight = mix(vec3(rimLuminance), lightColor, 1.68);
  vec3 rimColor = clamp(saturatedRimLight * 1.22, 0.0, 1.0)
    * rimAmount * rimWidthCap * 0.72;

  vec3 finalColor = max(
    albedo + refractedContribution + specular + rimColor + vec3(uWireframeMode),
    vec3(0.0)
  );
  float alpha = clamp(
    max(directionalAlbedoCoverage * 0.98, rimOpacityBand * 0.86) + anisotropicAmount * 0.12,
    0.06,
    0.99
  );
  gl_FragColor = vec4(finalColor, max(alpha, uOpacity));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
