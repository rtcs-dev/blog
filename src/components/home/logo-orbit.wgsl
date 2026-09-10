struct Params {
  time: f32,
  motion: f32,
  pointer: vec2f,
  resolution: vec2f,
  theme: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = (uv * 2.0 - 1.0) * vec2f(aspect, 1.0);
  let t = params.time * params.motion;
  let radius = length(p);

  let pointer = params.pointer * vec2f(aspect, -1.0);
  let pointerLight = exp(-2.7 * length(p - pointer));
  let vignette = 1.0 - smoothstep(0.25, 1.5, radius);

  let cells = floor((p + vec2f(t * 0.008, 0.0)) * 18.0);
  let stars = step(0.982, hash(cells)) * hash(cells + 2.7);
  let gridX = 1.0 - smoothstep(0.0, 0.018, abs(fract(p.x * 8.0) - 0.5));
  let gridY = 1.0 - smoothstep(0.0, 0.018, abs(fract(p.y * 8.0) - 0.5));
  let grid = max(gridX, gridY);

  let background = mix(
    vec3f(0.025, 0.028, 0.04),
    vec3f(0.965, 0.955, 0.94),
    params.theme
  );
  let gridColor = mix(
    vec3f(0.24, 0.27, 0.36),
    vec3f(0.28, 0.20, 0.15),
    params.theme
  );

  var color = background;
  color += vec3f(0.11, 0.035, 0.01) * vignette * mix(1.0, 0.18, params.theme);
  color += vec3f(0.30, 0.10, 0.02) * pointerLight * mix(0.18, 0.08, params.theme);
  color += gridColor * (grid * 0.055 + stars * 0.18) * vignette;

  let halo = exp(-4.8 * radius) * (0.75 + 0.25 * sin(t * 0.65));
  color += vec3f(1.0, 0.16, 0.015) * halo * mix(0.22, 0.1, params.theme);

  let glare = smoothstep(0.035, 0.0, abs(p.x + p.y * 0.5 - sin(t * 0.38) * 0.8));
  color += vec3f(1.0, 0.36, 0.08) * glare * exp(-1.8 * radius) * mix(0.08, 0.04, params.theme);

  return vec4f(color, 1.0);
}
