"use client";

import React, { useEffect, useRef } from "react";

export default function AutomationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    // Sync the WebGL drawing-buffer size with the CSS-driven layout size.
    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.15;
    
    // Deep blue background to match the AccessFlow dark theme
    vec3 baseCol = vec3(0.04, 0.07, 0.13); // #0B1220
    vec3 accentCol = vec3(0.18, 0.44, 0.93); // #2F6FED
    vec3 deepCol = vec3(0.02, 0.04, 0.08); // Darker for depth blooms
    
    // Subtle grid/circuit lines
    vec2 grid = fract(p * 4.0 + t * 0.1);
    float lines = smoothstep(0.02, 0.0, abs(grid.x - 0.5)) + smoothstep(0.02, 0.0, abs(grid.y - 0.5));
    
    // Moving nodes/data packets
    float nodes = 0.0;
    for(int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 nodePos = vec2(sin(t + fi * 1.5) * 1.2, cos(t * 0.8 + fi * 2.1) * 0.7);
        float dist = length(p - nodePos);
        nodes += smoothstep(0.05, 0.0, dist) * 0.6;
        
        // Connections
        float lineToCenter = smoothstep(0.01, 0.0, abs(length(p - nodePos * 0.5) - length(nodePos) * 0.5)) * smoothstep(0.1, 0.0, abs(atan(p.y - nodePos.y*0.5, p.x - nodePos.x*0.5) - atan(nodePos.y, nodePos.x)));
    }
    
    // Soft gradient blooms for depth
    float bloom = smoothstep(1.5, 0.0, length(p - vec2(0.8, -0.5)));
    
    vec3 finalCol = baseCol;
    finalCol = mix(finalCol, accentCol, lines * 0.03); // Subtle grid
    finalCol = mix(finalCol, accentCol, nodes * 0.15); // Glowing nodes
    finalCol = mix(finalCol, deepCol, bloom * 0.05); // Corner depth
    
    // Subtle drift noise
    finalCol += (noise(p * 10.0 + t) - 0.5) * 0.01;
    
    gl_FragColor = vec4(finalCol, 1.0);
}`;

    function cs(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    
    const prog = gl.createProgram();
    if (!prog) return;

    const vsShader = cs(gl.VERTEX_SHADER, vs);
    const fsShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vsShader || !fsShader) return;

    gl.attachShader(prog, vsShader);
    gl.attachShader(prog, fsShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    function render(t: number) {
      if (!canvas || !gl) return;
      if (typeof ResizeObserver === "undefined") syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver && canvas) {
        resizeObserver.unobserve(canvas);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle Fine Grid Texture overlay for extra texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
