import { useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';

/**
 * LiquidLight — a living amber gradient flowing behind the whole page.
 *
 * One fullscreen WebGL quad, three octaves of value-noise fbm, a few pixels
 * of drift per second, and a faint bend away from the cursor. Rendered at
 * half resolution and let the GPU upscale it (fbm is smooth, so this is free).
 * Zero CPU painting, no layout, no DOM churn — pure fragment shader.
 *
 * Gated by settings.liquidBg + reduced-motion; pauses when the tab hides.
 */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform vec2 u_m;
uniform float u_dark;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.13; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 st = uv; st.x *= u_res.x / u_res.y;
  vec2 m = u_m; m.x *= u_res.x / u_res.y;

  // liquid bends faintly around the cursor
  float d = distance(st, m);
  st += (st - m) * 0.045 * exp(-d * 2.6);

  float n = fbm(st * 2.1 + vec2(u_t * 0.028, -u_t * 0.019)
            + fbm(st * 3.2 - u_t * 0.014) * 0.85);

  // golden-hour palette
  vec3 champagne = vec3(0.957, 0.906, 0.772);
  vec3 amber     = vec3(0.792, 0.612, 0.302);
  vec3 deep      = vec3(0.556, 0.396, 0.160);

  vec3 col = mix(champagne, amber, smoothstep(0.28, 0.78, n));
  col = mix(col, deep, smoothstep(0.74, 0.99, n) * 0.55);

  // alpha: whispers of gold — stronger pools in dark mode (candlelight)
  float a = (n * n) * mix(0.34, 0.5, u_dark);
  gl_FragColor = vec4(col, a);
}
`;

export default function LiquidLight() {
  const settings = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = settings.liquidBg && !settings.reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const gl = cvs.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uT = gl.getUniformLocation(prog, 'u_t');
    const uM = gl.getUniformLocation(prog, 'u_m');
    const uDark = gl.getUniformLocation(prog, 'u_dark');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let raf = 0;
    let running = true;
    let mx = 0.5, my = 0.4, sx = 0.5, sy = 0.4;
    const SCALE = 0.45; // render at 45% — the GPU upscales, fbm hides it
    const t0 = performance.now();

    const resize = () => {
      cvs.width = Math.max(2, Math.floor(window.innerWidth * SCALE));
      cvs.height = Math.max(2, Math.floor(window.innerHeight * SCALE));
      gl.viewport(0, 0, cvs.width, cvs.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const fine = window.matchMedia('(pointer: fine)').matches;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    const frame = () => {
      if (!running) return;
      sx += (mx - sx) * 0.05;
      sy += (my - sy) * 0.05;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, cvs.width, cvs.height);
      gl.uniform1f(uT, (performance.now() - t0) / 1000);
      gl.uniform2f(uM, sx, sy);
      gl.uniform1f(uDark, document.documentElement.dataset.theme === 'noir' ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (fine) window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 w-full h-full"
    />
  );
}
