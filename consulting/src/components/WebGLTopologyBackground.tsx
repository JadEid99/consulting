import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { BufferAttribute, IUniform, Texture } from 'three';

// Vertex shader (Mz)
const vertexShader = `
attribute float aLayerOffset;
varying vec2 vUv;
varying float vLayerOffset;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uCycleOffset;
uniform float uCycleSpeed;
void main(){
  vUv = uv;
  vLayerOffset = aLayerOffset;
  vec4 transformedPosition = vec4(position, 1.0);
  transformedPosition.z += mod(uTime * uCycleSpeed + aLayerOffset + uCycleOffset, 1.0);
  vLayerOffset = mod(uTime * uCycleSpeed + aLayerOffset + uCycleOffset, 1.0);
  vWorldPosition = transformedPosition.xyz;
  vec4 mvPosition = modelViewMatrix * transformedPosition;
  gl_Position = projectionMatrix * mvPosition;
}`;

// Fragment shader (Ez) with fluid support
const fragmentShader = `
precision highp float;
varying vec2 vUv;
varying float vLayerOffset;
varying vec3 vWorldPosition;
uniform sampler2D tHeightNoise;
uniform sampler2D tNoise;
uniform sampler2D tFluid;
uniform bool uFluidEnabled;
uniform bool uFluidEdgeEnabled;
uniform float uFluidStrength;
uniform vec3 uColor1;uniform vec3 uColor2;uniform vec3 uColor3;uniform vec3 uColor4;uniform vec3 uColor5;
uniform float uColorStep1;uniform float uColorStep2;uniform float uColorStep3;uniform float uColorStep4;uniform float uColorStep5;uniform vec2 uColorHeightRange;
uniform float uColorNoiseStrength;uniform float uColorNoiseScale;uniform float uColorNoiseRandomDepth;
uniform vec3 uShadowColor;uniform float uShadowStrength;uniform vec2 uShadowRange;uniform float uShadowOffset;
uniform vec3 uLightColor;uniform vec2 uLightRange;uniform float uLightOffset;uniform float uLightStrength;uniform float uLightShininess;
uniform float uDepthOffset;uniform float uHeight;uniform float uHeightNoiseSpeed;uniform float uHeightNoiseStrength;uniform float uHeightNoiseScale;uniform float uLineNoiseStrength;
uniform vec2 uResolution;uniform vec2 uLightPos;uniform bool uIsFooter;uniform float uTime;

float aastep(float value, float threshold){
  return smoothstep(threshold - 0.00001, threshold + 0.00001, value);
}

float mapRange(float v, float a, float b, float c, float d){
  return c + (d - c) * ((v - a) / (b - a));
}

float fluidStrength(vec2 uv){
  if(!uFluidEnabled) return 0.0;
  float f = 0.0;
  if(uFluidEdgeEnabled){
    vec2 vel = texture2D(tFluid, gl_FragCoord.xy / uResolution).rg;
    f = (abs(vel.r) + abs(vel.g));
    f *= 0.004; // edge emphasize like site
  } else {
    vec2 vel = texture2D(tFluid, gl_FragCoord.xy / uResolution).rg;
    f = (abs(vel.r) + abs(vel.g)) * uFluidStrength;
  }
  return f;
}

float sampleNoise(vec2 uv,float layer){
  float n = texture2D(tHeightNoise, uv).r;
  n -= layer;
  n += fluidStrength(uv);
  return n;
}

void main(){
  float layerOffset = vLayerOffset * uDepthOffset;
  vec3 noise = texture2D(tNoise, vUv * uHeightNoiseScale + uTime * uHeightNoiseSpeed).rgb;
  vec2 heightNoiseOffset = noise.rg * uHeightNoiseStrength;

  if (vLayerOffset < 0.94) {
    float layerAbove = sampleNoise(vUv + heightNoiseOffset, layerOffset + 0.05);
    layerAbove = aastep(layerAbove, uHeight + 0.1);
    if (layerAbove > 0.01) { discard; }
  }

  float shapeNoise = sampleNoise(vUv + heightNoiseOffset, layerOffset);
  float n = aastep(shapeNoise, uHeight);
  if (uIsFooter && vLayerOffset < 0.06) n = 1.0;
  if (n < 0.999) { discard; }

  vec3 lightPos = vec3(uLightPos, 100.0);
  vec3 dir = -lightPos;
  vec2 uvc = (vUv + heightNoiseOffset) - uShadowOffset * normalize(dir.xy);
  float shadow = texture2D(tHeightNoise, uvc).r;
  shadow -= layerOffset;
  shadow = smoothstep(uHeight + uShadowRange.x, uHeight + uShadowRange.y, shadow);
  shadow *= uShadowStrength;
  if (vLayerOffset > 0.94) shadow = 0.0;

  float dist = mapRange(vWorldPosition.z, uColorHeightRange.x, uColorHeightRange.y, 0.0, 1.0);
  vec3 c = mix(uColor1, uColor2, smoothstep(uColorStep1, uColorStep2, dist));
  c = mix(c, uColor3, smoothstep(uColorStep2, uColorStep3, dist));
  c = mix(c, uColor4, smoothstep(uColorStep3, uColorStep4, dist));
  c = mix(c, uColor5, smoothstep(uColorStep4, uColorStep5, dist * 0.2));
  c += c * (smoothstep(uHeight + 0.002, uHeight, shapeNoise)) * 0.05;

  lightPos = vec3(-uLightPos, 100.0);
  dir = -lightPos;
  uvc = (vUv + heightNoiseOffset) - uLightOffset * normalize(dir.xy);
  float highlight = texture2D(tHeightNoise, uvc).r;
  highlight -= layerOffset;
  highlight = smoothstep(uHeight + uLightRange.x, uHeight + uLightRange.y, highlight);
  if (vLayerOffset > 0.94) highlight = 0.0;
  c += uLightColor * pow(highlight, uLightShininess) * uLightStrength;
  c = mix(c, uShadowColor, shadow);

  gl_FragColor = vec4(c, 1.0);
}`;

