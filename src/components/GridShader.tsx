// components/GridShader.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function GridShader() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get WebGL context
        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.warn('WebGL not supported');
            return;
        }

        //
        // ─── SIMPLE VERTEX SHADER ──────────────────────────────────────────────────────
        //
        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = (a_position + 1.0) * 0.5; 
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        //
        // ─── UPDATED FRAGMENT SHADER (BLACK BACKGROUND + WHITE GRID) ─────────────────
        //
        const fragmentShaderSource = `
            precision mediump float;
            uniform float u_time;
            uniform vec2 u_resolution;
            varying vec2 v_uv;

            // A helper that draws a crisp grid line at every 1/scale interval
            float gridPattern(vec2 uv, float scale) {
                // fract(uv * scale) gives a sawtooth from 0..1
                vec2 gv = fract(uv * scale);
                // produce a “thin line” whenever gv is near 0.0 or 1.0
                float lineX = smoothstep(0.48, 0.5, gv.x) * (1.0 - smoothstep(0.5, 0.52, gv.x));
                float lineY = smoothstep(0.48, 0.5, gv.y) * (1.0 - smoothstep(0.5, 0.52, gv.y));
                return max(lineX, lineY);
            }

            void main() {
                // Normalize coordinates so center is (0,0) in “screen‐space”
                vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
                float dist = length(st);

                // Make a small ripple factor from the distance + time
                float ripple = sin((dist * 10.0) - (u_time * 2.0)) * 0.02;

                // Offset the UV by ripple
                vec2 uv = v_uv + ripple;

                // How many grid squares across
                float scale = 20.0;

                // Compute grid lines
                float lines = gridPattern(uv, scale);

                // Pure black background
                vec3 bg = vec3(0.0);

                // Bright white lines
                vec3 lineColor = vec3(1.0);

                // Mix: wherever lines==1.0, show white; else black
                vec3 color = mix(bg, lineColor, lines);

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Helper to compile a shader
        function compileShader(type: number, source: string) {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        // Compile vertex + fragment shaders
        const vertShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)!;
        const fragShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)!;

        // Link into a program
        const program = gl.createProgram()!;
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }
        gl.useProgram(program);

        // Look up attribute/uniform locations
        const posAttrib = gl.getAttribLocation(program, 'a_position');
        const timeUniform = gl.getUniformLocation(program, 'u_time');
        const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');

        // Create a full‐screen quad (two triangles)
        const quadBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        const quadVertices = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(posAttrib);
        gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

        // Resize helper: match canvas drawing buffer to its display size
        function resize() {
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const width = Math.floor(canvas.clientWidth * dpr);
            const height = Math.floor(canvas.clientHeight * dpr);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }
        }

        // Animation loop
        const startTime = performance.now();
        function render(now: number) {
            resize();

            const elapsed = (now - startTime) * 0.001; // seconds
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Update uniforms
            if (timeUniform) {
                gl.uniform1f(timeUniform, elapsed);
            }
            if (resolutionUniform) {
                gl.uniform2f(
                    resolutionUniform,
                    canvas.width,
                    canvas.height
                );
            }

            // Draw the quad (full screen)
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameRef.current = requestAnimationFrame(render);
        }
        animationFrameRef.current = requestAnimationFrame(render);

        // Clean up on unmount
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            gl.deleteProgram(program);
            gl.deleteShader(vertShader);
            gl.deleteShader(fragShader);
            gl.deleteBuffer(quadBuffer);
        };
    }, []);

    return (
        // ─── GIVE THE CANVAS A SEMI‐TRANSPARENT RED BORDER/BACKGROUND FOR DEBUG ─────
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
                // Temporary debugging styles – you can remove these once you see it’s working.
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                display: 'block',
            }}
        />
    );
}
