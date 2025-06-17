// TODO: Replaced physics-based movement with deterministic figure-eight path for more predictable and fluid queen movement
// Added GSAP animation to vary path radii every 15 seconds for more organic movement
// Added cursor interaction for subtle magnetic effect
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function BinaryMorphParticles({ startAnimation = false }: { startAnimation?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const queenPositionRef = useRef({ x: -1.2, y: 0.375 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const renderRef = useRef<((t: number) => void) | null>(null);
  const isAnimatingRef = useRef(false);
  const needsCursorUpdateRef = useRef(false);
  const lastTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && startAnimation);
  }, [startAnimation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const handlePointerMove = (e: PointerEvent) => {
      cursorRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursorRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      needsCursorUpdateRef.current = true;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    
    const width = window.innerWidth;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width <= 1080 ? 1.5 : 2));
    renderer.setSize(width, window.innerHeight, false);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 4;
    camera.position.x = -1.5;
    camera.position.y = 1.5;
    camera.lookAt(-0.5, 0, 0);

    const isMobile = window.innerWidth < 768 || window.devicePixelRatio > 2;
    const N = isMobile ? 1000 : 2000;
    const quadGeo = new THREE.PlaneGeometry(0.002, 0.002);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = quadGeo.index;
    geo.attributes.position = quadGeo.attributes.position;
    geo.attributes.uv = quadGeo.attributes.uv;
    geo.instanceCount = N;

    const queenX = -1.2;
    const queenY = 0.375;

    const createInitialPositions = (count: number) => {
      const pos = new Array(count * 3);
      const isEdgeInit = new Array(count);
      const delays = new Array(count);

      const lineWidth = 0.8;
      const lineHeight = 0.02;
      const xOffset = -0.25;

      const leftMostX = -lineWidth / 2 + xOffset;
      const rightMostX = lineWidth / 2 + xOffset;
      const totalSpan = rightMostX - leftMostX;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        if (i === 0) {
          pos[i3] = queenX + 0.2;
          pos[i3 + 1] = queenY;
          pos[i3 + 2] = 0;
          isEdgeInit[i] = 2;
          delays[i] = 0;
          continue;
        }

        const t = i / count;
        const baseX = -lineWidth/2 + t * t * lineWidth + xOffset;
        const baseY = lineHeight + 0.04;
        const variation = (Math.random() - 0.5) * 0.02;
        
        pos[i3] = baseX;
        pos[i3 + 1] = baseY + variation;
        pos[i3 + 2] = (Math.random() - 0.5) * 0.1;
        isEdgeInit[i] = 1;

        const normalized = (baseX - leftMostX) / totalSpan;
        delays[i] = normalized * 4.0;
      }

      return { pos, isEdgeInit, delays };
    };

    const { pos: randomPositions, isEdgeInit, delays } = createInitialPositions(N);

    const addAttr = (n: string, arr: number[], itemSize = 3) =>
      geo.setAttribute(n, new THREE.InstancedBufferAttribute(new Float32Array(arr), itemSize));
    addAttr('aPos0', randomPositions);
    addAttr('aPos1', randomPositions);
    geo.setAttribute(
      'aRnd',
      new THREE.InstancedBufferAttribute(Float32Array.from({ length: N }, () => Math.random()), 1)
    );
    geo.setAttribute(
      'aIsEdge0',
      new THREE.InstancedBufferAttribute(new Float32Array(isEdgeInit), 1)
    );
    geo.setAttribute(
      'aIsEdge1',
      new THREE.InstancedBufferAttribute(new Float32Array(isEdgeInit), 1)
    );
    geo.setAttribute(
      'aSize',
      new THREE.InstancedBufferAttribute(Float32Array.from({ length: N }, () => 1.2 + Math.random() * 1.2), 1)
    );
    geo.setAttribute(
      'aDelay',
      new THREE.InstancedBufferAttribute(Float32Array.from({ length: N }, (_, i) => (i / N) * 15.0), 1)
    );

    const vertex300 = `
      in vec3 position;
      in vec3 aPos0;
      in vec3 aPos1;
      in float aRnd;
      in float aIsEdge0;
      in float aIsEdge1;
      in float aSize;
      in float aDelay;
      uniform float uTime;
      uniform float uMorph;
      uniform vec2 uQueenPos;
      uniform vec2 uCursor;
      uniform float uPhase;
      uniform float uAppearDuration;
      out float vAlpha;
      out vec2 vUv;
      out float vIsEdge;

      vec3 keepInBounds(vec3 pos) {
        float horizontalBound = 2.0;
        float verticalTop = 1.0;
        float verticalBottom = -1.0;
        
        float distToRight = horizontalBound - pos.x;
        float distToLeft = pos.x - (-horizontalBound);
        float distToTop = verticalTop - pos.y;
        float distToBottom = pos.y - verticalBottom;
        
        float edgeThreshold = 0.4;
        float rightEdge = smoothstep(edgeThreshold, 0.0, distToRight);
        float leftEdge = smoothstep(edgeThreshold, 0.0, distToLeft);
        float topEdge = smoothstep(edgeThreshold, 0.0, distToTop);
        float bottomEdge = smoothstep(edgeThreshold, 0.0, distToBottom);
        
        float flyStrength = max(max(rightEdge, leftEdge), max(topEdge, bottomEdge));
        float flySpeed = 1.2;
        float flyPattern = sin(uTime * 4.0 + aRnd * 6.28318) * 0.5 + 0.5;
        pos.z += flyStrength * flySpeed * flyPattern;
        
        if (leftEdge > 0.0) {
            float leftBounceStrength = 0.4;
            float leftBounceTime = uTime * 6.0 + aRnd * 6.28318;
            float leftBounce = sin(leftBounceTime) * leftBounceStrength;
            
            pos.x = -horizontalBound + 0.2 + leftBounce;
            pos.z += 0.5;
            pos.y += leftBounce * 0.3;
        }
        
        if (rightEdge > 0.0) {
            float bounceStrength = 0.2;
            float bounceTime = uTime * 4.0 + aRnd * 6.28318;
            float bounce = sin(bounceTime) * bounceStrength;
            pos.x = mix(pos.x, horizontalBound - bounce, rightEdge);
            pos.x -= rightEdge * bounceStrength;
        }
        if (topEdge > 0.0) {
            float bounceStrength = 0.2;
            float bounceTime = uTime * 4.0 + aRnd * 6.28318;
            float bounce = sin(bounceTime) * bounceStrength;
            pos.y = mix(pos.y, verticalTop - bounce, topEdge);
            pos.y -= topEdge * bounceStrength;
        }
        if (bottomEdge > 0.0) {
            float bounceStrength = 0.2;
            float bounceTime = uTime * 4.0 + aRnd * 6.28318;
            float bounce = sin(bounceTime) * bounceStrength;
            pos.y = mix(pos.y, verticalBottom + bounce, topEdge);
            pos.y += bottomEdge * bounceStrength;
        }
        
        float pushStrength = 0.3;
        pos.x += (rightEdge - leftEdge) * pushStrength;
        pos.y += (topEdge - bottomEdge) * pushStrength;
        
        return pos;
      }

      void main() {
        float delayedTime = max(0.0, uTime - aDelay);
        float tAppear = clamp(delayedTime / uAppearDuration, 0.0, 1.0);
        
        vec3 finalP = mix(aPos0, aPos1, smoothstep(0.0, 1.0, uMorph));
        vIsEdge = mix(aIsEdge0, aIsEdge1, smoothstep(0.0, 1.0, uMorph));
        
        vec2 toCursor = uCursor - finalP.xy;
        float cursorDist = length(toCursor);
        float cursorInfluence = smoothstep(0.6, 0.0, cursorDist) * 0.12;
        
        vec2 queenPos = uQueenPos;
        
        if (vIsEdge > 1.5) {
          finalP.xy = queenPos;
          finalP.z = 0.12 * sin(delayedTime * 0.4);
        } else if (vIsEdge > 0.5) {
          float flowSpeed = 1.5;
          float verticalSpeed = 0.6;
          float depthSpeed = 0.4;

          vec2 toQueen = queenPos - finalP.xy;
          float dist = length(toQueen);
          vec2 dirToQueen = normalize(toQueen);
          
          float influence = smoothstep(0.7, 0.2, dist) * 0.8;
          
          float cylinderRadius = 0.2;
          float particleAngle = aRnd * 6.28318;
          
          float jellyfishWave = sin(delayedTime * 0.3 + particleAngle) * 0.15;
          float jellyfishPulse = sin(delayedTime * 0.2) * 0.1;
          
          vec2 cylinderOffset = vec2(
            cos(particleAngle) * (cylinderRadius + jellyfishPulse),
            sin(particleAngle) * (cylinderRadius + jellyfishPulse) + jellyfishWave
          );
          
          vec2 targetPos = queenPos + cylinderOffset;
          
          float transitionStart = -0.7;
          float transitionEnd = 0.1;
          float followStrength = smoothstep(transitionStart, transitionEnd, aPos0.x);
          
          float rightConstraint = smoothstep(0.3, 0.5, aPos0.x);
          float rightWave = sin(delayedTime * 0.4 + aPos0.x * 10.0) * 0.1;
          targetPos.x = mix(targetPos.x, queenPos.x + 0.15 + rightWave, rightConstraint);
          
          finalP.x = mix(aPos0.x, targetPos.x, followStrength);
          finalP.y = mix(aPos0.y, targetPos.y, followStrength);
          
          float waveTime = delayedTime * 0.4;
          float waveStrength = 0.03;
          float jellyfishFlow = sin(waveTime + particleAngle) * 0.05;
          finalP.y += (waveStrength * sin(waveTime + particleAngle) + jellyfishFlow);
          finalP.z = 0.04 * sin(delayedTime * depthSpeed + aRnd * 3.14159);
          
          float rotationSpeed = 0.2;
          float rotationAngle = delayedTime * rotationSpeed;
          vec2 toCenter = finalP.xy - queenPos;
          float distToCenter = length(toCenter);
          vec2 rotated = vec2(
            cos(rotationAngle) * toCenter.x - sin(rotationAngle) * toCenter.y,
            sin(rotationAngle) * toCenter.x + cos(rotationAngle) * toCenter.y
          );
          finalP.xy = mix(finalP.xy, queenPos + rotated, followStrength * 0.2);
          
          float variationTime = delayedTime * 0.2;
          finalP.x += 0.01 * sin(variationTime + aRnd * 12.56636);
          finalP.y += 0.01 * cos(variationTime + aRnd * 9.42477);
          
          finalP.xy += normalize(toCursor) * cursorInfluence;
        } else {
          float orbitRadius = mix(0.1, 0.3, aRnd);
          float orbitSpeed = mix(0.6, 1.2, aRnd);
          float orbitPhase = aRnd * 6.28318;
          
          float particleTime = delayedTime * (0.6 + aRnd * 0.3);
          float individualPhase = aRnd * 12.56636;
          
          float jellyfishWave = sin(particleTime * 0.3 + individualPhase) * 0.1;
          float depthWobble = 0.06 * sin(particleTime * 0.6 + individualPhase) + jellyfishWave;
          float orbitWobble = 0.03 * sin(particleTime * 1.0 + individualPhase * 2.0);
          
          float orbitAngle = particleTime * orbitSpeed + orbitPhase;
          float randomRadius = orbitRadius * (0.9 + 0.2 * sin(particleTime * 0.2 + aRnd * 6.28318));
          float randomAngle = orbitAngle + 0.1 * sin(particleTime * 0.4 + aRnd * 9.42477);
          
          float perspectiveFactor = 1.0 + 0.15 * sin(orbitAngle) * (0.9 + 0.2 * aRnd);
          randomRadius *= perspectiveFactor;
          
          float randomOffsetX = 0.06 * sin(particleTime * 0.5 + aRnd * 15.70796);
          float randomOffsetY = 0.06 * cos(particleTime * 0.7 + aRnd * 18.84956);
          float randomOffsetZ = 0.04 * sin(particleTime * 0.9 + aRnd * 21.99115);
          
          vec3 orbitOffset = vec3(
            randomRadius * cos(randomAngle) + randomOffsetX,
            randomRadius * sin(randomAngle) + randomOffsetY,
            depthWobble + orbitWobble + randomOffsetZ
          );
          
          float tiltFactor = 0.04 * sin(orbitAngle) * (0.9 + 0.1 * aRnd);
          orbitOffset.z += tiltFactor;
          
          orbitOffset.x += 0.02 * sin(particleTime * 0.3 + aRnd * 25.13274);
          orbitOffset.y += 0.02 * cos(particleTime * 0.5 + aRnd * 28.27433);
          
          finalP = vec3(queenPos, 0.0) + orbitOffset;
          
          finalP.xy += normalize(toCursor) * cursorInfluence;
        }
        
        vec3 startP = vec3(-3.0, finalP.y, finalP.z);
        vec3 p = mix(startP, finalP, tAppear);
        p = keepInBounds(p);
        
        float depthScale = 1.0 + p.z * 0.15;
        float size = aSize;
        vec3 scaledPosition = position * depthScale * size;
        
        gl_Position = vec4(scaledPosition + p, 1.0);
        
        float glowAlpha = 1.0 - abs(sin(delayedTime * 0.15 + aRnd * 3.14159));
        vAlpha = glowAlpha * tAppear;
        vUv = position.xy * 0.5 + 0.5;
      }
    `;

    const fragment300 = `
      precision highp float;
      in float vAlpha;
      in vec2 vUv;
      in float vIsEdge;
      out vec4 outColor;

      void main() {
        float dist = length(vUv - vec2(0.5));
        float glow = pow(smoothstep(0.4, 0.0, dist), 1.0);
        float core = smoothstep(0.2, 0.0, dist);
        float twinkle = 0.9 + 0.1 * sin(vAlpha * 12.0 + vUv.x * 20.0 + vUv.y * 20.0 + vAlpha * 100.0);
        
        float hue = 0.55 + 0.1 * sin(vAlpha * 20.0 + vUv.x * 10.0);
        float sat = 0.9 + 0.1 * cos(vAlpha * 15.0 + vUv.y * 10.0);
        float val = 1.2;
        
        float c = val * sat;
        float x = c * (1.0 - abs(mod(hue * 6.0, 2.0) - 1.0));
        float m = val - c;
        vec3 rgb;
        if (hue < 1.0/6.0)      rgb = vec3(c, x, 0.0);
        else if (hue < 2.0/6.0) rgb = vec3(x, c, 0.0);
        else if (hue < 3.0/6.0) rgb = vec3(0.0, c, x);
        else if (hue < 4.0/6.0) rgb = vec3(0.0, x, c);
        else if (hue < 5.0/6.0) rgb = vec3(x, 0.0, c);
        else                    rgb = vec3(c, 0.0, x);
        rgb += m;

        vec3 color;
        float alpha;
        if (vIsEdge > 1.5) {
          color = vec3(1.0, 0.0, 1.0);
          alpha = 0.0;
        } else if (vIsEdge > 0.5) {
          color = mix(vec3(0.0, 0.9, 1.0), rgb, 0.5) * (core + 0.9 * glow);
          alpha = vAlpha * 1.0 * (glow + 0.7 * core) * twinkle;
        } else {
          color = mix(vec3(1.0, 1.0, 1.0), rgb, 0.7) * (core + 0.9 * glow);
          alpha = vAlpha * 1.0 * (glow + 0.9 * core) * twinkle;
        }
        outColor = vec4(color, alpha);
      }
    `;

    const mat = new THREE.RawShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { 
        uTime: { value: 0 }, 
        uMorph: { value: 0 },
        uQueenPos: { value: new THREE.Vector2(queenX, queenY) },
        uAppearDuration: { value: 2.0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uPhase: { value: 0 }
      },
      glslVersion: THREE.GLSL3,
      vertexShader: vertex300,
      fragmentShader: fragment300,
      blending: THREE.AdditiveBlending,
    });

    scene.add(new THREE.Mesh(geo, mat));

    const hiveCenter = { x: -0.42, y: 0.12 };
    const Rx = 0.08;
    const Ry = 0.05;

    const updateQueenPosition = (t: number) => {
      const deltaTime = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;
      
      const phaseSpeed = 0.3;
      mat.uniforms.uPhase.value += deltaTime * phaseSpeed;
      
      const follow = 0.02;
      const targetX = hiveCenter.x + cursorRef.current.x * follow;
      const targetY = hiveCenter.y + cursorRef.current.y * follow;
      
      const queenOffsetX = Rx * Math.sin(mat.uniforms.uPhase.value);
      const queenOffsetY = Ry * Math.sin(mat.uniforms.uPhase.value) * Math.cos(mat.uniforms.uPhase.value);
      
      mat.uniforms.uQueenPos.value.x += (targetX + queenOffsetX - mat.uniforms.uQueenPos.value.x) * 0.1;
      mat.uniforms.uQueenPos.value.y += (targetY + queenOffsetY - mat.uniforms.uQueenPos.value.y) * 0.1;
    };

    const render = (t: number) => {
      updateQueenPosition(t);
      mat.uniforms.uTime.value = t / 1000;
      
      if (needsCursorUpdateRef.current) {
        mat.uniforms.uCursor.value.set(cursorRef.current.x, cursorRef.current.y);
        needsCursorUpdateRef.current = false;
      }
      
      renderer.render(scene, camera);
    };
    renderRef.current = render;

    if (isPlaying) {
      lastTimeRef.current = performance.now();
      renderer.setAnimationLoop(render);
    }

    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width === lastW && height === lastH) return;
      
      lastW = width;
      lastH = height;
      
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width <= 1080 ? 1.5 : 2));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.setAnimationLoop(null);
      isAnimatingRef.current = false;
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      scene.clear();
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-[200%] h-[150%] -left-[30%] -top-[25%]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <button
        className="absolute right-4 bottom-4 rounded bg-black/60 px-3 py-1 text-sm text-white"
        onClick={() => {
          const next = !isPlaying;
          setIsPlaying(next);
          isAnimatingRef.current = next;
          if (next) {
            lastTimeRef.current = performance.now();
          }
          rendererRef.current?.setAnimationLoop(next ? renderRef.current : null);
        }}
        aria-label="Toggle animation"
      >
        {isPlaying ? 'Pause motion' : 'Play motion'}
      </button>
    </div>
  );
} 