export const GLASS_VERTEX_SHADER = `
attribute vec3 a_pos;
attribute vec3 a_nor;
attribute vec2 a_uv;
uniform vec2 u_cell;
varying vec3 v_nor; varying vec3 v_pos; varying vec2 v_uv;
void main() {
  vec2 norXY = (a_pos.xy / u_cell) * 2.0 - 1.0;
  v_pos = vec3(norXY, a_pos.z / u_cell.y);
  v_nor = a_nor; v_uv = a_uv;
  gl_Position = vec4(norXY * vec2(1.0, -1.0), 0.0, 1.0);
}
`;

export const GLASS_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 v_nor; varying vec3 v_pos; varying vec2 v_uv;
uniform float u_reveal;
uniform vec2 u_light;
uniform vec3 u_tint;
uniform sampler2D u_thumb;
void main() {
  vec3 N = normalize(v_nor);
  vec3 V = vec3(0.0, 0.0, 1.0);
  float ndv = abs(dot(N, V));
  float fres = pow(1.0 - ndv, 3.0);
  vec3 rr = refract(-V, N, 0.72);
  vec2 tuv = clamp(vec2(0.5) + v_pos.xy * vec2(0.42, -0.42)
                   + rr.xy * 0.30 + N.xy * fres * 0.28, 0.0, 1.0);
  vec3 tex = texture2D(u_thumb, tuv).rgb;
  vec3 body = mix(vec3(1.0), tex, u_reveal);
  vec3 L = normalize(vec3(u_light, 0.8));
  vec3 T = normalize(vec3(-N.z, 0.0, N.x));
  vec3 H = normalize(L + V);
  float ta = dot(T, H);
  float aniso = pow(sqrt(max(0.0, 1.0 - ta * ta)), 90.0);
  float spec = aniso * (0.25 + 0.75 * fres) * 0.85;
  vec3 col = body + vec3(spec) + u_tint * fres * 0.16;
  float alpha = clamp(0.16 + 0.62 * fres + u_reveal * 0.5 + spec, 0.0, 0.92);
  gl_FragColor = vec4(col, alpha);
}
`;
