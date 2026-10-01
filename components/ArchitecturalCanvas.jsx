'use client';

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";

/**
 * Procedural Villa Wireframe Geometry Definition
 * Contemporary brutalist minimalist residence decomposed into 4 structural phases:
 * Phase 1: Foundation & Ground Grid (0.0s - 1.2s)
 * Phase 2: Vertical Structural Columns (1.0s - 2.5s)
 * Phase 3: Horizontal Slabs, Roof Planes & Cantilevers (2.2s - 3.8s)
 * Phase 4: Louvers, Mullions & Interior Partitions (3.5s - 5.0s)
 */
function createBoxEdges(width, height, depth) {
  const geo = new THREE.BoxGeometry(width, height, depth);
  const edges = new THREE.EdgesGeometry(geo);
  geo.dispose();
  return edges;
}

function ProceduralArchitecturalVilla({ animTrigger }) {
  // Phase Group References
  const foundationGroup = useRef();
  const columnGroup = useRef();
  const slabGroup = useRef();
  const detailGroup = useRef();
  const gridGroup = useRef();

  // 1. Line Geometries for Villa Elements
  const geometries = useMemo(() => {
    return {
      // Foundation & Podiums
      mainPodium: createBoxEdges(14, 0.4, 9),
      terracePlinth: createBoxEdges(7, 0.25, 6),
      poolPerimeter: createBoxEdges(5.5, 0.15, 3.5),

      // Vertical Columns
      columnGeo: createBoxEdges(0.2, 3.2, 0.2),
      stairColumnGeo: createBoxEdges(0.15, 6.0, 0.15),

      // Horizontal Volumes & Slabs
      groundVolume: createBoxEdges(9, 3.2, 6.5),
      cantileverVolume: createBoxEdges(10.5, 2.8, 6.2),
      roofSlab: createBoxEdges(13.5, 0.35, 8.5),
      carportCanopy: createBoxEdges(6, 0.25, 5.5),

      // Louvers & Framing Details
      louverGeo: createBoxEdges(0.04, 2.6, 0.35),
      windowFrameH: createBoxEdges(4.5, 0.05, 0.05),
      windowFrameV: createBoxEdges(0.05, 2.5, 0.05),
    };
  }, []);

  // 2. Column Coordinates (X, Z) across structural grid
  const columnPositions = useMemo(() => [
    [-4.2, -2.8], [-1.5, -2.8], [1.5, -2.8], [4.2, -2.8],
    [-4.2,  0.0], [-1.5,  0.0], [1.5,  0.0], [4.2,  0.0],
    [-4.2,  2.8], [-1.5,  2.8], [1.5,  2.8], [4.2,  2.8],
  ], []);

  // 3. Brise-soleil / Louver positions (X spacing)
  const louverPositions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      list.push(1.6 + i * 0.3);
    }
    return list;
  }, []);

  // 4. GSAP Assembly Timeline (0.0s to 5.0s)
  useEffect(() => {
    const animState = {
      p1: 0, // Foundation (0.0s - 1.2s)
      p2: 0, // Columns (1.0s - 2.5s)
      p3: 0, // Slabs & Roof (2.2s - 3.8s)
      p4: 0, // Louvers & Mullions (3.5s - 5.0s)
    };

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onUpdate: () => {
        // Phase 1: Foundation expands outward
        if (foundationGroup.current) {
          foundationGroup.current.scale.set(animState.p1, Math.max(animState.p1, 0.001), animState.p1);
          foundationGroup.current.traverse((child) => {
            if (child.material) child.material.opacity = animState.p1 * 0.9;
          });
        }
        if (gridGroup.current) {
          gridGroup.current.scale.set(animState.p1, 1, animState.p1);
        }

        // Phase 2: Vertical columns shoot upward
        if (columnGroup.current) {
          columnGroup.current.scale.y = animState.p2;
          columnGroup.current.traverse((child) => {
            if (child.material) child.material.opacity = animState.p2;
          });
        }

        // Phase 3: Horizontal slabs & cantilever volumes sweep in
        if (slabGroup.current) {
          slabGroup.current.scale.set(1, animState.p3, 1);
          slabGroup.current.position.y = (1 - animState.p3) * 1.5;
          slabGroup.current.traverse((child) => {
            if (child.material) child.material.opacity = animState.p3 * 0.95;
          });
        }

        // Phase 4: Finer interior partitions & louvers resolve
        if (detailGroup.current) {
          detailGroup.current.scale.y = animState.p4;
          detailGroup.current.traverse((child) => {
            if (child.material) child.material.opacity = animState.p4 * 0.85;
          });
        }
      }
    });

    // Phase 1: Foundation (0.0s - 1.2s)
    tl.to(animState, { p1: 1, duration: 1.2 }, 0.0);

    // Phase 2: Columns (1.0s - 2.5s)
    tl.to(animState, { p2: 1, duration: 1.5, ease: "expo.out" }, 1.0);

    // Phase 3: Slabs & Roof (2.2s - 3.8s)
    tl.to(animState, { p3: 1, duration: 1.6, ease: "power3.out" }, 2.2);

    // Phase 4: Mullions & Louvers (3.5s - 5.0s)
    tl.to(animState, { p4: 1, duration: 1.5, ease: "power2.out" }, 3.5);

    return () => tl.kill();
  }, [animTrigger]);

  return (
    <group position={[0, -1.2, 0]}>
      {/* ============================================================
          PHASE 1: FOUNDATION & OUTDOOR PLINTHS (0.0s - 1.2s)
          ============================================================ */}
      <group ref={foundationGroup} scale={[0, 0, 0]}>
        {/* Main Base Podium */}
        <lineSegments position={[0, 0.2, 0]} geometry={geometries.mainPodium}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0} linewidth={1.5} />
        </lineSegments>

        {/* Terrace Step Plinth */}
        <lineSegments position={[-4.5, 0.12, 3.5]} geometry={geometries.terracePlinth}>
          <lineBasicMaterial color="#a0a0a0" transparent opacity={0} linewidth={1} />
        </lineSegments>

        {/* Sunken Reflecting Pool Outline */}
        <lineSegments position={[3.8, 0.08, 3.2]} geometry={geometries.poolPerimeter}>
          <lineBasicMaterial color="#666666" transparent opacity={0} linewidth={1} />
        </lineSegments>
      </group>

      {/* ============================================================
          PHASE 2: VERTICAL STRUCTURAL COLUMNS (1.0s - 2.5s)
          ============================================================ */}
      <group ref={columnGroup} scale={[1, 0, 1]}>
        {columnPositions.map(([x, z], i) => (
          <lineSegments key={`col-${i}`} position={[x, 1.8, z]} geometry={geometries.columnGeo}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0} linewidth={1.8} />
          </lineSegments>
        ))}

        {/* Double-Height Stair Spine Columns */}
        <lineSegments position={[-1.5, 3.2, 0.2]} geometry={geometries.stairColumnGeo}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0} linewidth={2} />
        </lineSegments>
        <lineSegments position={[-1.5, 3.2, -1.2]} geometry={geometries.stairColumnGeo}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0} linewidth={2} />
        </lineSegments>
      </group>

      {/* ============================================================
          PHASE 3: HORIZONTAL SLABS, ROOF & CANTILEVERS (2.2s - 3.8s)
          ============================================================ */}
      <group ref={slabGroup} scale={[1, 0, 1]}>
        {/* Ground Floor Living Pavilion Wireframe */}
        <lineSegments position={[-0.8, 1.8, -0.2]} geometry={geometries.groundVolume}>
          <lineBasicMaterial color="#e5e5e5" transparent opacity={0} linewidth={1.5} />
        </lineSegments>

        {/* First Floor Cantilevered Volume */}
        <lineSegments position={[1.4, 4.6, 0.4]} geometry={geometries.cantileverVolume}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0} linewidth={2} />
        </lineSegments>

        {/* Cantilevered Flat Roof Slab */}
        <lineSegments position={[1.2, 6.1, 0.4]} geometry={geometries.roofSlab}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0} linewidth={2.2} />
        </lineSegments>

        {/* Entry Carport Canopy Beam Frame */}
        <lineSegments position={[-4.2, 3.3, 2.6]} geometry={geometries.carportCanopy}>
          <lineBasicMaterial color="#888888" transparent opacity={0} linewidth={1.2} />
        </lineSegments>
      </group>

      {/* ============================================================
          PHASE 4: WINDOW MULLIONS, LOUVERS & DETAILS (3.5s - 5.0s)
          ============================================================ */}
      <group ref={detailGroup} scale={[1, 0, 1]}>
        {/* Architectural Wooden Louver Slats (Upper Cantilever) */}
        {louverPositions.map((x, i) => (
          <lineSegments key={`louver-${i}`} position={[x, 4.6, 3.55]} geometry={geometries.louverGeo}>
            <lineBasicMaterial color="#d4d4d4" transparent opacity={0} linewidth={1} />
          </lineSegments>
        ))}

        {/* Ground Floor Full Glazing Mullions */}
        <lineSegments position={[-1.2, 1.8, 3.06]} geometry={geometries.windowFrameH}>
          <lineBasicMaterial color="#999999" transparent opacity={0} linewidth={1} />
        </lineSegments>
        <lineSegments position={[-2.8, 1.8, 3.06]} geometry={geometries.windowFrameV}>
          <lineBasicMaterial color="#999999" transparent opacity={0} linewidth={1} />
        </lineSegments>
        <lineSegments position={[0.4, 1.8, 3.06]} geometry={geometries.windowFrameV}>
          <lineBasicMaterial color="#999999" transparent opacity={0} linewidth={1} />
        </lineSegments>

        {/* Floating Stair Treads */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => (
          <lineSegments
            key={`step-${step}`}
            position={[-1.5, 0.6 + step * 0.32, -0.5 + step * 0.28]}
            geometry={createBoxEdges(1.6, 0.05, 0.32)}
          >
            <lineBasicMaterial color="#737373" transparent opacity={0} linewidth={1} />
          </lineSegments>
        ))}
      </group>

      {/* ============================================================
          CAD BLUEPRINT DRAFTING GROUND GRID
          ============================================================ */}
      <group ref={gridGroup} position={[0, 0, 0]} scale={[0, 1, 0]}>
        <gridHelper args={[48, 48, "#333333", "#141414"]} position={[0, -0.01, 0]} />

        {/* Major Axis Lines */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={4}
              array={new Float32Array([
                -24, 0, 0,  24, 0, 0,
                0, 0, -24,  0, 0, 24
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#262626" linewidth={1} />
        </lineSegments>
      </group>
    </group>
  );
}

/**
 * Camera Choreographer & Mouse Parallax Controller
 */
function CameraController({ animTrigger }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Initial Low Isometric Coordinates
    camera.position.set(19, 3.5, 23);
    camera.lookAt(0, 2.0, 0);

    // Smooth Orbit & Ascend Animation Timeline (0.0s - 4.8s)
    const anim = gsap.to(camera.position, {
      x: 13.5,
      y: 8.5,
      z: 14.5,
      duration: 4.8,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(0, 2.0, 0);
      }
    });

    const handleMouseMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      anim.kill();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, animTrigger]);

  // Dampened Mouse Parallax Frame Loop (60 FPS)
  useFrame(() => {
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.035;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.035;

    camera.position.x += mouse.current.x * 0.025;
    camera.position.y += mouse.current.y * 0.018;
    camera.lookAt(0, 2.0, 0);
  });

  return null;
}

/**
 * Main Architectural Canvas Component
 */
export default function ArchitecturalCanvas({ animTrigger = 0 }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#000000] cursor-grab active:cursor-grabbing">
      <Canvas
        dpr={[1, 2]} // Performance: clamp pixel ratio to [1, 2]
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{
          fov: 36,
          near: 0.1,
          far: 150,
          position: [19, 3.5, 23],
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 25, 65]} />

        {/* Architectural Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[15, 25, 10]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-15, 10, -10]} intensity={0.3} color="#909090" />

        {/* Camera Choreography & Mouse Parallax */}
        <CameraController animTrigger={animTrigger} />

        {/* Procedural 3D Villa Wireframe */}
        <ProceduralArchitecturalVilla animTrigger={animTrigger} />

        {/* Controlled Orbit Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.08}
          minPolarAngle={Math.PI / 4.2}
          maxAzimuthAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 4}
        />

        {/* Subtle Post-Processing Bloom for Luminescent CAD lines */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            intensity={0.45}
            radius={0.35}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
