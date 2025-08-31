import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { IUniform, Texture, Vector2 } from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform sampler2D uNoiseTex;

  // Helper: rotate 2D vector
  mat2 rot(float a){
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec2 uv = vUv;

    // Center and aspect
    vec2 p = uv - 0.5;

    // Scroll-driven rotation and scale
    float angle = uScroll * 3.14159 * 2.0;
    p = rot(angle) * p;
    float scale = 1.0 + uScroll * 0.4;
    p *= scale;

    // Mouse parallax
    p += (uMouse - 0.5) * 0.1;

    // Concentric wave pattern
    float r = length(p);
    float waves = sin(10.0 * r - uTime * 0.6);

    // Fetch noise
    vec2 nUv = uv * 2.0 + vec2(uTime * 0.02, uScroll * 0.5);
    vec3 noise = texture2D(uNoiseTex, nUv).rgb;

    // Rainbow gradient mapped by waves
    float t = 0.5 + 0.5 * waves;
    vec3 rainbow = vec3(
      0.5 + 0.5 * sin(6.2831 * (t + 0.00)),
      0.5 + 0.5 * sin(6.2831 * (t + 0.33)),
      0.5 + 0.5 * sin(6.2831 * (t + 0.66))
    );

    // Blend with noise for grain
    vec3 color = mix(rainbow, rainbow * noise, 0.35);

    // Vignette
    float vign = smoothstep(0.9, 0.2, r);
    color *= vign;

    // Desaturate to match subtle look
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(g), color, 0.6);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const WebGLBackground: React.FC<{ noiseUrl?: string }> = ({ noiseUrl = '/webgl/textures/gradient-noise.jpg' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Plane covering screen
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms: { [k: string]: IUniform } = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) as Vector2 },
      uNoiseTex: { value: null },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    loader.load(
      noiseUrl,
      (tex: Texture) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.minFilter = THREE.LinearFilter;
        uniforms.uNoiseTex.value = tex;
      },
      undefined,
      () => {
        // Fallback: make a small procedural noise texture
        const size = 64;
        const data = new Uint8Array(size * size * 3);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 255;
        const tex = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
        tex.needsUpdate = true;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        uniforms.uNoiseTex.value = tex as unknown as Texture;
      }
    );

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      uniforms.uTime.value = t;
      (uniforms.uMouse.value as Vector2).set(mouseRef.current.x, mouseRef.current.y);

      // Map scroll to 0..1 against 3000px range, clamp
      const s = Math.max(0, Math.min(1, scrollY / 3000));
      uniforms.uScroll.value = s;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (uniforms.uNoiseTex.value && (uniforms.uNoiseTex.value as Texture).dispose) {
        (uniforms.uNoiseTex.value as Texture).dispose();
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [noiseUrl]);

  return <div ref={mountRef} />;
};

export default WebGLBackground;