// Noise generator fragment (Dz)
const noiseFragment = `
varying vec2 vUv;uniform float uSeed;uniform float uTime;uniform float uScale;uniform float uTimeScale;uniform float uNoiseOffset;uniform vec2 uNoiseTranslation;vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a1.xy,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;float n = 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));n = 0.5 + 0.5*n;gl_FragColor=vec4(n,n,n,1.0);} 
`;

const noiseVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} 
`;

function createFullscreenPass(fragment: string, uniforms: { [k: string]: IUniform }){
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mat = new THREE.ShaderMaterial({ vertexShader: noiseVertex, fragmentShader: fragment, uniforms });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  scene.add(quad);
  return { scene, cam, mat };
}

const WebGLTopologyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

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
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    // Offscreen noise generator (Dz) with site defaults
    const noiseRT = new THREE.WebGLRenderTarget(256, 256, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    const noiseUniforms: { [k: string]: IUniform } = {
      uSeed: { value: 1230 },
      uTime: { value: 0 },
      uScale: { value: 0.81 },
      uTimeScale: { value: 0.0 },
      uNoiseOffset: { value: 0.244 },
      uNoiseTranslation: { value: new THREE.Vector2(-0.19, -0.12) },
    };
    const noisePass = createFullscreenPass(noiseFragment, noiseUniforms);

    // Fluid sim passes (vz, yz, xz, bz)
    const simSize = 256;
    const texelSize = new THREE.Vector2(1 / simSize, 1 / simSize);
    const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, type: THREE.FloatType as any };
    const velRT0 = new THREE.WebGLRenderTarget(simSize, simSize, rtOpts);
    const velRT1 = new THREE.WebGLRenderTarget(simSize, simSize, rtOpts);
    const divRT = new THREE.WebGLRenderTarget(simSize, simSize, rtOpts);
    const presRT0 = new THREE.WebGLRenderTarget(simSize, simSize, rtOpts);
    const presRT1 = new THREE.WebGLRenderTarget(simSize, simSize, rtOpts);

    const velocityUniforms: { [k: string]: IUniform } = {
      tTexture: { value: velRT0.texture },
      uTexelSize: { value: texelSize },
      uForce: { value: new THREE.Vector2(0, 0) },
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uPrevMouse: { value: new THREE.Vector2(-1, -1) },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
      uMouseRadius: { value: 0.07 },
      uPressure: { value: 0.9324 },
    };
    const divergenceUniforms: { [k: string]: IUniform } = {
      uVelocity: { value: velRT0.texture },
      uTexelSize: { value: texelSize },
      uViscosity: { value: 0.9603174603174605 },
    };
    const pressureUniforms: { [k: string]: IUniform } = {
      tTexture: { value: presRT0.texture },
      uDivergence: { value: divRT.texture },
      uAlpha: { value: 1.0 },
      uBeta: { value: 0.25 },
      uTexelSize: { value: texelSize },
    };
    const gradUniforms: { [k: string]: IUniform } = {
      uPressure: { value: presRT0.texture },
      uVelocity: { value: velRT0.texture },
      uTexelSize: { value: texelSize },
    };

    const velocityPass = createFullscreenPass(
      `varying vec2 vUv;uniform sampler2D tTexture;uniform vec2 uTexelSize;uniform vec2 uForce;uniform vec2 uMouse;uniform vec2 uPrevMouse;uniform vec2 uMouseVelocity;uniform float uMouseRadius;uniform float uPressure;float sdLine(vec2 p,vec2 a,vec2 b){float velocity=clamp(length(uMouseVelocity),0.5,1.5);vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return length(pa-ba*h)/velocity;}void main(){vec4 color=texture2D(tTexture,vUv-texture2D(tTexture,vUv).xy*uTexelSize);float dir=smoothstep(1.-uMouseRadius,1.,1.0-min(sdLine(vUv,uPrevMouse,uMouse),1.0));vec4 minColor=vec4(-1.);vec4 maxColor=vec4(1.);color=clamp((color+vec4(uForce*dir,0.0,1.0))*uPressure,minColor,maxColor);gl_FragColor=color;}`,
      velocityUniforms
    );
    const divergencePass = createFullscreenPass(
      `varying vec2 vUv;uniform sampler2D uVelocity;uniform vec2 uTexelSize;uniform float uViscosity;void main(){float x0=texture2D(uVelocity,vUv-vec2(uTexelSize.x,0.0)).x;float x1=texture2D(uVelocity,vUv+vec2(uTexelSize.x,0.0)).x;float y0=texture2D(uVelocity,vUv-vec2(0.0,uTexelSize.y)).y;float y1=texture2D(uVelocity,vUv+vec2(0.0,uTexelSize.y)).y;float divergence=(x1-x0+y1-y0)*uViscosity;gl_FragColor=vec4(divergence);}`,
      divergenceUniforms
    );
    const pressurePass = createFullscreenPass(
      `uniform sampler2D tTexture;uniform sampler2D uDivergence;uniform float uAlpha;uniform float uBeta;uniform vec2 uTexelSize;varying vec2 vUv;void main(){float x0=texture2D(tTexture,vUv-vec2(uTexelSize.x,0.0)).r;float x1=texture2D(tTexture,vUv+vec2(uTexelSize.x,0.0)).r;float y0=texture2D(tTexture,vUv-vec2(0.0,uTexelSize.y)).r;float y1=texture2D(tTexture,vUv+vec2(0.0,uTexelSize.y)).r;float b=texture2D(uDivergence,vUv).r;float relaxed=(x0+x1+y0+y1+uAlpha*b)*uBeta;gl_FragColor=vec4(relaxed);}`,
      pressureUniforms
    );
    const gradientPass = createFullscreenPass(
      `uniform sampler2D uPressure;uniform sampler2D uVelocity;uniform vec2 uTexelSize;varying vec2 vUv;void main(){float x0=texture2D(uPressure,vUv-vec2(uTexelSize.x,0)).r;float x1=texture2D(uPressure,vUv+vec2(uTexelSize.x,0)).r;float y0=texture2D(uPressure,vUv-vec2(0,uTexelSize.y)).r;float y1=texture2D(uPressure,vUv+vec2(0,uTexelSize.y)).r;vec2 v=texture2D(uVelocity,vUv).xy;gl_FragColor=vec4((v-vec2(x1-x0,y1-y0)*0.5),1.0,1.0);}`,
      gradUniforms
    );

    // Instanced layers
    const instances = 128;
    const base = new THREE.PlaneGeometry(2, 2);
    const instanced = new THREE.InstancedBufferGeometry();
    instanced.index = base.index;
    Object.keys(base.attributes).forEach((key) => {
      const attr = (base.attributes as any)[key] as BufferAttribute;
      instanced.setAttribute(key, attr);
    });
    const layerOffsets = new Float32Array(instances);
    for (let i = 0; i < instances; i++) layerOffsets[i] = (i + 1) / instances;
    instanced.instanceCount = instances;
    instanced.setAttribute('aLayerOffset', new THREE.InstancedBufferAttribute(layerOffsets, 1));

    // Production "Layers Hero" uniform values (from topology.js overrides)
    const uniforms: { [k: string]: IUniform } = {
      tHeightNoise: { value: noiseRT.texture },
      tNoise: { value: null },
      tFluid: { value: velRT0.texture },
      uFluidEnabled: { value: true },
      uFluidEdgeEnabled: { value: true },
      uFluidStrength: { value: 0.057 },
      uTime: { value: 0 },
      uCycleOffset: { value: 0 },
      uCycleSpeed: { value: 0 },
      uColor1: { value: new THREE.Color(0xC6C6C6) },
      uColor2: { value: new THREE.Color(0xC6C6C6) },
      uColor3: { value: new THREE.Color(0xC6C6C6) },
      uColor4: { value: new THREE.Color(0xC6C6C6) },
      uColor5: { value: new THREE.Color(0xC6C6C6) },
      uColorStep1: { value: 0.192 },
      uColorStep2: { value: 0.373 },
      uColorStep3: { value: 0.6194 },
      uColorStep4: { value: 0.8164 },
      uColorStep5: { value: 1.0 },
      uColorHeightRange: { value: new THREE.Vector2(0, 1) },
      uColorNoiseStrength: { value: 1.03 },
      uColorNoiseScale: { value: 0.888 },
      uColorNoiseRandomDepth: { value: 0.4558 },
      uShadowColor: { value: new THREE.Color(0x000000) },
      uShadowStrength: { value: 0.858 },
      uShadowRange: { value: new THREE.Vector2(0.00634920634920633, 0.014285714285714525) },
      uShadowOffset: { value: 0.0075 },
      uLightColor: { value: new THREE.Color(0xD6CFC7) },
      uLightRange: { value: new THREE.Vector2(0.04603174603174605, 0.10634920634920617) },
      uLightOffset: { value: 0.068 },
      uLightStrength: { value: 0.437 },
      uLightShininess: { value: 1.04 },
      uDepthOffset: { value: 0.175 },
      uHeight: { value: 0.426 },
      uHeightNoiseSpeed: { value: 0.00111 },
      uHeightNoiseStrength: { value: 0.024 },
      uHeightNoiseScale: { value: 0.16 },
      uLineNoiseStrength: { value: 1.34 },
      uLightPos: { value: new THREE.Vector2(-0.37, 0.107) },
      uResolution: { value: new THREE.Vector2(width, height) },
      uIsFooter: { value: false },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.InstancedMesh(instanced as unknown as THREE.BufferGeometry, material, instances);
    const temp = new THREE.Object3D();
    for (let i = 0; i < instances; i++) {
      temp.position.set(0, 0, 0);
      temp.scale.setScalar(5);
      temp.updateMatrix();
      mesh.setMatrixAt(i, temp.matrix);
    }
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    const noiseUrl = '/webgl/textures/gradient-noise.jpg';
    const texOpts = (tex: Texture) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
    };

    loader.load(noiseUrl, (tex: Texture) => {
      texOpts(tex);
      uniforms.tNoise.value = tex;
    });

    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const mouse = new THREE.Vector2(0.5, 0.5);
    const prevMouse = new THREE.Vector2(-1, -1);
    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      velocityUniforms.uPrevMouse.value.copy(mouse);
      mouse.set(x, y);
      velocityUniforms.uMouse.value.set(x, y);
      const mvx = (velocityUniforms.uMouse.value.x - velocityUniforms.uPrevMouse.value.x) / 16.0;
      const mvy = (velocityUniforms.uMouse.value.y - velocityUniforms.uPrevMouse.value.y) / 16.0;
      velocityUniforms.uMouseVelocity.value.set(mvx, mvy);
      (uniforms.uLightPos.value as THREE.Vector2).set(-x, y);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      (uniforms.uResolution.value as THREE.Vector2).set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;

      // render procedural height noise
      (noiseUniforms.uTime.value as number) = t;
      renderer.setRenderTarget(noiseRT);
      renderer.render(noisePass.scene, noisePass.cam);

      // fluid simulation update
      // advect/apply force
      velocityUniforms.tTexture.value = velRT0.texture;
      renderer.setRenderTarget(velRT1);
      renderer.render(velocityPass.scene, velocityPass.cam);
      // divergence
      divergenceUniforms.uVelocity.value = velRT1.texture;
      renderer.setRenderTarget(divRT);
      renderer.render(divergencePass.scene, divergencePass.cam);
      // pressure Jacobi (one iteration like site default)
      pressureUniforms.tTexture.value = presRT0.texture;
      pressureUniforms.uDivergence.value = divRT.texture;
      renderer.setRenderTarget(presRT1);
      renderer.render(pressurePass.scene, pressurePass.cam);
      // gradient subtract
      gradUniforms.uPressure.value = presRT1.texture;
      gradUniforms.uVelocity.value = velRT1.texture;
      renderer.setRenderTarget(velRT0);
      renderer.render(gradientPass.scene, gradientPass.cam);
      renderer.setRenderTarget(null);

      // bind outputs
      (uniforms.tHeightNoise.value as Texture) = noiseRT.texture;
      (uniforms.tFluid.value as Texture) = velRT0.texture;

      uniforms.uTime.value = t;

      // Optional: map scroll to cycle/height (kept subtle like overrides)
      const s = Math.max(0, Math.min(1, scrollY / 3000));
      uniforms.uCycleSpeed.value = 0.0 + s * 0.0;
      uniforms.uCycleOffset.value = 0.0;
      uniforms.uHeight.value = 0.426 + s * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      (base as any).dispose?.();
      (instanced as any).dispose?.();
      material.dispose();
      noisePass.mat.dispose();
      noiseRT.dispose();
      velocityPass.mat.dispose();
      divergencePass.mat.dispose();
      pressurePass.mat.dispose();
      gradientPass.mat.dispose();
      velRT0.dispose(); velRT1.dispose(); divRT.dispose(); presRT0.dispose(); presRT1.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default WebGLTopologyBackground;
